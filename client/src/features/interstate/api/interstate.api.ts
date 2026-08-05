import { apiClient } from "@/shared/api/client";
import type { InterstateStatusResponse } from "../types/interstate.types";

export async function fetchInterstateStatus(
  state: string[] = [],
  district: string[] = [],
  startDate?: string,
  endDate?: string
): Promise<InterstateStatusResponse> {
  const payload: Record<string, unknown> = { state, district };
  if (startDate) payload.start_date = startDate;
  if (endDate) payload.end_date = endDate;

  try {
    const res = await apiClient.post(`/landing/intra-inter-hit-status`, payload);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch interstate status", { cause: error });
  }
}
