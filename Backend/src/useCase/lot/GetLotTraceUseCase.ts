import { ILotRepository } from '../../domain/interface/repositoryInterface/ILotRepository';
import { ILotEventRepository } from '../../domain/interface/repositoryInterface/ILotEventRepository';
import { IDonationRepository } from '../../domain/interface/repositoryInterface/IDonationRepository';
import { LotTraceResponseDTO, LotEventDTO, LotResponseDTO } from '../../domain/interface/DTOs/LotDTO';
import { NotFoundError } from '../../shared/errors/AppError';

export interface IGetLotTraceUseCase {
  execute(lotId: string): Promise<LotTraceResponseDTO>;
}

export class GetLotTraceUseCase implements IGetLotTraceUseCase {
  constructor(
    private readonly lotRepository: ILotRepository,
    private readonly lotEventRepository: ILotEventRepository,
    private readonly donationRepository: IDonationRepository
  ) {}

  async execute(lotId: string): Promise<LotTraceResponseDTO> {
    const lot = await this.lotRepository.findById(lotId);
    if (!lot) {
      throw new NotFoundError(`Lot with identifier '${lotId}' was not found`);
    }

    const [events, donation] = await Promise.all([
      this.lotEventRepository.findByLotId(lot.id!),
      lot.donationId ? this.donationRepository.findById(lot.donationId) : Promise.resolve(null)
    ]);

    const lotDTO: LotResponseDTO = {
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
      donorName: donation ? donation.donorName : (lot as any).donorName,
      donorType: donation ? donation.donorType : (lot as any).donorType,
      status: lot.status,
      createdBy: lot.createdBy,
      createdAt: lot.createdAt ? lot.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: lot.updatedAt ? lot.updatedAt.toISOString() : new Date().toISOString()
    };

    const timelineDTOs: LotEventDTO[] = events.map((evt) => ({
      id: evt.id!,
      lotId: evt.lotId,
      eventType: evt.eventType,
      previousStatus: evt.previousStatus,
      newStatus: evt.newStatus,
      performedBy: evt.performedBy,
      notes: evt.notes,
      timestamp: evt.timestamp.toISOString()
    }));

    // If timeline is empty (e.g. legacy lots), build a synthetic initial trace event
    if (timelineDTOs.length === 0) {
      if (donation) {
        timelineDTOs.push({
          id: `initial-donation-${donation.id}`,
          lotId: lot.id!,
          eventType: 'DONATION_INTAKE_RECORDED',
          newStatus: 'received',
          performedBy: {
            id: donation.receivedBy.id,
            name: donation.receivedBy.name,
            role: 'Donation Clerk'
          },
          notes: `Donation intake recorded (${donation.donationNumber}) by ${donation.donorName}`,
          timestamp: donation.receivedAt.toISOString()
        });
      }

      timelineDTOs.push({
        id: `initial-lot-${lot.id}`,
        lotId: lot.id!,
        eventType: 'LOT_CREATED',
        previousStatus: undefined,
        newStatus: lot.status,
        performedBy: lot.createdBy,
        notes: `Lot #${lot.lotNumber} created for item '${lot.itemName}'`,
        timestamp: lot.receivedDate ? lot.receivedDate.toISOString() : (lot.createdAt ? lot.createdAt.toISOString() : new Date().toISOString())
      });
    }

    return {
      lot: lotDTO,
      donation: donation
        ? {
            id: donation.id!,
            donationNumber: donation.donationNumber,
            donorName: donation.donorName,
            donorType: donation.donorType,
            receivedAt: donation.receivedAt.toISOString(),
            status: donation.status
          }
        : undefined,
      timeline: timelineDTOs
    };
  }
}
