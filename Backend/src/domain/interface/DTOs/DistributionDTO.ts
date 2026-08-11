export type AllocationPolicy = 'FEFO' | 'STRATEGIC_RESERVE';

export interface DistributionLineItemDTO {
  itemName: string;
  category?: string;
  quantityRequested: number;
}

export interface AllocatedLotItemDTO {
  lotId: string;
  lotNumber: string;
  itemName: string;
  category: string;
  allocatedQuantity: number;
  effectiveExpiryDate?: string;
  receivedDate: string;
  allocationReason: string; // e.g. "FEFO: Earliest Expiry" or "Strategic Reserve: Most Recently Received"
}

export interface DistributionAllocationPreviewRequestDTO {
  recipientName: string;
  items: DistributionLineItemDTO[];
  allocationPolicy?: AllocationPolicy;
}

export interface DistributionAllocationPreviewResponseDTO {
  recipientName: string;
  allocationPolicy: AllocationPolicy;
  totalUnitsAllocated: number;
  allocatedLots: AllocatedLotItemDTO[];
  unfulfilledItems: { itemName: string; missingQuantity: number }[];
}

export interface CreateDistributionRequestDTO {
  recipientName: string;
  familyCount?: number;
  items: DistributionLineItemDTO[];
  allocationPolicy?: AllocationPolicy;
  notes?: string;
}
