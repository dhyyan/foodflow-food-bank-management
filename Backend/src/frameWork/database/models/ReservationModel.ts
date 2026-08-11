import mongoose, { Schema, Document } from 'mongoose';
import { IReservation } from '../../../domain/entities/Reservation';

export interface ReservationDocument extends Omit<IReservation, 'id'>, Document {}

const ReservationSchema = new Schema(
  {
    distributionId: { type: String, required: true, index: true },
    lotId: { type: String, required: true, index: true },
    lotNumber: { type: String, required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true },
    status: { type: String, required: true, enum: ['reserved', 'released', 'cancelled'], default: 'reserved' },
    createdBy: {
      id: { type: String, required: true },
      name: { type: String, required: true }
    }
  },
  {
    timestamps: true
  }
);

ReservationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_doc, ret) {
    delete (ret as any)._id;
  },
});

export const ReservationModel = mongoose.model<ReservationDocument>('Reservation', ReservationSchema);
