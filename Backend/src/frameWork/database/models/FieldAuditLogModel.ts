import mongoose, { Schema, Document } from 'mongoose';

export interface IFieldAuditLog extends Document {
  entityType: string;
  entityId: string;
  lotNumber?: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  changedBy: {
    id: string;
    name: string;
    role?: string;
  };
  notes?: string;
  timestamp: Date;
}

const FieldAuditLogSchema: Schema = new Schema(
  {
    entityType: { type: String, required: true, default: 'Lot' },
    entityId: { type: String, required: true },
    lotNumber: { type: String },
    fieldName: { type: String, required: true },
    oldValue: { type: String, default: 'N/A' },
    newValue: { type: String, default: 'N/A' },
    changedBy: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      role: { type: String }
    },
    notes: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const FieldAuditLogModel = mongoose.model<IFieldAuditLog>(
  'FieldAuditLog',
  FieldAuditLogSchema
);
