export interface UserWiseData {
  state?: string;
  district?: string;
  police_station?: string;
  unique_user_count: number;
  tp_enroll: number;
  tp_verified: number;
  tp_delete: number;
  cp_enroll: number;
  cp_verified: number;
  cp_delete: number;
}

export interface UserWiseResponse {
  success: boolean;
  data: UserWiseData[];
  filters: Record<string, unknown>;
}
