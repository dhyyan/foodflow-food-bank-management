export interface DistributionItemDTO {
  itemName: string;
  requestedQuantity: number;
  unit: string;
}

export interface ReservationDTO {
  id: string;
  distributionId: string;
  lotId: string;
  lotNumber: string;
  itemName: string;
  quantity: number;
  unit: string;
  status: string;
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
  recipientType: string;
  items: DistributionItemDTO[];
  status: string;
  reservations?: ReservationDTO[];
  notes?: string;
  createdBy: {
    id: string;
    name: string;
  };
  reservedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
