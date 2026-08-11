import { CreateDistributionRequestDTO } from '../../domain/interface/DTOs/DistributionDTO';
import { DistributionModel } from '../../frameWork/database/models/DistributionModel';
import { ReservationModel } from '../../frameWork/database/models/ReservationModel';
import { LotModel } from '../../frameWork/database/models/LotModel';
import { LotEventModel } from '../../frameWork/database/models/LotEventModel';
import { PreviewAllocationUseCase } from './PreviewAllocationUseCase';
import { BadRequestError } from '../../shared/errors/AppError';

export class CreateDistributionUseCase {
  constructor(private readonly previewAllocationUseCase: PreviewAllocationUseCase) {}

  async execute(dto: CreateDistributionRequestDTO, performedBy: { id: string; name: string; role: string }) {
    if (!dto.recipientName || !dto.items || dto.items.length === 0) {
      throw new BadRequestError('Recipient name and line items are required.');
    }

    // Preview allocation first
    const preview = await this.previewAllocationUseCase.execute({
      recipientName: dto.recipientName,
      items: dto.items,
      allocationPolicy: dto.allocationPolicy
    });

    if (preview.allocatedLots.length === 0) {
      throw new BadRequestError('No available in-stock lots match the requested items.');
    }

    // Generate unique distribution number
    const count = await DistributionModel.countDocuments();
    const distributionNumber = `DST-${String(count + 501).padStart(4, '0')}`;

    const distributionDoc = await DistributionModel.create({
      distributionNumber,
      recipientName: dto.recipientName,
      familyCount: dto.familyCount || 1,
      allocationPolicy: dto.allocationPolicy || 'FEFO',
      status: 'reserved',
      notes: dto.notes,
      createdBy: performedBy
    });

    const reservations = [];

    // Atomically decrement stock and create reservations
    for (const alloc of preview.allocatedLots) {
      const updatedLot = await LotModel.findOneAndUpdate(
        {
          _id: alloc.lotId,
          availableQuantity: { $gte: alloc.allocatedQuantity }
        },
        {
          $inc: { availableQuantity: -alloc.allocatedQuantity },
          $set: { updatedAt: new Date() }
        },
        { new: true }
      );

      if (!updatedLot) {
        throw new BadRequestError(
          `Stock reservation conflict for Lot #${alloc.lotNumber}. Another transaction claimed the stock.`
        );
      }

      // Check if lot is now fully reserved
      if (updatedLot.availableQuantity === 0) {
        await LotModel.findByIdAndUpdate(alloc.lotId, { status: 'reserved' });
      }

      const resDoc = await ReservationModel.create({
        distributionId: distributionDoc._id,
        lotId: alloc.lotId,
        quantity: alloc.allocatedQuantity,
        status: 'reserved',
        reservedAt: new Date()
      });

      reservations.push(resDoc);

      // Audit trail event
      await LotEventModel.create({
        lotId: alloc.lotId,
        previousStatus: updatedLot.status,
        newStatus: updatedLot.availableQuantity === 0 ? 'reserved' : updatedLot.status,
        performedBy,
        notes: `Reserved ${alloc.allocatedQuantity} units for Distribution #${distributionNumber} (${alloc.allocationReason})`,
        timestamp: new Date()
      });
    }

    return {
      distributionId: distributionDoc._id.toString(),
      distributionNumber,
      recipientName: distributionDoc.recipientName,
      status: distributionDoc.status,
      totalUnitsAllocated: preview.totalUnitsAllocated,
      allocatedLots: preview.allocatedLots,
      unfulfilledItems: preview.unfulfilledItems
    };
  }
}
