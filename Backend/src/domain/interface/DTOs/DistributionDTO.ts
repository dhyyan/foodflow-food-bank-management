import { RecipientType } from '../../entities/Recipient';
import { DistributionStatus } from '../../entities/Distribution';
import { ReservationStatus } from '../../entities/Reservation';

export interface DistributionItemDTO {
  itemName: string;
  requestedQuantity: number;
  unit?: string;
}

export interface CreateDistributionDTO {
  recipientId: string;
  items: DistributionItemDTO[];
  notes?: string;
}

export interface ReservationDTO {
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

export interface DistributionResponseDTO {
  id: string;
  distributionNumber: string;
  recipientId: string;
  recipientName: string;
  recipientType: RecipientType;
  items: {
    itemName: string;
    requestedQuantity: number;
    unit: string;
  }[];
  status: DistributionStatus;
  reservations?: ReservationDTO[];
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

export interface FEFOLotAllocationDTO {
  lotId: string;
  lotNumber: string;
  itemName: string;
  allocatedQuantity: number;
  unit: string;
  printedExpiryDate?: string;
  safetyMarginDays: number;
  effectiveExpiryDate?: string;
}

export interface FEFOItemAllocationDTO {
  itemName: string;
  requestedQuantity: number;
  allocatedQuantity: number;
  unit: string;
  isFulfilled: boolean;
  allocations: FEFOLotAllocationDTO[];
}

export interface FEFOPreviewResponseDTO {
  distributionId: string;
  distributionNumber: string;
  recipientName: string;
  recipientType: RecipientType;
  items: FEFOItemAllocationDTO[];
  totalRequestedUnits: number;
  totalAllocatedUnits: number;
  isFullyFulfilled: boolean;
}

export interface DistributionFilterDTO {
  search?: string;
  status?: string;
  recipientId?: string;
  page?: number;
  limit?: number;
}
