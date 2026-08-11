import mongoose, { Schema, Document } from 'mongoose';
import { RecipientType } from '../../../domain/entities/Recipient';
import { DistributionStatus } from '../../../domain/entities/Distribution';

export interface IDistributionDocument extends Document {
  distributionNumber: string;
  recipientId: mongoose.Types.ObjectId | string;
  recipientName: string;
  recipientType: RecipientType;
  items: {
    itemName: string;
    requestedQuantity: number;
    unit: string;
  }[];
  status: DistributionStatus;
  createdBy: {
    id: mongoose.Types.ObjectId | string;
    name: string;
  };
  notes?: string;
  reservedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DistributionSchema = new Schema<IDistributionDocument>(
  {
    distributionNumber: {
      type: String,
      required: [true, 'Distribution number is required'],
      unique: true,
      index: true
    },
    recipientId: {
      type: Schema.Types.Mixed,
      required: [true, 'Recipient ID is required'],
      index: true
    },
    recipientName: {
      type: String,
      required: [true, 'Recipient name is required'],
      trim: true
    },
    recipientType: {
      type: String,
      enum: ['family', 'agency'],
      required: [true, 'Recipient type is required'],
      index: true
    },
    items: [
      {
        itemName: {
          type: String,
          required: [true, 'Item name is required'],
          trim: true
        },
        requestedQuantity: {
          type: Number,
          required: [true, 'Requested quantity is required'],
          min: [1, 'Requested quantity must be at least 1']
        },
        unit: {
          type: String,
          default: 'units',
          trim: true
        }
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'reserved', 'completed', 'cancelled'],
      default: 'pending',
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
    },
    notes: {
      type: String,
      trim: true
    },
    reservedAt: {
      type: Date
    },
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const DistributionModel = mongoose.model<IDistributionDocument>('Distribution', DistributionSchema);
