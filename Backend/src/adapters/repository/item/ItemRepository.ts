import { IItemRepository } from '../../../domain/interface/repositoryInterface/IItemRepository';
import { Item } from '../../../domain/entities/Item';
import { ItemModel, ItemDocument } from '../../../frameWork/database/models/ItemModel';

export class ItemRepository implements IItemRepository {
  async create(itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> {
    const item = new ItemModel(itemData);
    const savedItem = await item.save();
    return this.mapToDomain(savedItem);
  }

  async findById(id: string): Promise<Item | null> {
    const item = await ItemModel.findById(id).exec();
    if (!item) return null;
    return this.mapToDomain(item);
  }

  async findAll(): Promise<Item[]> {
    const items = await ItemModel.find().sort({ name: 1 }).exec();
    return items.map(this.mapToDomain);
  }

  async update(id: string, itemData: Partial<Item>): Promise<Item | null> {
    const item = await ItemModel.findByIdAndUpdate(
      id,
      { $set: itemData },
      { new: true }
    ).exec();
    if (!item) return null;
    return this.mapToDomain(item);
  }

  async delete(id: string): Promise<boolean> {
    const result = await ItemModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  private mapToDomain(doc: ItemDocument): Item {
    return {
      id: doc._id.toString(),
      name: doc.name,
      category: doc.category,
      unit: doc.unit,
      shelfLifeDays: doc.shelfLifeDays,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
