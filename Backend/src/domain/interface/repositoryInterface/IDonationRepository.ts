import { Donation } from '../../entities/Donation';
import { DonationFilterDTO } from '../DTOs/DonationDTO';

export interface IDonationRepository {
  create(donation: Donation): Promise<Donation>;
  findById(id: string): Promise<Donation | null>;
  findAll(filter?: DonationFilterDTO): Promise<{ donations: Donation[]; total: number }>;
  count(): Promise<number>;
}
