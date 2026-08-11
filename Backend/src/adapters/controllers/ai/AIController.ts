import { Request, Response, NextFunction } from 'express';
import { IParseManifestUseCase } from '../../../domain/interface/useCaseInterface/IParseManifestUseCase';

export class AIController {
  constructor(private readonly parseManifestUseCase: IParseManifestUseCase) {}

  public parseManifest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { manifestText } = req.body;

      const result = await this.parseManifestUseCase.execute({
        manifestText
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
}
