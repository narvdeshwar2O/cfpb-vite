export interface TotalDbSizeResponse {
  success: boolean;
  data: {
    total_db_size: number;
  };
  filters: Record<string, unknown>;
}

export interface EnrollDataResponse {
  success: boolean;
  data: {
    cards: {
      live_enroll: number;
      live_hit: number;
      live_nohit: number;
      lt_enroll: number;
      lt_hit: number;
      lt_nohit: number;
      migration: number;
      tp_enroll: number;
      tp_hit: number;
      tp_nohit: number;
    };
    mesa: {
      absconder_received_tp: number;
      absconder_received_tp_percentage: number;
      arresty_received_tp: number;
      arresty_received_tp_percentage: number;
      convicted_received_tp: number;
      convicted_received_tp_percentage: number;
      deadbody_received_tp: number;
      deadbody_received_tp_percentage: number;
      deportee_received_tp: number;
      deportee_received_tp_percentage: number;
      externee_received_tp: number;
      externee_received_tp_percentage: number;
      suspect_received_tp: number;
      suspect_received_tp_percentage: number;
      uifp_received_tp: number;
      uifp_received_tp_percentage: number;
    };
    slip: {
      absconder_received_tp: number;
      absconder_received_tp_percentage: number;
      arresty_received_tp: number;
      arresty_received_tp_percentage: number;
      convicted_received_tp: number;
      convicted_received_tp_percentage: number;
      deadbody_received_tp: number;
      deadbody_received_tp_percentage: number;
      deportee_received_tp: number;
      deportee_received_tp_percentage: number;
      externee_received_tp: number;
      externee_received_tp_percentage: number;
      suspect_received_tp: number;
      suspect_received_tp_percentage: number;
      uifp_received_tp: number;
      uifp_received_tp_percentage: number;
    };
    top_5_districts: { district: string; tp_hit: number }[];
    top_5_states: { state: string; tp_hit: number }[];
  };
}


