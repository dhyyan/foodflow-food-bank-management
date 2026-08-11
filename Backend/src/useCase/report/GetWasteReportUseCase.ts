import { WasteReportRequestDTO, WasteReportResponseDTO, WasteCategorySummaryDTO, WasteItemizedDetailDTO } from '../../domain/interface/DTOs/ReportDTO';
import { LotModel } from '../../frameWork/database/models/LotModel';
import { LotEventModel } from '../../frameWork/database/models/LotEventModel';

export class GetWasteReportUseCase {
  private readonly categoryValuePerUnit: Record<string, number> = {
    'Produce': 2.50,
    'Dairy': 3.20,
    'Grains': 1.80,
    'Canned Goods': 2.10,
    'Bakery': 2.00,
    'Protein': 6.50,
    'Beverages': 1.50,
    'Other': 2.00
  };

  async execute(dto: WasteReportRequestDTO): Promise<WasteReportResponseDTO> {
    const end = dto.endDate ? new Date(dto.endDate) : new Date();
    const start = dto.startDate
      ? new Date(dto.startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const discardedEvents = await LotEventModel.find({
      newStatus: 'discarded',
      timestamp: { $gte: start, $lte: end }
    }).sort({ timestamp: -1 });

    const lotIds = Array.from(new Set(discardedEvents.map(e => e.lotId.toString())));
    
    const discardedLots = await LotModel.find({
      $or: [
        { _id: { $in: lotIds } },
        { status: 'discarded', updatedAt: { $gte: start, $lte: end } }
      ]
    });

    const categoryMap = new Map<string, { quantity: number; value: number; count: number; unit: string }>();
    const itemizedDetails: WasteItemizedDetailDTO[] = [];

    let totalQuantity = 0;
    let totalEstimatedValue = 0;

    for (const lot of discardedLots) {
      if (dto.category && dto.category !== 'all' && lot.category !== dto.category) {
        continue;
      }

      const matchingEvent = discardedEvents.find(e => e.lotId.toString() === lot._id.toString());
      const discardedDate = matchingEvent ? matchingEvent.timestamp : (lot.updatedAt || new Date());
      const notes = matchingEvent?.notes || 'Lot discarded due to expiration';

      const unitValue = this.categoryValuePerUnit[lot.category] || 2.50;
      const estimatedValue = parseFloat((lot.quantity * unitValue).toFixed(2));

      totalQuantity += lot.quantity;
      totalEstimatedValue += estimatedValue;

      const existing = categoryMap.get(lot.category) || { quantity: 0, value: 0, count: 0, unit: lot.unit || 'units' };
      existing.quantity += lot.quantity;
      existing.value = parseFloat((existing.value + estimatedValue).toFixed(2));
      existing.count += 1;
      categoryMap.set(lot.category, existing);

      itemizedDetails.push({
        lotId: lot._id.toString(),
        lotNumber: lot.lotNumber,
        itemName: lot.itemName,
        category: lot.category,
        quantity: lot.quantity,
        unit: lot.unit || 'units',
        estimatedValue,
        effectiveExpiryDate: lot.effectiveExpiryDate ? lot.effectiveExpiryDate.toISOString() : undefined,
        discardedAt: discardedDate.toISOString(),
        notes
      });
    }

    const categoryBreakdown: WasteCategorySummaryDTO[] = Array.from(categoryMap.entries()).map(
      ([category, stats]) => ({
        category,
        discardedQuantity: stats.quantity,
        estimatedValue: stats.value,
        lotCount: stats.count,
        unit: stats.unit
      })
    ).sort((a, b) => b.estimatedValue - a.estimatedValue);

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      totalQuantity,
      totalEstimatedValue: parseFloat(totalEstimatedValue.toFixed(2)),
      totalLotsDiscarded: itemizedDetails.length,
      categoryBreakdown,
      itemizedDetails
    };
  }
}
