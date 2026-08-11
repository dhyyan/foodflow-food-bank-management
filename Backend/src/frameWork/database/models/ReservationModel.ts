import mongoose, { Schema, Document } from 'mongoose';
import { ReservationStatus } from '../../../domain/entities/Reservation';

export interface IReservationDocument extends Document {
  distributionId: mongoose.Types.ObjectId | string;
  lotId: mongoose.Types.ObjectId | string;
  lotNumber: string;
  itemName: string;
  quantity: number;
  unit: string;
  status: ReservationStatus;
  createdBy: {
    id: mongoose.Types.ObjectId | string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservationDocument>(
  {
    distributionId: {
      type: Schema.Types.Mixed,
      required: [true, 'Distribution ID is required'],
      index: true
    },
    lotId: {
      type: Schema.Types.Mixed,
      required: [true, 'Lot ID is required'],
      index: true
    },
    lotNumber: {
      type: String,
      required: [true, 'Lot number is required'],
      index: true
    },
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      index: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['reserved', 'released', 'cancelled'],
      default: 'reserved',
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

export const ReservationModel = mongoose.model<IReservationDocument>('Reservation', ReservationSchema);
