import mongoose, { Schema, Document } from 'mongoose';
import { LotStatus } from '../../../domain/entities/Lot';

export interface ILotEventDocument extends Document {
  lotId: mongoose.Types.ObjectId | string;
  eventType: string;
  previousStatus?: LotStatus | string;
  newStatus: LotStatus | string;
  performedBy: {
    id: mongoose.Types.ObjectId | string;
    name: string;
    role?: string;
  };
  notes?: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LotEventSchema = new Schema<ILotEventDocument>(
  {
    lotId: {
      type: Schema.Types.Mixed,
      required: [true, 'Lot ID is required'],
      index: true
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      trim: true
    },
    previousStatus: {
      type: String,
      required: false
    },
    newStatus: {
      type: String,
      required: [true, 'New status is required']
    },
    performedBy: {
      id: {
        type: Schema.Types.Mixed,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      role: {
        type: String,
        required: false
      }
    },
    notes: {
      type: String,
      required: false,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

export const LotEventModel = mongoose.model<ILotEventDocument>('LotEvent', LotEventSchema);
