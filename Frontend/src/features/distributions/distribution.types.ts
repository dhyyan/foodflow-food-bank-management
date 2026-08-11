export type RecipientType = 'family' | 'agency';
export type DistributionStatus = 'pending' | 'reserved' | 'completed' | 'cancelled';
export type ReservationStatus = 'reserved' | 'released' | 'cancelled';

export interface Recipient {
  id: string;
  name: string;
  type: RecipientType;
  monthlyQuota: number;
  contactPerson?: string;
  contactEmail?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DistributionItem {
  itemName: string;
  requestedQuantity: number;
  unit: string;
}

export interface Reservation {
  id: string;
  distributionId: string;
  lotId: string;
  lotNumber: string;
  itemName: string;
  quantity: number;
  unit: string;
  status: ReservationStatus;
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface DistributionRecord {
  id: string;
  distributionNumber: string;
  recipientId: string;
  recipientName: string;
  recipientType: RecipientType;
  items: DistributionItem[];
  status: DistributionStatus;
  reservations?: Reservation[];
  createdBy: {
    id: string;
    name: string;
  };
  notes?: string;
  reservedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FEFOLotAllocation {
  lotId: string;
  lotNumber: string;
  itemName: string;
  allocatedQuantity: number;
  unit: string;
  printedExpiryDate?: string;
  safetyMarginDays: number;
  effectiveExpiryDate?: string;
}

export interface FEFOItemAllocation {
  itemName: string;
  requestedQuantity: number;
  allocatedQuantity: number;
  unit: string;
  isFulfilled: boolean;
  allocations: FEFOLotAllocation[];
}

export interface FEFOPreviewResponse {
  distributionId: string;
  distributionNumber: string;
  recipientName: string;
  recipientType: RecipientType;
  items: FEFOItemAllocation[];
  totalRequestedUnits: number;
  totalAllocatedUnits: number;
  isFullyFulfilled: boolean;
}

export interface CreateDistributionPayload {
  recipientId: string;
  items: {
    itemName: string;
    requestedQuantity: number;
    unit?: string;
  }[];
  notes?: string;
}

export interface DistributionFilterParams {
  search?: string;
  status?: string;
  recipientId?: string;
  page?: number;
  limit?: number;
}
