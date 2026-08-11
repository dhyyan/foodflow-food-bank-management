import mongoose, { Schema, Document } from 'mongoose';
import { Item } from '../../../domain/entities/Item';

export interface ItemDocument extends Omit<Item, 'id'>, Document {}

const ItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    unit: { type: String, required: true },
    isPerishable: { type: Boolean, required: true },
    shelfLifeDays: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// Map _id to id
ItemSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_doc, ret) {
    delete ret._id;
  },
});

export const ItemModel = mongoose.model<ItemDocument>('Item', ItemSchema);
