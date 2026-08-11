export interface CreateItemDTO {
  name: string;
  category: string;
  unit: string;
  shelfLifeDays: number;
}

export interface UpdateItemDTO {
  name?: string;
  category?: string;
  unit?: string;
  shelfLifeDays?: number;
}

export interface ItemResponseDTO {
  id: string;
  name: string;
  category: string;
  unit: string;
  shelfLifeDays: number;
  createdAt: Date;
  updatedAt: Date;
}
