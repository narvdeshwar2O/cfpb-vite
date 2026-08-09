import { apiClient } from "@/shared/api/client";
import type { UserWiseResponse } from "../types/user-wise.types";

export async function fetchUserWiseStatus(
  state: string[] = [],
  district: string[] = [],
  policeStation: string[] = [],
  startDate?: string,
  endDate?: string
): Promise<UserWiseResponse> {
  const payload: Record<string, unknown> = { state, district, police_station: policeStation };
  if (startDate) payload.start_date = startDate;
  if (endDate) payload.end_date = endDate;

  try {
    const res = await apiClient.post(`/landing/state-wise-data-tenprint-status-user-wise`, payload);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch user wise status", { cause: error });
  }
}
