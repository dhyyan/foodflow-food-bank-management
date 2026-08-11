import { Request, Response, NextFunction } from 'express';
import { CreateItemUseCase } from '../../../useCase/item/CreateItemUseCase';
import { UpdateItemUseCase } from '../../../useCase/item/UpdateItemUseCase';
import { GetItemsUseCase } from '../../../useCase/item/GetItemsUseCase';
import { GetItemByIdUseCase } from '../../../useCase/item/GetItemByIdUseCase';
import { DeleteItemUseCase } from '../../../useCase/item/DeleteItemUseCase';
import { CreateItemDTO, UpdateItemDTO } from '../../../domain/interface/DTOs/ItemDTO';
import { BadRequestError } from '../../../shared/errors/AppError';

export class ItemController {
  constructor(
    private readonly createItemUseCase: CreateItemUseCase,
    private readonly updateItemUseCase: UpdateItemUseCase,
    private readonly getItemsUseCase: GetItemsUseCase,
    private readonly getItemByIdUseCase: GetItemByIdUseCase,
    private readonly deleteItemUseCase: DeleteItemUseCase
  ) {}

  createItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: CreateItemDTO = {
        name: req.body.name,
        category: req.body.category,
        unit: req.body.unit,
        shelfLifeDays: req.body.shelfLifeDays,
      };

      if (!dto.name || !dto.category || !dto.unit || dto.shelfLifeDays === undefined) {
        throw new BadRequestError('Missing required fields (name, category, unit, shelfLifeDays)');
      }

      const item = await this.createItemUseCase.execute(dto);

      res.status(201).json({
        success: true,
        message: 'Item created successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  };

  getItems = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await this.getItemsUseCase.execute();

      res.status(200).json({
        success: true,
        message: 'Items retrieved successfully',
        data: items,
      });
    } catch (error) {
      next(error);
    }
  };

  getItemById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const item = await this.getItemByIdUseCase.execute(id);

      res.status(200).json({
        success: true,
        message: 'Item retrieved successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  };

  updateItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const dto: UpdateItemDTO = req.body;

      const item = await this.updateItemUseCase.execute(id, dto);

      res.status(200).json({
        success: true,
        message: 'Item updated successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.deleteItemUseCase.execute(id);

      res.status(200).json({
        success: true,
        message: 'Item deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
