import { Request, Response, NextFunction } from 'express';
import { CreateDistributionUseCase } from '../../../useCase/distribution/CreateDistributionUseCase';
import { PreviewFEFOUseCase } from '../../../useCase/distribution/PreviewFEFOUseCase';
import { ReserveStockUseCase } from '../../../useCase/distribution/ReserveStockUseCase';
import { CompleteDistributionUseCase } from '../../../useCase/distribution/CompleteDistributionUseCase';
import { GetDistributionByIdUseCase } from '../../../useCase/distribution/GetDistributionByIdUseCase';
import { GetDistributionsUseCase } from '../../../useCase/distribution/GetDistributionsUseCase';
import { CreateDistributionDTO, DistributionFilterDTO } from '../../../domain/interface/DTOs/DistributionDTO';

export class DistributionController {
  constructor(
    private readonly createDistributionUseCase: CreateDistributionUseCase,
    private readonly previewFEFOUseCase: PreviewFEFOUseCase,
    private readonly reserveStockUseCase: ReserveStockUseCase,
    private readonly completeDistributionUseCase: CompleteDistributionUseCase,
    private readonly getDistributionByIdUseCase: GetDistributionByIdUseCase,
    private readonly getDistributionsUseCase: GetDistributionsUseCase
  ) {}

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const creator = {
        id: (req as any).user.id,
        name: (req as any).user.name
      };

      const dto: CreateDistributionDTO = {
        recipientId: req.body.recipientId,
        items: req.body.items,
        notes: req.body.notes
      };

      const distribution = await this.createDistributionUseCase.execute(dto, creator);

      res.status(201).json({
        success: true,
        message: 'Distribution request created successfully',
        data: distribution
      });
    } catch (error) {
      next(error);
    }
  };

  public previewFEFO = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const preview = await this.previewFEFOUseCase.execute(id);

      res.status(200).json({
        success: true,
        message: 'FEFO allocation preview generated successfully',
        data: preview
      });
    } catch (error) {
      next(error);
    }
  };

  public reserve = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const coordinator = {
        id: (req as any).user.id,
        name: (req as any).user.name
      };

      const result = await this.reserveStockUseCase.execute(id, coordinator);

      res.status(200).json({
        success: true,
        message: 'Inventory reserved successfully according to FEFO policy',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  public complete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const coordinator = {
        id: (req as any).user.id,
        name: (req as any).user.name
      };

      const result = await this.completeDistributionUseCase.execute(id, coordinator);

      res.status(200).json({
        success: true,
        message: 'Distribution completed and stock released successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const distribution = await this.getDistributionByIdUseCase.execute(id);

      res.status(200).json({
        success: true,
        message: 'Distribution details retrieved successfully',
        data: distribution
      });
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filter: DistributionFilterDTO = {
        search: req.query.search as string | undefined,
        status: req.query.status as string | undefined,
        recipientId: req.query.recipientId as string | undefined,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined
      };

      const { distributions, total } = await this.getDistributionsUseCase.execute(filter);

      res.status(200).json({
        success: true,
        message: 'Distributions retrieved successfully',
        data: distributions,
        meta: {
          total,
          page: filter.page || 1,
          limit: filter.limit || 20
        }
      });
    } catch (error) {
      next(error);
    }
  };
}
