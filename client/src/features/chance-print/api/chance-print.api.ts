import { apiClient } from "@/shared/api/client";
import type { ChancePrintStatusResponse } from "../types/chance-print.types";

export async function fetchChancePrintStatus(
  state: string[] = [],
  district: string[] = [],
  startDate?: string,
  endDate?: string
): Promise<ChancePrintStatusResponse> {
  const payload: Record<string, unknown> = { state, district };
  if (startDate) payload.start_date = startDate;
  if (endDate) payload.end_date = endDate;

  try {
    const res = await apiClient.post(`/landing/chance-print-status`, payload);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch chance print status", { cause: error });
  }
}
