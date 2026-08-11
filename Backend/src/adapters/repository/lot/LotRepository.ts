import { ILotRepository } from '../../../domain/interface/repositoryInterface/ILotRepository';
import { Lot, LotStatus } from '../../../domain/entities/Lot';
import { LotFilterDTO } from '../../../domain/interface/DTOs/LotDTO';
import { LotModel, ILotDocument } from '../../../frameWork/database/models/LotModel';
import mongoose from 'mongoose';

export class LotRepository implements ILotRepository {
  private mapDocumentToEntity(doc: ILotDocument): Lot {
    return new Lot({
      id: doc._id.toString(),
      lotNumber: doc.lotNumber,
      itemName: doc.itemName,
      category: doc.category,
      quantity: doc.quantity,
      availableQuantity: doc.availableQuantity,
      unit: doc.unit,
      receivedDate: doc.receivedDate,
      printedExpiryDate: doc.printedExpiryDate,
      safetyMarginDays: doc.safetyMarginDays,
      effectiveExpiryDate: doc.effectiveExpiryDate,
      donationId: doc.donationId.toString(),
      donationLineId: doc.donationLineId ? doc.donationLineId.toString() : undefined,
      status: doc.status as LotStatus,
      createdBy: {
        id: doc.createdBy.id.toString(),
        name: doc.createdBy.name
      },
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  async create(lot: Lot): Promise<Lot> {
    const createdDoc = await LotModel.create({
      lotNumber: lot.lotNumber,
      itemName: lot.itemName,
      category: lot.category,
      quantity: lot.quantity,
      availableQuantity: lot.availableQuantity,
      unit: lot.unit,
      receivedDate: lot.receivedDate,
      printedExpiryDate: lot.printedExpiryDate,
      safetyMarginDays: lot.safetyMarginDays,
      effectiveExpiryDate: lot.effectiveExpiryDate,
      donationId: lot.donationId,
      donationLineId: lot.donationLineId,
      status: lot.status,
      createdBy: lot.createdBy
    });
    return this.mapDocumentToEntity(createdDoc);
  }

  async createMany(lots: Lot[]): Promise<Lot[]> {
    if (lots.length === 0) return [];
    const docDataList = lots.map((lot) => ({
      lotNumber: lot.lotNumber,
      itemName: lot.itemName,
      category: lot.category,
      quantity: lot.quantity,
      availableQuantity: lot.availableQuantity,
      unit: lot.unit,
      receivedDate: lot.receivedDate,
      printedExpiryDate: lot.printedExpiryDate,
      safetyMarginDays: lot.safetyMarginDays,
      effectiveExpiryDate: lot.effectiveExpiryDate,
      donationId: lot.donationId,
      donationLineId: lot.donationLineId,
      status: lot.status,
      createdBy: lot.createdBy
    }));
    const createdDocs = await LotModel.insertMany(docDataList);
    return createdDocs.map((doc) => this.mapDocumentToEntity(doc));
  }

  async findById(id: string): Promise<Lot | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const docByNum = await LotModel.findOne({ lotNumber: id });
      if (!docByNum) return null;
      return this.mapDocumentToEntity(docByNum);
    }
    const doc = await LotModel.findById(id);
    if (!doc) return null;
    return this.mapDocumentToEntity(doc);
  }

  async findByDonationId(donationId: string): Promise<Lot[]> {
    const docs = await LotModel.find({ donationId }).sort({ createdAt: 1 });
    return docs.map((doc) => this.mapDocumentToEntity(doc));
  }

  async findAll(filter?: LotFilterDTO): Promise<{ lots: Lot[]; total: number }> {
    const query: any = {};

    if (filter?.search) {
      const searchRegex = new RegExp(filter.search, 'i');
      query.$or = [
        { lotNumber: searchRegex },
        { itemName: searchRegex },
        { category: searchRegex }
      ];
    }

    if (filter?.category && filter.category !== 'all') {
      query.category = filter.category;
    }

    if (filter?.status && filter.status !== 'all') {
      query.status = filter.status;
    }

    if (filter?.donationId) {
      query.donationId = filter.donationId;
    }

    const page = filter?.page || 1;
    const limit = filter?.limit || 20;
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      LotModel.find(query).sort({ receivedDate: -1 }).skip(skip).limit(limit),
      LotModel.countDocuments(query)
    ]);

    return {
      lots: docs.map((doc) => this.mapDocumentToEntity(doc)),
      total
    };
  }

  async count(): Promise<number> {
    return await LotModel.countDocuments();
  }
}
