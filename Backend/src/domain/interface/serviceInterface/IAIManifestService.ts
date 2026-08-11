import { ManifestParseResultDTO } from '../DTOs/ManifestParseDTO';

export interface IAIManifestService {
  parseManifest(manifestText: string): Promise<ManifestParseResultDTO>;
  parseManifestImage(imageBase64: string, mimeType?: string): Promise<ManifestParseResultDTO>;
}
