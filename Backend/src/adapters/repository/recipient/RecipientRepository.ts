import mongoose from 'mongoose';
import { IRecipientRepository } from '../../../domain/interface/repositoryInterface/IRecipientRepository';
import { Recipient, RecipientType } from '../../../domain/entities/Recipient';
import { RecipientModel, IRecipientDocument } from '../../../frameWork/database/models/RecipientModel';

export class RecipientRepository implements IRecipientRepository {
  private mapDocumentToEntity(doc: IRecipientDocument): Recipient {
    return new Recipient({
      id: doc._id.toString(),
      name: doc.name,
      type: doc.type as RecipientType,
      monthlyQuota: doc.monthlyQuota,
      contactPerson: doc.contactPerson,
      contactEmail: doc.contactEmail,
      address: doc.address,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  async create(recipient: Recipient): Promise<Recipient> {
    const createdDoc = await RecipientModel.create({
      name: recipient.name,
      type: recipient.type,
      monthlyQuota: recipient.monthlyQuota,
      contactPerson: recipient.contactPerson,
      contactEmail: recipient.contactEmail,
      address: recipient.address
    });
    return this.mapDocumentToEntity(createdDoc);
  }

  async findById(id: string): Promise<Recipient | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const doc = await RecipientModel.findById(id);
    if (!doc) return null;
    return this.mapDocumentToEntity(doc);
  }

  async findAll(filter?: { type?: RecipientType; search?: string }): Promise<Recipient[]> {
    const query: any = {};
    if (filter?.type) {
      query.type = filter.type;
    }
    if (filter?.search) {
      const regex = new RegExp(filter.search, 'i');
      query.$or = [{ name: regex }, { contactPerson: regex }];
    }
    const docs = await RecipientModel.find(query).sort({ name: 1 });
    return docs.map((d) => this.mapDocumentToEntity(d));
  }

  async count(): Promise<number> {
    return await RecipientModel.countDocuments();
  }
}
