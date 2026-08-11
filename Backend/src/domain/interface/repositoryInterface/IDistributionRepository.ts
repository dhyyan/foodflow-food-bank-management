import { IDistribution } from '../../entities/Distribution';

export interface IDistributionRepository {
  findById(id: string): Promise<IDistribution | null>;
  // For the purpose of the trace feature, we only strictly need findById.
  // We add this basic interface to satisfy the architecture.
}
