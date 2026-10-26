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
      live_hit?: number;
      live_nohit?: number;
      live_hit_tptp?: number;
      live_no_hit_tptp?: number;
      live_hit_tpul?: number;
      live_no_hit_tpul?: number;
      lt_enroll: number;
      lt_hit?: number;
      lt_nohit?: number;
      lt_no_hit?: number;
      lt_hit_lttp?: number;
      lt_no_hit_lttp?: number;
      lt_hit_ltpalm?: number;
      lt_no_hit_ltpalm?: number;
      migration: number;
      total_db_size?: number;
      tp_enroll: number;
      tp_hit?: number;
      tp_nohit?: number;
      tp_hit_tptp?: number;
      tp_no_hit_tptp?: number;
      tp_hit_tpul?: number;
      tp_no_hit_tpul?: number;
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


