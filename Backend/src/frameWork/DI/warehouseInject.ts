import { WarehouseUseCase } from '../../useCase/warehouse/WarehouseUseCase';
import { WarehouseController } from '../../adapters/controllers/warehouse/WarehouseController';

const warehouseUseCase = new WarehouseUseCase();
export const warehouseController = new WarehouseController(warehouseUseCase);
