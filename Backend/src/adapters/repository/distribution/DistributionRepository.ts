import { IDistributionRepository } from '../../../domain/interface/repositoryInterface/IDistributionRepository';
import { IDistribution, Distribution } from '../../../domain/entities/Distribution';
import { DistributionModel, DistributionDocument } from '../../../frameWork/database/models/DistributionModel';

export class DistributionRepository implements IDistributionRepository {
  async findById(id: string): Promise<IDistribution | null> {
    const doc = await DistributionModel.findById(id).exec();
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  private mapToDomain(doc: DistributionDocument): IDistribution {
    return new Distribution({
      id: doc._id.toString(),
      distributionNumber: doc.distributionNumber,
      recipientId: doc.recipientId,
      recipientName: doc.recipientName,
      recipientType: doc.recipientType,
      items: doc.items.map(item => ({
        itemName: item.itemName,
        requestedQuantity: item.requestedQuantity,
        unit: item.unit
      })),
      status: doc.status,
      notes: doc.notes,
      createdBy: doc.createdBy,
      reservedAt: doc.reservedAt,
      completedAt: doc.completedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }
}
