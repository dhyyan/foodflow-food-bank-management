import { Request, Response, NextFunction } from 'express';
import { IParseManifestUseCase } from '../../../domain/interface/useCaseInterface/IParseManifestUseCase';

export class AIController {
  constructor(private readonly parseManifestUseCase: IParseManifestUseCase) { }

  public parseManifest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { manifestText, imageBase64, mimeType } = req.body;

      const result = await this.parseManifestUseCase.execute({
        manifestText,
        imageBase64,
        mimeType
      });

      res.status(200).json({
        success: true,
        message: 'Manifest parsed successfully into structured JSON',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  public parseManifestImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { imageBase64, mimeType } = req.body;

      const result = await this.parseManifestUseCase.execute({
        imageBase64,
        mimeType
      });

      res.status(200).json({
        success: true,
        message: 'Manifest photo parsed successfully into structured JSON',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}
