export interface InterstateStatusItem {
  lt_inter_hit: number;
  lt_intra_hit: number;
  state: string;
  tp_inter_hit: number;
  tp_intra_hit: number;
}

export interface InterstateStatusResponse {
  success: boolean;
  data: InterstateStatusItem[];
  filters: Record<string, unknown>;
}
