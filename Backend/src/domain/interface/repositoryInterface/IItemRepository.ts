import { Item } from '../../entities/Item';

export interface IItemRepository {
  create(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item>;
  findById(id: string): Promise<Item | null>;
  findAll(): Promise<Item[]>;
  update(id: string, itemData: Partial<Item>): Promise<Item | null>;
  delete(id: string): Promise<boolean>;
}
