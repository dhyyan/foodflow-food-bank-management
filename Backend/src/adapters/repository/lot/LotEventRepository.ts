import { ILotEventRepository } from '../../../domain/interface/repositoryInterface/ILotEventRepository';
import { LotEvent } from '../../../domain/entities/LotEvent';
import { LotEventModel, ILotEventDocument } from '../../../frameWork/database/models/LotEventModel';

export class LotEventRepository implements ILotEventRepository {
  private mapDocumentToEntity(doc: ILotEventDocument): LotEvent {
    return new LotEvent({
      id: doc._id.toString(),
      lotId: doc.lotId.toString(),
      eventType: doc.eventType,
      previousStatus: doc.previousStatus,
      newStatus: doc.newStatus,
      performedBy: {
        id: doc.performedBy.id.toString(),
        name: doc.performedBy.name,
        role: doc.performedBy.role
      },
      notes: doc.notes,
      timestamp: doc.timestamp,
      createdAt: doc.createdAt
    });
  }

  async create(event: LotEvent): Promise<LotEvent> {
    const doc = await LotEventModel.create({
      lotId: event.lotId,
      eventType: event.eventType,
      previousStatus: event.previousStatus,
      newStatus: event.newStatus,
      performedBy: event.performedBy,
      notes: event.notes,
      timestamp: event.timestamp || new Date()
    });
    return this.mapDocumentToEntity(doc);
  }

  async createMany(events: LotEvent[]): Promise<LotEvent[]> {
    if (events.length === 0) return [];
    const docDataList = events.map((event) => ({
      lotId: event.lotId,
      eventType: event.eventType,
      previousStatus: event.previousStatus,
      newStatus: event.newStatus,
      performedBy: event.performedBy,
      notes: event.notes,
      timestamp: event.timestamp || new Date()
    }));
    const docs = await LotEventModel.insertMany(docDataList);
    return docs.map((doc) => this.mapDocumentToEntity(doc));
  }

  async findByLotId(lotId: string): Promise<LotEvent[]> {
    const docs = await LotEventModel.find({ lotId }).sort({ timestamp: 1, createdAt: 1 });
    return docs.map((doc) => this.mapDocumentToEntity(doc));
  }
}
