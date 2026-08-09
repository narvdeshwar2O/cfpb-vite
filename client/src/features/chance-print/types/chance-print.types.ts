export interface ChancePrintStatusItem {
  hit: number;
  nohit: number;
  state?: string;
  district?: string;
  police_station?: string;
  total_chance_print_cases: number;
  total_chance_prints: number;
}

export interface ChancePrintStatusResponse {
  success: boolean;
  data: ChancePrintStatusItem[];
  filters: Record<string, unknown>;
}
