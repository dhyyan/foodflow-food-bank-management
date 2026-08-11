import { IReservation } from '../../entities/Reservation';

export interface IReservationRepository {
  findByLotId(lotId: string): Promise<IReservation[]>;
}
