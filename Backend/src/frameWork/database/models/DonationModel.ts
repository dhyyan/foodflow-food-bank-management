import mongoose, { Schema, Document } from 'mongoose';

export interface IDonationLineDocument {
  _id?: mongoose.Types.ObjectId;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  printedExpiryDate?: Date;
  notes?: string;
}

export interface IDonationDocument extends Document {
  donationNumber: string;
  donorName: string;
  donorType: string;
  receivedAt: Date;
  receivedBy: {
    id: mongoose.Types.ObjectId | string;
    name: string;
  };
  lines: IDonationLineDocument[];
  notes?: string;
  status: 'received' | 'processed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const DonationLineSchema = new Schema<IDonationLineDocument>(
  {
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true
    },
    category: {
      type: String,
      default: 'General',
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0.01, 'Quantity must be greater than zero']
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true
    },
    printedExpiryDate: {
      type: Date,
      required: false
    },
    notes: {
      type: String,
      trim: true
    }
  },
  { _id: true }
);

const DonationSchema = new Schema<IDonationDocument>(
  {
    donationNumber: {
      type: String,
      required: [true, 'Donation number is required'],
      unique: true,
      index: true
    },
    donorName: {
      type: String,
      required: [true, 'Donor name is required'],
      trim: true,
      index: true
    },
    donorType: {
      type: String,
      required: [true, 'Donor type is required'],
      trim: true,
      index: true
    },
    receivedAt: {
      type: Date,
      default: Date.now
    },
    receivedBy: {
      id: {
        type: Schema.Types.Mixed,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    },
    lines: {
      type: [DonationLineSchema],
      validate: [
        (val: IDonationLineDocument[]) => val && val.length > 0,
        'Donation must contain at least one line item'
      ]
    },
    notes: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['received', 'processed', 'cancelled'],
      default: 'received'
    }
  },
  {
    timestamps: true
  }
);

export const DonationModel = mongoose.model<IDonationDocument>('Donation', DonationSchema);
