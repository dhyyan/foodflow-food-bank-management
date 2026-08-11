import { Request, Response, NextFunction } from 'express';
import { WarehouseUseCase } from '../../../useCase/warehouse/WarehouseUseCase';

export class WarehouseController {
  constructor(private readonly warehouseUseCase: WarehouseUseCase) {}

  getWarehouses = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const warehouses = await this.warehouseUseCase.getWarehouses();
      res.status(200).json({ success: true, data: warehouses });
    } catch (error) {
      next(error);
    }
  };

  createTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { lotId, sourceWarehouse, targetWarehouse, quantity, notes } = req.body;
      const user = (req as any).user;

      const transfer = await this.warehouseUseCase.executeTransfer(
        { lotId, sourceWarehouse, targetWarehouse, quantity, notes },
        user.id,
        user.name || user.email
      );

      res.status(201).json({
        success: true,
        message: `Successfully executed inter-warehouse transfer #${transfer.transferNumber}`,
        data: transfer
      });
    } catch (error) {
      next(error);
    }
  };

  getTransfers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transfers = await this.warehouseUseCase.getTransferHistory();
      res.status(200).json({ success: true, data: transfers });
    } catch (error) {
      next(error);
    }
  };
}
