export interface Item {
  id?: string;
  name: string;
  category: string;
  unit: string;
  shelfLifeDays: number;
  createdAt?: Date;
  updatedAt?: Date;
}
