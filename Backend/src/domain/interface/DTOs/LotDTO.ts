export interface LotResponseDTO {
  id: string;
  lotNumber: string;
  itemName: string;
  category: string;
  quantity: number;
  availableQuantity: number;
  unit: string;
  receivedDate: string;
  printedExpiryDate?: string;
  safetyMarginDays: number;
  effectiveExpiryDate?: string;
  donationId: string;
  donationLineId?: string;
  status: string;
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LotFilterDTO {
  search?: string;
  category?: string;
  status?: string;
  donationId?: string;
  page?: number;
  limit?: number;
}
