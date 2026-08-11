export interface Item {
  id?: string;
  name: string;
  category: string;
  unit: string;
  isPerishable: boolean;
  shelfLifeDays: number;
  createdAt?: Date;
  updatedAt?: Date;
}
