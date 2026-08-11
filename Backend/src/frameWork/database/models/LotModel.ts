import mongoose, { Schema, Document } from 'mongoose';
import { LotStatus } from '../../../domain/entities/Lot';

export interface ILotDocument extends Document {
  lotNumber: string;
  itemName: string;
  category: string;
  quantity: number;
  availableQuantity: number;
  unit: string;
  receivedDate: Date;
  printedExpiryDate?: Date;
  safetyMarginDays: number;
  effectiveExpiryDate?: Date;
  donationId: mongoose.Types.ObjectId | string;
  donationLineId?: mongoose.Types.ObjectId | string;
  status: LotStatus;
  createdBy: {
    id: mongoose.Types.ObjectId | string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const LotSchema = new Schema<ILotDocument>(
  {
    lotNumber: {
      type: String,
      required: [true, 'Lot number is required'],
      unique: true,
      index: true
    },
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      index: true
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
      index: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative']
    },
    availableQuantity: {
      type: Number,
      required: [true, 'Available quantity is required'],
      min: [0, 'Available quantity cannot be negative']
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true
    },
    receivedDate: {
      type: Date,
      default: Date.now,
      index: true
    },
    printedExpiryDate: {
      type: Date,
      required: false,
      index: true
    },
    safetyMarginDays: {
      type: Number,
      default: 3
    },
    effectiveExpiryDate: {
      type: Date,
      required: false,
      index: true
    },
    donationId: {
      type: Schema.Types.Mixed,
      required: [true, 'Donation ID is required'],
      index: true
    },
    donationLineId: {
      type: Schema.Types.Mixed,
      required: false
    },
    status: {
      type: String,
      enum: Object.values(LotStatus),
      default: LotStatus.RECEIVED,
      index: true
    },
    createdBy: {
      id: {
        type: Schema.Types.Mixed,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    }
  },
  {
    timestamps: true
  }
);

export const LotModel = mongoose.model<ILotDocument>('Lot', LotSchema);
