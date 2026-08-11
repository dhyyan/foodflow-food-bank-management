import { PreviewAllocationUseCase } from '../../useCase/distribution/PreviewAllocationUseCase';
import { CreateDistributionUseCase } from '../../useCase/distribution/CreateDistributionUseCase';
import { DistributionController } from '../../adapters/controllers/distribution/DistributionController';

const previewAllocationUseCase = new PreviewAllocationUseCase();
const createDistributionUseCase = new CreateDistributionUseCase(previewAllocationUseCase);

export const distributionController = new DistributionController(
  previewAllocationUseCase,
  createDistributionUseCase
);
