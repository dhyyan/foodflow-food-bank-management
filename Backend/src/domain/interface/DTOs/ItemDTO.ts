export interface CreateItemDTO {
  name: string;
  category: string;
  unit: string;
  isPerishable: boolean;
  shelfLifeDays: number;
}

export interface UpdateItemDTO {
  name?: string;
  category?: string;
  unit?: string;
  isPerishable?: boolean;
  shelfLifeDays?: number;
}

export interface ItemResponseDTO {
  id: string;
  name: string;
  category: string;
  unit: string;
  isPerishable: boolean;
  shelfLifeDays: number;
  createdAt: Date;
  updatedAt: Date;
}
