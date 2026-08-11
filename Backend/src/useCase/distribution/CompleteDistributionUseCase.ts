import { IDistributionRepository } from '../../domain/interface/repositoryInterface/IDistributionRepository';
import { ILotRepository } from '../../domain/interface/repositoryInterface/ILotRepository';
import { IReservationRepository } from '../../domain/interface/repositoryInterface/IReservationRepository';
import { ILotEventRepository } from '../../domain/interface/repositoryInterface/ILotEventRepository';
import { LotStatus } from '../../domain/entities/Lot';
import { LotEvent } from '../../domain/entities/LotEvent';
import { DistributionResponseDTO } from '../../domain/interface/DTOs/DistributionDTO';
import { BadRequestError, NotFoundError } from '../../shared/errors/AppError';

export class CompleteDistributionUseCase {
  constructor(
    private readonly distributionRepository: IDistributionRepository,
    private readonly lotRepository: ILotRepository,
    private readonly reservationRepository: IReservationRepository,
    private readonly lotEventRepository: ILotEventRepository
  ) {}

  async execute(distributionId: string, coordinator: { id: string; name: string }): Promise<DistributionResponseDTO> {
    const distribution = await this.distributionRepository.findById(distributionId);
    if (!distribution) {
      throw new NotFoundError('Distribution with provided ID was not found');
    }

    if (distribution.status !== 'reserved') {
      throw new BadRequestError(
        `Distribution cannot be completed because its current status is '${distribution.status}'. Only 'reserved' distributions can be completed.`
      );
    }

    // Retrieve active reservations for this distribution
    const reservations = await this.reservationRepository.findByDistributionId(distribution.id!);
    const lotEvents: LotEvent[] = [];

    for (const res of reservations) {
      if (res.status === 'reserved') {
        const lot = await this.lotRepository.findById(res.lotId);
        if (lot) {
          const newQuantity = Math.max(0, lot.quantity - res.quantity);
          lot.quantity = newQuantity;

          // If available quantity is 0 and total quantity reaches 0, transition status to RELEASED
          if (lot.availableQuantity === 0 && lot.quantity === 0) {
            lot.status = LotStatus.RELEASED;
          }

          await this.lotRepository.update(lot);

          lotEvents.push(
            new LotEvent({
              lotId: lot.id!,
              eventType: 'RELEASED',
              previousStatus: LotStatus.RESERVED,
              newStatus: lot.status,
              performedBy: {
                id: coordinator.id,
                name: coordinator.name
              },
              notes: `Released ${res.quantity} units for completed Distribution #${distribution.distributionNumber}`
            })
          );
        }
      }
    }

    // Update reservation statuses
    await this.reservationRepository.updateStatusByDistributionId(distribution.id!, 'released');

    // Create lot events
    if (lotEvents.length > 0) {
      await this.lotEventRepository.createMany(lotEvents);
    }

    // Update distribution status to completed
    const updated = await this.distributionRepository.updateStatus(distribution.id!, 'completed', {
      completedAt: new Date()
    });

    const updatedReservations = await this.reservationRepository.findByDistributionId(distribution.id!);

    return {
      id: updated!.id!,
      distributionNumber: updated!.distributionNumber,
      recipientId: updated!.recipientId,
      recipientName: updated!.recipientName,
      recipientType: updated!.recipientType,
      items: updated!.items,
      status: updated!.status,
      reservations: updatedReservations.map((r) => ({
        id: r.id!,
        distributionId: r.distributionId,
        lotId: r.lotId,
        lotNumber: r.lotNumber,
        itemName: r.itemName,
        quantity: r.quantity,
        unit: r.unit,
        status: r.status,
        createdBy: r.createdBy,
        createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString()
      })),
      createdBy: updated!.createdBy,
      notes: updated!.notes,
      reservedAt: updated!.reservedAt ? updated!.reservedAt.toISOString() : undefined,
      completedAt: updated!.completedAt ? updated!.completedAt.toISOString() : undefined,
      createdAt: updated!.createdAt ? updated!.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: updated!.updatedAt ? updated!.updatedAt.toISOString() : new Date().toISOString()
    };
  }
}
