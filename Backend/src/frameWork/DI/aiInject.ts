import { AIManifestService } from '../service/ai/AIManifestService';
import { ParseManifestUseCase } from '../../useCase/ai/ParseManifestUseCase';
import { AIController } from '../../adapters/controllers/ai/AIController';

export const aiManifestService = new AIManifestService();
const parseManifestUseCase = new ParseManifestUseCase(aiManifestService);

export const aiController = new AIController(parseManifestUseCase);
