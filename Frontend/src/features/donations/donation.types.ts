export interface DonationLineItemInput {
  itemName: string;
  category?: string;
  quantity: number;
  unit: string;
  printedExpiryDate?: string;
  safetyMarginDays?: number;
  notes?: string;
}

export interface CreateDonationPayload {
  donorName: string;
  donorType: string;
  receivedAt?: string;
  lines: DonationLineItemInput[];
  notes?: string;
}

export interface DonationLineRecord {
  id?: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  printedExpiryDate?: string;
  notes?: string;
}

export interface DonationRecord {
  id: string;
  donationNumber: string;
  donorName: string;
  donorType: string;
  receivedAt: string;
  receivedBy: {
    id: string;
    name: string;
  };
  lines: DonationLineRecord[];
  totalLines: number;
  totalQuantity: number;
  notes?: string;
  status: 'received' | 'processed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface LotRecord {
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
  status: 'received' | 'checked' | 'shelved' | 'reserved' | 'released' | 'quarantined' | 'discarded';
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DonationDetailsResponse {
  donation: DonationRecord;
  lots: LotRecord[];
}

export interface DonationFilterParams {
  search?: string;
  donorType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
