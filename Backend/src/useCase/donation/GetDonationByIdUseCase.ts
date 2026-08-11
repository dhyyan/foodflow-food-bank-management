import { IDonationRepository } from '../../domain/interface/repositoryInterface/IDonationRepository';
import { ILotRepository } from '../../domain/interface/repositoryInterface/ILotRepository';
import { DonationResponseDTO, DonationLineResponseDTO } from '../../domain/interface/DTOs/DonationDTO';
import { LotResponseDTO } from '../../domain/interface/DTOs/LotDTO';
import { NotFoundError } from '../../shared/errors/AppError';

export interface IGetDonationByIdUseCase {
  execute(id: string): Promise<{ donation: DonationResponseDTO; lots: LotResponseDTO[] }>;
}

export class GetDonationByIdUseCase implements IGetDonationByIdUseCase {
  constructor(
    private readonly donationRepository: IDonationRepository,
    private readonly lotRepository: ILotRepository
  ) {}

  async execute(id: string): Promise<{ donation: DonationResponseDTO; lots: LotResponseDTO[] }> {
    const donation = await this.donationRepository.findById(id);

    if (!donation || !donation.id) {
      throw new NotFoundError(`Donation with ID '${id}' was not found`);
    }

    const lots = await this.lotRepository.findByDonationId(donation.id);

    const donationDTO: DonationResponseDTO = {
      id: donation.id,
      donationNumber: donation.donationNumber,
      donorName: donation.donorName,
      donorType: donation.donorType,
      receivedAt: donation.receivedAt.toISOString(),
      receivedBy: donation.receivedBy,
      lines: donation.lines.map((l): DonationLineResponseDTO => ({
        id: l.id,
        itemName: l.itemName,
        category: l.category || 'General',
        quantity: l.quantity,
        unit: l.unit,
        printedExpiryDate: l.printedExpiryDate ? l.printedExpiryDate.toISOString() : undefined,
        notes: l.notes
      })),
      totalLines: donation.lines.length,
      totalQuantity: donation.lines.reduce((sum, l) => sum + l.quantity, 0),
      notes: donation.notes,
      status: donation.status,
      createdAt: donation.createdAt ? donation.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: donation.updatedAt ? donation.updatedAt.toISOString() : new Date().toISOString()
    };

    const lotDTOs: LotResponseDTO[] = lots.map((lot) => ({
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
      status: lot.status,
      createdBy: lot.createdBy,
      createdAt: lot.createdAt ? lot.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: lot.updatedAt ? lot.updatedAt.toISOString() : new Date().toISOString()
    }));

    return {
      donation: donationDTO,
      lots: lotDTOs
    };
  }
}
