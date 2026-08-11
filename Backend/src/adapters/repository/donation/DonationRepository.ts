import { IDonationRepository } from '../../../domain/interface/repositoryInterface/IDonationRepository';
import { Donation, IDonationLine } from '../../../domain/entities/Donation';
import { DonationFilterDTO } from '../../../domain/interface/DTOs/DonationDTO';
import { DonationModel, IDonationDocument, IDonationLineDocument } from '../../../frameWork/database/models/DonationModel';
import mongoose from 'mongoose';

export class DonationRepository implements IDonationRepository {
  private mapDocumentToEntity(doc: IDonationDocument): Donation {
    const lines: IDonationLine[] = doc.lines.map((line: IDonationLineDocument) => ({
      id: line._id ? line._id.toString() : undefined,
      itemName: line.itemName,
      category: line.category,
      quantity: line.quantity,
      unit: line.unit,
      printedExpiryDate: line.printedExpiryDate,
      notes: line.notes
    }));

    return new Donation({
      id: doc._id.toString(),
      donationNumber: doc.donationNumber,
      donorName: doc.donorName,
      donorType: doc.donorType,
      receivedAt: doc.receivedAt,
      receivedBy: {
        id: doc.receivedBy.id.toString(),
        name: doc.receivedBy.name
      },
      lines,
      notes: doc.notes,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  async create(donation: Donation): Promise<Donation> {
    const docData = {
      donationNumber: donation.donationNumber,
      donorName: donation.donorName,
      donorType: donation.donorType,
      receivedAt: donation.receivedAt,
      receivedBy: donation.receivedBy,
      lines: donation.lines.map((l) => ({
        itemName: l.itemName,
        category: l.category || 'General',
        quantity: l.quantity,
        unit: l.unit,
        printedExpiryDate: l.printedExpiryDate,
        notes: l.notes
      })),
      notes: donation.notes,
      status: donation.status
    };

    const createdDoc = await DonationModel.create(docData);
    return this.mapDocumentToEntity(createdDoc);
  }

  async findById(id: string): Promise<Donation | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // Also support finding by donationNumber e.g. DON-20260811-0001
      const docByNum = await DonationModel.findOne({ donationNumber: id });
      if (!docByNum) return null;
      return this.mapDocumentToEntity(docByNum);
    }
    const doc = await DonationModel.findById(id);
    if (!doc) return null;
    return this.mapDocumentToEntity(doc);
  }

  async findAll(filter?: DonationFilterDTO): Promise<{ donations: Donation[]; total: number }> {
    const query: any = {};

    if (filter?.search) {
      const searchRegex = new RegExp(filter.search, 'i');
      query.$or = [
        { donorName: searchRegex },
        { donationNumber: searchRegex },
        { 'lines.itemName': searchRegex }
      ];
    }

    if (filter?.donorType && filter.donorType !== 'all') {
      query.donorType = filter.donorType;
    }

    if (filter?.startDate || filter?.endDate) {
      query.receivedAt = {};
      if (filter.startDate) query.receivedAt.$gte = new Date(filter.startDate);
      if (filter.endDate) query.receivedAt.$lte = new Date(filter.endDate);
    }

    const page = filter?.page || 1;
    const limit = filter?.limit || 20;
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      DonationModel.find(query).sort({ receivedAt: -1 }).skip(skip).limit(limit),
      DonationModel.countDocuments(query)
    ]);

    return {
      donations: docs.map((doc) => this.mapDocumentToEntity(doc)),
      total
    };
  }

  async count(): Promise<number> {
    return await DonationModel.countDocuments();
  }
}
