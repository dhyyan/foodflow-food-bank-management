import mongoose, { Schema, Document } from 'mongoose';

export interface IWarehouse extends Document {
  code: string;
  name: string;
  location: string;
  capacityUnits: number;
  currentUnits: number;
  contactEmail: string;
  isMainFacility: boolean;
  createdAt: Date;
}

const WarehouseSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    capacityUnits: { type: Number, default: 10000 },
    currentUnits: { type: Number, default: 0 },
    contactEmail: { type: String, required: true },
    isMainFacility: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const WarehouseModel = mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
