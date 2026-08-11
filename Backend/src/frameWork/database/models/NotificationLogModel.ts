import mongoose, { Schema, Document } from 'mongoose';

export type NotificationType = 'EXPIRY_ALERT_48H' | 'DAILY_INTAKE_SUMMARY';

export interface INotificationLog extends Document {
  type: NotificationType;
  recipientEmail: string;
  recipientName: string;
  recipientRole: string;
  subject: string;
  status: 'sent' | 'failed' | 'simulated';
  payloadSummary: string;
  itemCount: number;
  sentAt: Date;
}

const NotificationLogSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ['EXPIRY_ALERT_48H', 'DAILY_INTAKE_SUMMARY'],
      required: true
    },
    recipientEmail: { type: String, required: true },
    recipientName: { type: String, required: true },
    recipientRole: { type: String, required: true },
    subject: { type: String, required: true },
    status: {
      type: String,
      enum: ['sent', 'failed', 'simulated'],
      default: 'sent'
    },
    payloadSummary: { type: String, required: true },
    itemCount: { type: Number, default: 0 },
    sentAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const NotificationLogModel = mongoose.model<INotificationLog>(
  'NotificationLog',
  NotificationLogSchema
);
