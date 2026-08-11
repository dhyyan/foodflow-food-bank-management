import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../../../domain/entities/User';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required']
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: [true, 'User role is required'],
      default: UserRole.DONATION_CLERK
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  },
  {
    timestamps: true
  }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
