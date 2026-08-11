export interface CreateDonationLineDTO {
  itemName: string;
  category?: string;
  quantity: number;
  unit: string;
  printedExpiryDate?: string | Date;
  safetyMarginDays?: number;
  notes?: string;
}

export interface CreateDonationDTO {
  donorName: string;
  donorType: string;
  receivedAt?: string | Date;
  lines: CreateDonationLineDTO[];
  notes?: string;
}

export interface DonationLineResponseDTO {
  id?: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  printedExpiryDate?: string;
  notes?: string;
}

export interface DonationResponseDTO {
  id: string;
  donationNumber: string;
  donorName: string;
  donorType: string;
  receivedAt: string;
  receivedBy: {
    id: string;
    name: string;
  };
  lines: DonationLineResponseDTO[];
  totalLines: number;
  totalQuantity: number;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DonationFilterDTO {
  search?: string;
  donorType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
