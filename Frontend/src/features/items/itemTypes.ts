export interface Item {
  id: string;
  name: string;
  category: string;
  unit: string;
  shelfLifeDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemRequest {
  name: string;
  category: string;
  unit: string;
  shelfLifeDays: number;
}

export interface UpdateItemRequest {
  id: string;
  name?: string;
  category?: string;
  unit?: string;
  shelfLifeDays?: number;
}
