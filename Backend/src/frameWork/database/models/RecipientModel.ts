import mongoose, { Schema, Document } from 'mongoose';
import { RecipientType } from '../../../domain/entities/Recipient';

export interface IRecipientDocument extends Document {
  name: string;
  type: RecipientType;
  monthlyQuota: number;
  contactPerson?: string;
  contactEmail?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RecipientSchema = new Schema<IRecipientDocument>(
  {
    name: {
      type: String,
      required: [true, 'Recipient name is required'],
      trim: true,
      index: true
    },
    type: {
      type: String,
      enum: ['family', 'agency'],
      required: [true, 'Recipient type is required'],
      index: true
    },
    monthlyQuota: {
      type: Number,
      default: 50,
      min: [0, 'Monthly quota cannot be negative']
    },
    contactPerson: {
      type: String,
      trim: true
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true
    },
    address: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export const RecipientModel = mongoose.model<IRecipientDocument>('Recipient', RecipientSchema);
