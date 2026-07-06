export interface TotalDbSizeResponse {
  success: boolean;
  data: {
    total_db_size: number;
  };
  filters: any;
}

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://10.1.21.143:3000";

export async function fetchTotalDbSize(state: string[] = []): Promise<TotalDbSizeResponse> {
  try {
    const res = await axios.post(`${BASE_URL}/landing/total-db-size`, { state });
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch total DB size");
  }
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
      arresty_received_tp: number;
      convicted_received_tp: number;
      deadbody_received_tp: number;
      deportee_received_tp: number;
      externee_received_tp: number;
      suspect_received_tp: number;
      uifp_received_tp: number;
    };
    slip: {
      absconder_received_tp: number;
      arresty_received_tp: number;
      convicted_received_tp: number;
      deadbody_received_tp: number;
      deportee_received_tp: number;
      externee_received_tp: number;
      suspect_received_tp: number;
      uifp_received_tp: number;
    };
    top_5_districts: { district: string; tp_hit: number }[];
    top_5_states: { state: string; tp_hit: number }[];
  };
}

export async function fetchEnrollData(
  state: string[] = [],
  district: string[] = [],
  startDate?: string,
  endDate?: string
): Promise<EnrollDataResponse> {
  const payload: any = { state, district };
  if (startDate) payload.start_date = startDate;
  if (endDate) payload.end_date = endDate;

  try {
    const res = await axios.post(`${BASE_URL}/landing/enroll-data`, payload);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch enroll data");
  }
}

export interface StateDistrictMasterResponse {
  success: boolean;
  data: Record<string, string[]>;
}

export async function fetchStateDistrictMaster(): Promise<StateDistrictMasterResponse> {
  try {
    const res = await axios.get(`${BASE_URL}/landing/state-district-master`);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch state district master");
  }
}
