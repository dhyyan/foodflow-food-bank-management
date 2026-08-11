import { ManifestParseResultDTO } from '../DTOs/ManifestParseDTO';

export interface IAIManifestService {
  parseManifest(manifestText: string): Promise<ManifestParseResultDTO>;
}
