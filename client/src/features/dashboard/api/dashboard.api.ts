import { apiClient } from "@/shared/api/client";
import type { TotalDbSizeResponse, EnrollDataResponse } from "../types/dashboard.types";

export async function fetchTotalDbSize(state: string[] = []): Promise<TotalDbSizeResponse> {
  try {
    const res = await apiClient.post(`/landing/total-db-size`, { state });
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch total DB size", { cause: error });
  }
}

export async function fetchEnrollData(
  state: string[] = [],
  district: string[] = [],
  startDate?: string,
  endDate?: string
): Promise<EnrollDataResponse> {
  const payload: Record<string, unknown> = { state, district };
  if (startDate) payload.start_date = startDate;
  if (endDate) payload.end_date = endDate;

  try {
    const res = await apiClient.post(`/landing/enroll-data`, payload);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch enroll data", { cause: error });
  }
}


