import { WarehouseModel } from '../../frameWork/database/models/WarehouseModel';
import { WarehouseTransferModel } from '../../frameWork/database/models/WarehouseTransferModel';
import { LotModel } from '../../frameWork/database/models/LotModel';
import { LotEventModel } from '../../frameWork/database/models/LotEventModel';
import { BadRequestError, NotFoundError } from '../../shared/errors/AppError';

export interface CreateTransferDTO {
  lotId: string;
  sourceWarehouse: string;
  targetWarehouse: string;
  quantity: number;
  notes?: string;
}

export class WarehouseUseCase {
  async getWarehouses() {
    let warehouses = await WarehouseModel.find();
    if (warehouses.length === 0) {
      // Seed default warehouses
      warehouses = await WarehouseModel.create([
        {
          code: 'WH-MAIN',
          name: 'Central Food Bank Hub',
          location: '100 Distribution Way, Building A',
          capacityUnits: 50000,
          currentUnits: 12500,
          contactEmail: 'hub@foodflow.org',
          isMainFacility: true
        },
        {
          code: 'WH-NORTH',
          name: 'North Region Annex Depot',
          location: '450 Northside Ave',
          capacityUnits: 20000,
          currentUnits: 4200,
          contactEmail: 'depot.north@foodflow.org',
          isMainFacility: false
        },
        {
          code: 'WH-SOUTH',
          name: 'South Metro Relief Center',
          location: '782 South Boulevard',
          capacityUnits: 15000,
          currentUnits: 3100,
          contactEmail: 'relief.south@foodflow.org',
          isMainFacility: false
        }
      ]);
    }
    return warehouses;
  }

  async executeTransfer(dto: CreateTransferDTO, userId: string, userName: string) {
    if (dto.sourceWarehouse === dto.targetWarehouse) {
      throw new BadRequestError('Source and target warehouse cannot be identical');
    }

    const lot = await LotModel.findById(dto.lotId);
    if (!lot) {
      throw new NotFoundError('Lot not found for warehouse transfer');
    }

    if (lot.availableQuantity < dto.quantity) {
      throw new BadRequestError(
        `Insufficient available quantity in Lot #${lot.lotNumber}. Available: ${lot.availableQuantity}, Requested transfer: ${dto.quantity}`
      );
    }

    // Generate Transfer Number
    const count = await WarehouseTransferModel.countDocuments();
    const transferNumber = `TRF-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    // Record Transfer
    const transfer = await WarehouseTransferModel.create({
      transferNumber,
      sourceWarehouse: dto.sourceWarehouse,
      targetWarehouse: dto.targetWarehouse,
      lotId: lot._id,
      lotNumber: lot.lotNumber,
      itemName: lot.itemName,
      quantity: dto.quantity,
      unit: lot.unit || 'units',
      status: 'completed',
      requestedBy: { id: userId, name: userName },
      notes: dto.notes || `Inter-warehouse transfer from ${dto.sourceWarehouse} to ${dto.targetWarehouse}`,
      completedAt: new Date()
    });

    // Record Audit Event
    await LotEventModel.create({
      lotId: lot._id,
      eventType: 'INTER_WAREHOUSE_TRANSFER',
      previousStatus: lot.status,
      newStatus: lot.status,
      performedBy: { id: userId, name: userName },
      notes: `Transferred ${dto.quantity} ${lot.unit || 'units'} from ${dto.sourceWarehouse} to ${dto.targetWarehouse} (Transfer #${transferNumber})`,
      timestamp: new Date()
    });

    return transfer;
  }

  async getTransferHistory() {
    return WarehouseTransferModel.find().sort({ createdAt: -1 }).limit(50);
  }
}
