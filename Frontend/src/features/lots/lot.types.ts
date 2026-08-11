export type LotStatus =
  | 'received'
  | 'checked'
  | 'shelved'
  | 'reserved'
  | 'released'
  | 'quarantined'
  | 'discarded';

export interface LotItem {
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
  donorName?: string;
  donorType?: string;
  status: LotStatus;
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LotEventItem {
  id: string;
  lotId: string;
  eventType: string;
  previousStatus?: string;
  newStatus: string;
  performedBy: {
    id: string;
    name: string;
    role?: string;
  };
  notes?: string;
  timestamp: string;
}

export interface LotTraceResponse {
  lot: LotItem;
  donation?: {
    id: string;
    donationNumber: string;
    donorName: string;
    donorType: string;
    receivedAt: string;
    status: string;
  };
  timeline: LotEventItem[];
}

export interface LotFilterParams {
  search?: string;
  category?: string;
  status?: string;
  donationId?: string;
  expiryStatus?: 'all' | 'expiring_soon' | 'expired';
  sortBy?: 'receivedDate' | 'effectiveExpiryDate' | 'quantity' | 'lotNumber' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface TransitionLotStatusPayload {
  targetStatus: LotStatus;
  notes?: string;
}

export interface LotListResponse {
  lots: LotItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
