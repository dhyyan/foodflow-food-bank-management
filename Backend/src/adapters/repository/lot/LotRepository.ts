import { ILotRepository } from '../../../domain/interface/repositoryInterface/ILotRepository';
import { Lot, LotStatus } from '../../../domain/entities/Lot';
import { LotFilterDTO } from '../../../domain/interface/DTOs/LotDTO';
import { LotModel, ILotDocument } from '../../../frameWork/database/models/LotModel';
import { DonationModel } from '../../../frameWork/database/models/DonationModel';
import mongoose from 'mongoose';

export class LotRepository implements ILotRepository {
  private mapDocumentToEntity(doc: ILotDocument, donorInfo?: { donorName?: string; donorType?: string }): Lot {
    const lot = new Lot({
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

    if (donorInfo) {
      (lot as any).donorName = donorInfo.donorName;
      (lot as any).donorType = donorInfo.donorType;
    }

    return lot;
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
    let doc: ILotDocument | null = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      doc = await LotModel.findById(id);
    }
    if (!doc) {
      doc = await LotModel.findOne({ lotNumber: id });
    }
    if (!doc) return null;

    let donorInfo: { donorName?: string; donorType?: string } | undefined = undefined;
    if (doc.donationId) {
      const donationDoc = await DonationModel.findById(doc.donationId);
      if (donationDoc) {
        donorInfo = { donorName: donationDoc.donorName, donorType: donationDoc.donorType };
      }
    }

    return this.mapDocumentToEntity(doc, donorInfo);
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

    const now = new Date();
    if (filter?.expiryStatus === 'expired') {
      query.effectiveExpiryDate = { $lte: now };
    } else if (filter?.expiryStatus === 'expiring_soon') {
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      query.effectiveExpiryDate = { $gt: now, $lte: sevenDaysFromNow };
    }

    const sortOptions: any = {};
    const sortBy = filter?.sortBy || 'receivedDate';
    const sortOrder = filter?.sortOrder === 'asc' ? 1 : -1;

    if (sortBy === 'effectiveExpiryDate') {
      sortOptions.effectiveExpiryDate = sortOrder;
    } else if (sortBy === 'quantity') {
      sortOptions.quantity = sortOrder;
    } else if (sortBy === 'lotNumber') {
      sortOptions.lotNumber = sortOrder;
    } else if (sortBy === 'createdAt') {
      sortOptions.createdAt = sortOrder;
    } else {
      sortOptions.receivedDate = sortOrder;
    }

    const page = filter?.page || 1;
    const limit = filter?.limit || 20;
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      LotModel.find(query).sort(sortOptions).skip(skip).limit(limit),
      LotModel.countDocuments(query)
    ]);

    // Gather unique donation IDs to enrich donorName and donorType efficiently
    const donationIds = Array.from(new Set(docs.map((d) => d.donationId.toString()).filter(Boolean)));
    const donations = await DonationModel.find({ _id: { $in: donationIds } }).select('donorName donorType');
    const donationMap = new Map<string, { donorName: string; donorType: string }>();
    donations.forEach((d) => {
      donationMap.set(d._id.toString(), { donorName: d.donorName, donorType: d.donorType });
    });

    const lotEntities = docs.map((doc) => {
      const info = donationMap.get(doc.donationId.toString());
      return this.mapDocumentToEntity(doc, info);
    });

    return {
      lots: lotEntities,
      total
    };
  }

  async updateStatus(id: string, status: LotStatus): Promise<Lot | null> {
    const doc = await LotModel.findByIdAndUpdate(
      id,
      { $set: { status, updatedAt: new Date() } },
      { new: true }
    );
    if (!doc) return null;
    return this.mapDocumentToEntity(doc);
  }

  async update(lot: Lot): Promise<Lot | null> {
    if (!lot.id) return null;
    const doc = await LotModel.findByIdAndUpdate(
      lot.id,
      {
        $set: {
          itemName: lot.itemName,
          category: lot.category,
          quantity: lot.quantity,
          availableQuantity: lot.availableQuantity,
          unit: lot.unit,
          status: lot.status,
          printedExpiryDate: lot.printedExpiryDate,
          effectiveExpiryDate: lot.effectiveExpiryDate,
          updatedAt: new Date()
        }
      },
      { new: true }
    );
    if (!doc) return null;
    return this.mapDocumentToEntity(doc);
  }

  async decrementAvailableQuantity(id: string, quantityToDeduct: number): Promise<Lot | null> {
    // Atomic Conditional Update: Only updates if availableQuantity >= quantityToDeduct
    const doc = await LotModel.findOneAndUpdate(
      {
        _id: id,
        availableQuantity: { $gte: quantityToDeduct }
      },
      {
        $inc: { availableQuantity: -quantityToDeduct },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );

    if (!doc) return null; // Fails atomically if another concurrent transaction claimed the stock first!
    return this.mapDocumentToEntity(doc);
  }

  async count(): Promise<number> {
    return await LotModel.countDocuments();
  }
}
