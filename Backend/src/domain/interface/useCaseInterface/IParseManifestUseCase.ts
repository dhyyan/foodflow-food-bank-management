import { ParseManifestRequestDTO, ManifestParseResultDTO } from '../DTOs/ManifestParseDTO';

export interface IParseManifestUseCase {
  execute(dto: ParseManifestRequestDTO): Promise<ManifestParseResultDTO>;
}
