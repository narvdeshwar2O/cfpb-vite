export interface TenPrintStatusItem {
  cp_delete: number;
  cp_enroll: number;
  cp_verified: number;
  state?: string;
  district?: string;
  police_station?: string;
  tp_delete: number;
  tp_enroll: number;
  tp_verified: number;
}

export interface TenPrintStatusResponse {
  success: boolean;
  data: TenPrintStatusItem[];
  filters: Record<string, unknown>;
}
