import { IDonationRepository } from '../../domain/interface/repositoryInterface/IDonationRepository';
import { ILotRepository } from '../../domain/interface/repositoryInterface/ILotRepository';
import { ILotEventRepository } from '../../domain/interface/repositoryInterface/ILotEventRepository';
import { CreateDonationDTO, DonationResponseDTO, DonationLineResponseDTO } from '../../domain/interface/DTOs/DonationDTO';
import { LotResponseDTO } from '../../domain/interface/DTOs/LotDTO';
import { Donation } from '../../domain/entities/Donation';
import { Lot, LotStatus } from '../../domain/entities/Lot';
import { LotEvent } from '../../domain/entities/LotEvent';
import { BadRequestError } from '../../shared/errors/AppError';

export interface ICreateDonationUseCase {
  execute(
    dto: CreateDonationDTO,
    clerkId: string,
    clerkName: string
  ): Promise<{ donation: DonationResponseDTO; lots: LotResponseDTO[] }>;
}

export class CreateDonationUseCase implements ICreateDonationUseCase {
  constructor(
    private readonly donationRepository: IDonationRepository,
    private readonly lotRepository: ILotRepository,
    private readonly lotEventRepository?: ILotEventRepository
  ) {}

  async execute(
    dto: CreateDonationDTO,
    clerkId: string,
    clerkName: string
  ): Promise<{ donation: DonationResponseDTO; lots: LotResponseDTO[] }> {
    // 1. Validation
    if (!dto.donorName || !dto.donorName.trim()) {
      throw new BadRequestError('Donor name is required');
    }

    if (!dto.donorType || !dto.donorType.trim()) {
      throw new BadRequestError('Donor type is required');
    }

    if (!dto.lines || !Array.isArray(dto.lines) || dto.lines.length === 0) {
      throw new BadRequestError('Donation must contain at least one line item');
    }

    for (let i = 0; i < dto.lines.length; i++) {
      const line = dto.lines[i];
      if (!line.itemName || !line.itemName.trim()) {
        throw new BadRequestError(`Line item #${i + 1} must have a valid item name`);
      }
      if (!line.quantity || line.quantity <= 0) {
        throw new BadRequestError(`Line item '${line.itemName}' quantity must be greater than zero`);
      }
      if (!line.unit || !line.unit.trim()) {
        throw new BadRequestError(`Line item '${line.itemName}' unit is required`);
      }
    }

    // 2. Generate Donation Number
    const count = await this.donationRepository.count();
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const seq = (count + 1).toString().padStart(4, '0');
    const donationNumber = `DON-${datePrefix}-${seq}`;

    const receivedAtDate = dto.receivedAt ? new Date(dto.receivedAt) : new Date();

    // 3. Create Donation Domain Entity
    const donationEntity = new Donation({
      donationNumber,
      donorName: dto.donorName,
      donorType: dto.donorType,
      receivedAt: receivedAtDate,
      receivedBy: { id: clerkId, name: clerkName },
      lines: dto.lines.map((l) => ({
        itemName: l.itemName,
        category: l.category || 'General',
        quantity: l.quantity,
        unit: l.unit,
        printedExpiryDate: l.printedExpiryDate ? new Date(l.printedExpiryDate) : undefined,
        notes: l.notes
      })),
      notes: dto.notes,
      status: 'received'
    });

    // 4. Save Donation
    const savedDonation = await this.donationRepository.create(donationEntity);
    if (!savedDonation.id) {
      throw new Error('Failed to save donation intake');
    }

    // 5. Generate Inventory Lots for every line item
    const lotCount = await this.lotRepository.count();
    const lotEntities: Lot[] = savedDonation.lines.map((line, idx) => {
      const lotSeq = (lotCount + idx + 1).toString().padStart(4, '0');
      const lotNumber = `LOT-${datePrefix}-${lotSeq}`;

      const safetyMarginDays = dto.lines[idx]?.safetyMarginDays ?? 3;
      const printedDate = line.printedExpiryDate ? new Date(line.printedExpiryDate) : undefined;
      const effectiveDate = Lot.calculateEffectiveExpiryDate(printedDate, safetyMarginDays);

      return new Lot({
        lotNumber,
        itemName: line.itemName,
        category: line.category || 'General',
        quantity: line.quantity,
        availableQuantity: line.quantity,
        unit: line.unit,
        receivedDate: savedDonation.receivedAt,
        printedExpiryDate: printedDate,
        safetyMarginDays,
        effectiveExpiryDate: effectiveDate,
        donationId: savedDonation.id!,
        donationLineId: line.id,
        status: LotStatus.RECEIVED,
        createdBy: { id: clerkId, name: clerkName }
      });
    });

    // 6. Save Lots
    const savedLots = await this.lotRepository.createMany(lotEntities);

    // 7. Save initial Lot Events if repository provided
    if (this.lotEventRepository && savedLots.length > 0) {
      const events = savedLots.map(
        (lot) =>
          new LotEvent({
            lotId: lot.id!,
            eventType: 'LOT_CREATED',
            previousStatus: undefined,
            newStatus: LotStatus.RECEIVED,
            performedBy: {
              id: clerkId,
              name: clerkName,
              role: 'Donation Clerk'
            },
            notes: `Lot #${lot.lotNumber} generated from donation intake ${savedDonation.donationNumber}`,
            timestamp: new Date()
          })
      );
      await this.lotEventRepository.createMany(events);
    }

    // 8. Map Response DTOs
    const donationResponse: DonationResponseDTO = {
      id: savedDonation.id,
      donationNumber: savedDonation.donationNumber,
      donorName: savedDonation.donorName,
      donorType: savedDonation.donorType,
      receivedAt: savedDonation.receivedAt.toISOString(),
      receivedBy: savedDonation.receivedBy,
      lines: savedDonation.lines.map((l): DonationLineResponseDTO => ({
        id: l.id,
        itemName: l.itemName,
        category: l.category || 'General',
        quantity: l.quantity,
        unit: l.unit,
        printedExpiryDate: l.printedExpiryDate ? l.printedExpiryDate.toISOString() : undefined,
        notes: l.notes
      })),
      totalLines: savedDonation.lines.length,
      totalQuantity: savedDonation.lines.reduce((sum, l) => sum + l.quantity, 0),
      notes: savedDonation.notes,
      status: savedDonation.status,
      createdAt: savedDonation.createdAt ? savedDonation.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: savedDonation.updatedAt ? savedDonation.updatedAt.toISOString() : new Date().toISOString()
    };

    const lotResponses: LotResponseDTO[] = savedLots.map((lot) => ({
      id: lot.id!,
      lotNumber: lot.lotNumber,
      itemName: lot.itemName,
      category: lot.category,
      quantity: lot.quantity,
      availableQuantity: lot.availableQuantity,
      unit: lot.unit,
      receivedDate: lot.receivedDate.toISOString(),
      printedExpiryDate: lot.printedExpiryDate ? lot.printedExpiryDate.toISOString() : undefined,
      safetyMarginDays: lot.safetyMarginDays,
      effectiveExpiryDate: lot.effectiveExpiryDate ? lot.effectiveExpiryDate.toISOString() : undefined,
      donationId: lot.donationId,
      donationLineId: lot.donationLineId,
      donorName: savedDonation.donorName,
      donorType: savedDonation.donorType,
      status: lot.status,
      createdBy: lot.createdBy,
      createdAt: lot.createdAt ? lot.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: lot.updatedAt ? lot.updatedAt.toISOString() : new Date().toISOString()
    }));

    return {
      donation: donationResponse,
      lots: lotResponses
    };
  }
}
