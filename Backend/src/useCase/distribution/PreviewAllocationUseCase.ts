import {
  DistributionAllocationPreviewRequestDTO,
  DistributionAllocationPreviewResponseDTO,
  AllocatedLotItemDTO,
  AllocationPolicy
} from '../../domain/interface/DTOs/DistributionDTO';
import { LotModel } from '../../frameWork/database/models/LotModel';

export class PreviewAllocationUseCase {
  private readonly stapleCategories = ['Grains', 'Canned Goods', 'Dry Goods', 'Produce', 'Bakery'];

  async execute(dto: DistributionAllocationPreviewRequestDTO): Promise<DistributionAllocationPreviewResponseDTO> {
    const policy: AllocationPolicy = dto.allocationPolicy || 'FEFO';
    const allocatedLots: AllocatedLotItemDTO[] = [];
    const unfulfilledItems: { itemName: string; missingQuantity: number }[] = [];
    let totalUnitsAllocated = 0;

    const now = new Date();

    for (const line of dto.items) {
      const requestedQty = line.quantityRequested;
      if (!requestedQty || requestedQty <= 0) continue;

      // Find in-stock shelved lots for this item
      const itemRegex = new RegExp(`^${line.itemName.trim()}$`, 'i');
      const candidateDocs = await LotModel.find({
        $or: [{ itemName: itemRegex }, { category: line.category }],
        status: 'shelved',
        availableQuantity: { $gt: 0 },
        effectiveExpiryDate: { $gt: now } // Exclude expired lots
      });

      // Apply Allocation Sorting Strategy
      const isStaple = line.category ? this.stapleCategories.includes(line.category) : true;

      if (policy === 'STRATEGIC_RESERVE' && isStaple) {
        // Strategic Reserve Policy for Staples: Allocate most recently received stock first!
        candidateDocs.sort((a, b) => new Date(b.receivedDate || 0).getTime() - new Date(a.receivedDate || 0).getTime());
      } else {
        // Standard FEFO Policy: Allocate earliest expiring stock first!
        candidateDocs.sort((a, b) => new Date(a.effectiveExpiryDate || 0).getTime() - new Date(b.effectiveExpiryDate || 0).getTime());
      }

      let remaining = requestedQty;

      for (const lotDoc of candidateDocs) {
        if (remaining <= 0) break;

        const allocQty = Math.min(lotDoc.availableQuantity, remaining);
        remaining -= allocQty;
        totalUnitsAllocated += allocQty;

        const reason = (policy === 'STRATEGIC_RESERVE' && isStaple)
          ? 'Strategic Reserve Buffer (Most Recently Received Stock)'
          : 'FEFO Priority (Earliest Expiry Date)';

        allocatedLots.push({
          lotId: lotDoc._id.toString(),
          lotNumber: lotDoc.lotNumber,
          itemName: lotDoc.itemName,
          category: lotDoc.category,
          allocatedQuantity: allocQty,
          effectiveExpiryDate: lotDoc.effectiveExpiryDate ? lotDoc.effectiveExpiryDate.toISOString() : undefined,
          receivedDate: lotDoc.receivedDate ? lotDoc.receivedDate.toISOString() : new Date().toISOString(),
          allocationReason: reason
        });
      }

      if (remaining > 0) {
        unfulfilledItems.push({
          itemName: line.itemName,
          missingQuantity: remaining
        });
      }
    }

    return {
      recipientName: dto.recipientName,
      allocationPolicy: policy,
      totalUnitsAllocated,
      allocatedLots,
      unfulfilledItems
    };
  }
}
