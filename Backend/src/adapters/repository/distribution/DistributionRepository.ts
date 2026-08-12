import mongoose from 'mongoose';
import { IDistributionRepository } from '../../../domain/interface/repositoryInterface/IDistributionRepository';
import { Distribution, DistributionStatus } from '../../../domain/entities/Distribution';
import { DistributionFilterDTO } from '../../../domain/interface/DTOs/DistributionDTO';
import { DistributionModel, IDistributionDocument } from '../../../frameWork/database/models/DistributionModel';
import { RecipientType } from '../../../domain/entities/Recipient';

export class DistributionRepository implements IDistributionRepository {
  private mapDocumentToEntity(doc: IDistributionDocument): Distribution {
    return new Distribution({
      id: doc._id.toString(),
      distributionNumber: doc.distributionNumber,
      recipientId: doc.recipientId.toString(),
      recipientName: doc.recipientName,
      recipientType: doc.recipientType as RecipientType,
      items: doc.items.map((item) => ({
        itemName: item.itemName,
        requestedQuantity: item.requestedQuantity,
        unit: item.unit
      })),
      status: doc.status as DistributionStatus,
      createdBy: {
        id: doc.createdBy.id.toString(),
        name: doc.createdBy.name
      },
      notes: doc.notes,
      reservedAt: doc.reservedAt,
      completedAt: doc.completedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  async create(distribution: Distribution): Promise<Distribution> {
    const createdDoc = await DistributionModel.create({
      distributionNumber: distribution.distributionNumber,
      recipientId: distribution.recipientId,
      recipientName: distribution.recipientName,
      recipientType: distribution.recipientType,
      items: distribution.items,
      status: distribution.status,
      createdBy: distribution.createdBy,
      notes: distribution.notes
    });
    return this.mapDocumentToEntity(createdDoc);
  }

  async findById(id: string): Promise<Distribution | null> {
    let doc: IDistributionDocument | null = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      doc = await DistributionModel.findById(id);
    }
    if (!doc) {
      doc = await DistributionModel.findOne({ distributionNumber: id });
    }
    if (!doc) return null;
    return this.mapDocumentToEntity(doc);
  }

  async findAll(filter?: DistributionFilterDTO): Promise<{ distributions: Distribution[]; total: number }> {
    const query: any = {};

    if (filter?.search) {
      const regex = new RegExp(filter.search, 'i');
      query.$or = [
        { distributionNumber: regex },
        { recipientName: regex }
      ];
    }

    if (filter?.status && filter.status !== 'all') {
      query.status = filter.status;
    }

    if (filter?.recipientId) {
      query.recipientId = filter.recipientId;
    }

    const page = filter?.page || 1;
    const limit = filter?.limit || 20;
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      DistributionModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      DistributionModel.countDocuments(query)
    ]);

    return {
      distributions: docs.map((d) => this.mapDocumentToEntity(d)),
      total
    };
  }

  async updateStatus(
    id: string,
    status: DistributionStatus,
    timestamps?: { reservedAt?: Date; completedAt?: Date }
  ): Promise<Distribution | null> {
    const updateObj: any = { status, updatedAt: new Date() };
    if (timestamps?.reservedAt) updateObj.reservedAt = timestamps.reservedAt;
    if (timestamps?.completedAt) updateObj.completedAt = timestamps.completedAt;

    const doc = await DistributionModel.findByIdAndUpdate(
      id,
      { $set: updateObj },
      { new: true }
    );
    if (!doc) return null;
    return this.mapDocumentToEntity(doc);
  }

  async sumMonthlyUnitsByRecipientId(recipientId: string, year: number, month: number): Promise<number> {
    const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const matchValues: any[] = [recipientId, recipientId.toString()];
    if (mongoose.Types.ObjectId.isValid(recipientId)) {
      matchValues.push(new mongoose.Types.ObjectId(recipientId));
    }

    const result = await DistributionModel.aggregate([
      {
        $match: {
          recipientId: { $in: matchValues },
          status: { $ne: 'cancelled' },
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: '$items.requestedQuantity' }
        }
      }
    ]);

    return result.length > 0 ? result[0].totalUnits : 0;
  }

  async count(): Promise<number> {
    return await DistributionModel.countDocuments();
  }
}
