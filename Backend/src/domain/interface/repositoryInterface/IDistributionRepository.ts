import { Distribution, DistributionStatus } from '../../entities/Distribution';
import { DistributionFilterDTO } from '../DTOs/DistributionDTO';

export interface IDistributionRepository {
  create(distribution: Distribution): Promise<Distribution>;
  findById(id: string): Promise<Distribution | null>;
  findAll(filter?: DistributionFilterDTO): Promise<{ distributions: Distribution[]; total: number }>;
  updateStatus(id: string, status: DistributionStatus, timestamps?: { reservedAt?: Date; completedAt?: Date }): Promise<Distribution | null>;
  sumMonthlyUnitsByRecipientId(recipientId: string, year: number, month: number): Promise<number>;
  count(): Promise<number>;
}
