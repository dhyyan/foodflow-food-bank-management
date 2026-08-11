import mongoose, { Schema, Document } from 'mongoose';

export type TransferStatus = 'pending' | 'in_transit' | 'completed' | 'cancelled';

export interface IWarehouseTransfer extends Document {
  transferNumber: string;
  sourceWarehouse: string;
  targetWarehouse: string;
  lotId: mongoose.Types.ObjectId;
  lotNumber: string;
  itemName: string;
  quantity: number;
  unit: string;
  status: TransferStatus;
  requestedBy: {
    id: string;
    name: string;
  };
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
}

const WarehouseTransferSchema: Schema = new Schema(
  {
    transferNumber: { type: String, required: true, unique: true },
    sourceWarehouse: { type: String, required: true },
    targetWarehouse: { type: String, required: true },
    lotId: { type: Schema.Types.ObjectId, ref: 'Lot', required: true },
    lotNumber: { type: String, required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, default: 'units' },
    status: {
      type: String,
      enum: ['pending', 'in_transit', 'completed', 'cancelled'],
      default: 'completed'
    },
    requestedBy: {
      id: { type: String, required: true },
      name: { type: String, required: true }
    },
    completedAt: { type: Date, default: Date.now },
    notes: { type: String }
  },
  { timestamps: true }
);

export const WarehouseTransferModel = mongoose.model<IWarehouseTransfer>(
  'WarehouseTransfer',
  WarehouseTransferSchema
);
