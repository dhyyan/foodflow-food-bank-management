import { IReservationRepository } from '../../../domain/interface/repositoryInterface/IReservationRepository';
import { IReservation, Reservation } from '../../../domain/entities/Reservation';
import { ReservationModel, ReservationDocument } from '../../../frameWork/database/models/ReservationModel';

export class ReservationRepository implements IReservationRepository {
  async findByLotId(lotId: string): Promise<IReservation[]> {
    const docs = await ReservationModel.find({ lotId }).exec();
    return docs.map(doc => this.mapToDomain(doc));
  }

  private mapToDomain(doc: ReservationDocument): IReservation {
    return new Reservation({
      id: doc._id.toString(),
      distributionId: doc.distributionId,
      lotId: doc.lotId,
      lotNumber: doc.lotNumber,
      itemName: doc.itemName,
      quantity: doc.quantity,
      unit: doc.unit,
      status: doc.status,
      createdBy: doc.createdBy,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }
}
