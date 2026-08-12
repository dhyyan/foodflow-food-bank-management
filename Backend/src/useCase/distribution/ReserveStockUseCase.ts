import { IDistributionRepository } from '../../domain/interface/repositoryInterface/IDistributionRepository';
import { IRecipientRepository } from '../../domain/interface/repositoryInterface/IRecipientRepository';
import { ILotRepository } from '../../domain/interface/repositoryInterface/ILotRepository';
import { IReservationRepository } from '../../domain/interface/repositoryInterface/IReservationRepository';
import { ILotEventRepository } from '../../domain/interface/repositoryInterface/ILotEventRepository';
import { LotStatus } from '../../domain/entities/Lot';
import { Reservation } from '../../domain/entities/Reservation';
import { LotEvent } from '../../domain/entities/LotEvent';
import { DistributionResponseDTO } from '../../domain/interface/DTOs/DistributionDTO';
import { BadRequestError, NotFoundError, ConflictError } from '../../shared/errors/AppError';

export class ReserveStockUseCase {
  constructor(
    private readonly distributionRepository: IDistributionRepository,
    private readonly recipientRepository: IRecipientRepository,
    private readonly lotRepository: ILotRepository,
    private readonly reservationRepository: IReservationRepository,
    private readonly lotEventRepository: ILotEventRepository
  ) {}

  async execute(distributionId: string, coordinator: { id: string; name: string }): Promise<DistributionResponseDTO> {
    const distribution = await this.distributionRepository.findById(distributionId);
    if (!distribution) {
      throw new NotFoundError('Distribution request not found');
    }

    if (distribution.status !== 'pending') {
      throw new BadRequestError(`Distribution is already in '${distribution.status}' status`);
    }

    // Re-validate family monthly quota before reserving
    const recipient = await this.recipientRepository.findById(distribution.recipientId);
    if (!recipient) {
      throw new NotFoundError('Associated recipient not found');
    }

    if (recipient.type === 'family') {
      const now = new Date();
      const currentYear = now.getUTCFullYear();
      const currentMonth = now.getUTCMonth() + 1;

      const alreadyReceived = await this.distributionRepository.sumMonthlyUnitsByRecipientId(
        recipient.id!,
        currentYear,
        currentMonth
      );

      const requestedTotal = distribution.items.reduce((sum, item) => sum + item.requestedQuantity, 0);
      const quota = recipient.monthlyQuota || 50;

      if (alreadyReceived + requestedTotal > quota) {
        const remainingQuota = Math.max(0, quota - alreadyReceived);
        throw new BadRequestError(
          `Monthly family quota exceeded during reservation. Only ${remainingQuota} units remaining for this month.`,
          'MONTHLY_QUOTA_EXCEEDED'
        );
      }
    }

    // Step 2: Re-query eligible inventory lots atomically and calculate FEFO allocations
    const now = new Date();
    const { lots: shelvedLots } = await this.lotRepository.findAll({
      status: LotStatus.SHELVED,
      sortBy: 'effectiveExpiryDate',
      sortOrder: 'asc',
      limit: 1000
    });

    const plannedReservations: Reservation[] = [];
    const lotUpdates: Array<{ lot: any; reservedAmount: number; newAvailableQuantity: number; newStatus: LotStatus }> = [];
    const lotEvents: LotEvent[] = [];

    for (const item of distribution.items) {
      let remainingToAllocate = item.requestedQuantity;

      // Filter eligible lots
      const candidateLots = shelvedLots.filter((lot) => {
        if (lot.status !== LotStatus.SHELVED) return false;
        if (lot.availableQuantity <= 0) return false;
        if (lot.itemName.trim().toLowerCase() !== item.itemName.trim().toLowerCase()) return false;
        if (lot.effectiveExpiryDate && new Date(lot.effectiveExpiryDate) <= now) return false;
        return true;
      });

      candidateLots.sort((a, b) => {
        if (a.effectiveExpiryDate && b.effectiveExpiryDate) {
          return new Date(a.effectiveExpiryDate).getTime() - new Date(b.effectiveExpiryDate).getTime();
        }
        if (a.effectiveExpiryDate) return -1;
        if (b.effectiveExpiryDate) return 1;
        return 0;
      });

      for (const lot of candidateLots) {
        if (remainingToAllocate <= 0) break;

        const available = lot.availableQuantity;
        const takeQuantity = Math.min(available, remainingToAllocate);

        remainingToAllocate -= takeQuantity;
        const newAvailable = available - takeQuantity;
        // If all available units are reserved, update lot status to RESERVED, else remain SHELVED with lower available quantity
        const newStatus = newAvailable === 0 ? LotStatus.RESERVED : LotStatus.SHELVED;

        lotUpdates.push({
          lot,
          reservedAmount: takeQuantity,
          newAvailableQuantity: newAvailable,
          newStatus
        });

        // Deduct locally for subsequent items in loop if any
        lot.availableQuantity = newAvailable;
        if (newAvailable === 0) lot.status = LotStatus.RESERVED;

        plannedReservations.push(
          new Reservation({
            distributionId: distribution.id!,
            lotId: lot.id!,
            lotNumber: lot.lotNumber,
            itemName: lot.itemName,
            quantity: takeQuantity,
            unit: item.unit,
            status: 'reserved',
            createdBy: {
              id: coordinator.id,
              name: coordinator.name
            }
          })
        );
      }

      if (remainingToAllocate > 0) {
        throw new ConflictError(
          `Insufficient stock available for '${item.itemName}'. Needed ${item.requestedQuantity}, but could only allocate ${item.requestedQuantity - remainingToAllocate} units from non-expired shelved stock.`
        );
      }
    }

    // Step 3: Commit inventory updates, reservations, and events
    for (const update of lotUpdates) {
      const lotEntity = update.lot;
      lotEntity.availableQuantity = update.newAvailableQuantity;
      lotEntity.status = update.newStatus;
      await this.lotRepository.update(lotEntity);

      lotEvents.push(
        new LotEvent({
          lotId: lotEntity.id!,
          eventType: 'RESERVED',
          previousStatus: LotStatus.SHELVED,
          newStatus: update.newStatus,
          performedBy: {
            id: coordinator.id,
            name: coordinator.name
          },
          notes: `Reserved ${update.reservedAmount} units for Distribution #${distribution.distributionNumber}`
        })
      );
    }

    const createdReservations = await this.reservationRepository.createMany(plannedReservations);
    if (lotEvents.length > 0) {
      await this.lotEventRepository.createMany(lotEvents);
    }

    // Update distribution status
    const updatedDistribution = await this.distributionRepository.updateStatus(distribution.id!, 'reserved', {
      reservedAt: new Date()
    });

    return {
      id: updatedDistribution!.id!,
      distributionNumber: updatedDistribution!.distributionNumber,
      recipientId: updatedDistribution!.recipientId,
      recipientName: updatedDistribution!.recipientName,
      recipientType: updatedDistribution!.recipientType,
      items: updatedDistribution!.items,
      status: updatedDistribution!.status,
      reservations: createdReservations.map((r) => ({
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
      createdBy: updatedDistribution!.createdBy,
      notes: updatedDistribution!.notes,
      reservedAt: updatedDistribution!.reservedAt ? updatedDistribution!.reservedAt.toISOString() : undefined,
      createdAt: updatedDistribution!.createdAt ? updatedDistribution!.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: updatedDistribution!.updatedAt ? updatedDistribution!.updatedAt.toISOString() : new Date().toISOString()
    };
  }
}
