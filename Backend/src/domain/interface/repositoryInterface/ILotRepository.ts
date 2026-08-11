import { Lot, LotStatus } from '../../entities/Lot';
import { LotFilterDTO } from '../DTOs/LotDTO';

export interface ILotRepository {
  create(lot: Lot): Promise<Lot>;
  createMany(lots: Lot[]): Promise<Lot[]>;
  findById(id: string): Promise<Lot | null>;
  findByDonationId(donationId: string): Promise<Lot[]>;
  findAll(filter?: LotFilterDTO): Promise<{ lots: Lot[]; total: number }>;
  updateStatus(id: string, status: LotStatus): Promise<Lot | null>;
  update(lot: Lot): Promise<Lot | null>;
  count(): Promise<number>;
}
