export interface WasteReportRequestDTO {
  startDate?: string;
  endDate?: string;
  category?: string;
}

export interface WasteCategorySummaryDTO {
  category: string;
  discardedQuantity: number;
  estimatedValue: number;
  lotCount: number;
  unit: string;
}

export interface WasteItemizedDetailDTO {
  lotId: string;
  lotNumber: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedValue: number;
  effectiveExpiryDate?: string;
  discardedAt: string;
  notes?: string;
}

export interface WasteReportResponseDTO {
  startDate: string;
  endDate: string;
  totalQuantity: number;
  totalEstimatedValue: number;
  totalLotsDiscarded: number;
  categoryBreakdown: WasteCategorySummaryDTO[];
  itemizedDetails: WasteItemizedDetailDTO[];
}
