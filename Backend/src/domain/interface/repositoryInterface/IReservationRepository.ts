import { Reservation, ReservationStatus } from '../../entities/Reservation';

export interface IReservationRepository {
  createMany(reservations: Reservation[]): Promise<Reservation[]>;
  findByDistributionId(distributionId: string): Promise<Reservation[]>;
  findByLotId(lotId: string): Promise<Reservation[]>;
  updateStatusByDistributionId(distributionId: string, status: ReservationStatus): Promise<boolean>;
}
