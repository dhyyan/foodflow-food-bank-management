import { IReservationRepository } from '../../../domain/interface/repositoryInterface/IReservationRepository';
import { Reservation, ReservationStatus } from '../../../domain/entities/Reservation';
import { ReservationModel, IReservationDocument } from '../../../frameWork/database/models/ReservationModel';

export class ReservationRepository implements IReservationRepository {
  private mapDocumentToEntity(doc: IReservationDocument): Reservation {
    return new Reservation({
      id: doc._id.toString(),
      distributionId: doc.distributionId.toString(),
      lotId: doc.lotId.toString(),
      lotNumber: doc.lotNumber,
      itemName: doc.itemName,
      quantity: doc.quantity,
      unit: doc.unit,
      status: doc.status as ReservationStatus,
      createdBy: {
        id: doc.createdBy.id.toString(),
        name: doc.createdBy.name
      },
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  async createMany(reservations: Reservation[]): Promise<Reservation[]> {
    if (reservations.length === 0) return [];
    const docList = reservations.map((r) => ({
      distributionId: r.distributionId,
      lotId: r.lotId,
      lotNumber: r.lotNumber,
      itemName: r.itemName,
      quantity: r.quantity,
      unit: r.unit,
      status: r.status,
      createdBy: r.createdBy
    }));
    const createdDocs = await ReservationModel.insertMany(docList);
    return createdDocs.map((d) => this.mapDocumentToEntity(d));
  }

  async findByDistributionId(distributionId: string): Promise<Reservation[]> {
    const docs = await ReservationModel.find({ distributionId }).sort({ createdAt: 1 });
    return docs.map((d) => this.mapDocumentToEntity(d));
  }

  async findByLotId(lotId: string): Promise<Reservation[]> {
    const docs = await ReservationModel.find({ lotId }).sort({ createdAt: -1 });
    return docs.map((d) => this.mapDocumentToEntity(d));
  }

  async updateStatusByDistributionId(distributionId: string, status: ReservationStatus): Promise<boolean> {
    const result = await ReservationModel.updateMany(
      { distributionId },
      { $set: { status, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }
}
