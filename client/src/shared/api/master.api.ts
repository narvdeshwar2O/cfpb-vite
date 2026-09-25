import { apiClient } from "@/shared/api/client";
import type { StateDistrictMasterResponse, CountryMasterResponse } from "../types/master.types";

export async function fetchStateDistrictMaster(): Promise<StateDistrictMasterResponse> {
  try {
    const res = await apiClient.get(`/landing/state-district-master`);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch state district master", { cause: error });
  }
}

export async function fetchCountryMaster(): Promise<CountryMasterResponse> {
  try {
    const res = await apiClient.get(`/landing/country-master`);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch country master", { cause: error });
  }
}
