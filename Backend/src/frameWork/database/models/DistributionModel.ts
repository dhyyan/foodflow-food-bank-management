import mongoose, { Schema, Document } from 'mongoose';
import { IDistribution } from '../../../domain/entities/Distribution';

export interface DistributionDocument extends Omit<IDistribution, 'id'>, Document {}

const DistributionItemSchema = new Schema({
  itemName: { type: String, required: true },
  requestedQuantity: { type: Number, required: true, min: 1 },
  unit: { type: String, required: true }
}, { _id: false });

const DistributionSchema = new Schema(
  {
    distributionNumber: { type: String, required: true, unique: true },
    recipientId: { type: String, required: true },
    recipientName: { type: String, required: true },
    recipientType: { type: String, required: true, enum: ['agency', 'family'] },
    items: [DistributionItemSchema],
    status: { type: String, required: true, enum: ['pending', 'reserved', 'completed', 'cancelled'], default: 'pending' },
    notes: { type: String },
    createdBy: {
      id: { type: String, required: true },
      name: { type: String, required: true }
    },
    reservedAt: { type: Date },
    completedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

DistributionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_doc, ret) {
    delete (ret as any)._id;
  },
});

export const DistributionModel = mongoose.model<DistributionDocument>('Distribution', DistributionSchema);
