import { LotStatus } from '../../entities/Lot';

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
  donorName?: string;
  donorType?: string;
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
  expiryStatus?: 'all' | 'expiring_soon' | 'expired';
  sortBy?: 'receivedDate' | 'effectiveExpiryDate' | 'quantity' | 'lotNumber' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface TransitionLotStatusDTO {
  targetStatus: LotStatus | string;
  notes?: string;
}

export interface LotEventDTO {
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

export interface LotTraceDistributionDTO {
  distributionId: string;
  distributionNumber: string;
  recipientName: string;
  quantity: number;
  status: string;
  reservedAt?: string;
  completedAt?: string;
}

export interface LotTraceResponseDTO {
  lot: LotResponseDTO;
  donation?: {
    id: string;
    donationNumber: string;
    donorName: string;
    donorType: string;
    receivedAt: string;
    status: string;
  };
  timeline: LotEventDTO[];
  distributions: LotTraceDistributionDTO[];
}
