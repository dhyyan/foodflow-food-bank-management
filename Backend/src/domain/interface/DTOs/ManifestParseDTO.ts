export interface ParseManifestRequestDTO {
  manifestText?: string;
  imageBase64?: string;
  mimeType?: string;
}

export interface ParsedManifestItemDTO {
  item_name: string;
  quantity: number | null;
  unit: string | null;
  expiry_date: string | null;
  flagged: boolean;
  flag_reason?: string;
  category?: string;
}

export interface ManifestParseResultDTO {
  raw_text: string;
  donor_name?: string | null;
  received_date?: string | null;
  items: ParsedManifestItemDTO[];
}
