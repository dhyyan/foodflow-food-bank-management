export interface ParsedManifestItem {
  item_name: string;
  quantity: number | null;
  unit: string | null;
  expiry_date: string | null;
  flagged: boolean;
  flag_reason?: string;
  category?: string;
}

export interface ManifestParseResult {
  raw_text: string;
  donor_name?: string | null;
  received_date?: string | null;
  items: ParsedManifestItem[];
}

export interface ParseManifestResponse {
  success: boolean;
  message: string;
  data: ManifestParseResult;
}
