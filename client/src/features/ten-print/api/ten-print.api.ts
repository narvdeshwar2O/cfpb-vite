import { apiClient } from "@/shared/api/client";
import type { TenPrintStatusResponse } from "../types/ten-print.types";

export async function fetchTenPrintStatus(
  state: string[] = [],
  district: string[] = [],
  startDate?: string,
  endDate?: string
): Promise<TenPrintStatusResponse> {
  const payload: Record<string, unknown> = { state, district };
  if (startDate) payload.start_date = startDate;
  if (endDate) payload.end_date = endDate;

  try {
    const res = await apiClient.post(`/landing/state-wise-data-tenprint-status`, payload);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch ten print status", { cause: error });
  }
}
