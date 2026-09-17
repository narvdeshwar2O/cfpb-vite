import { apiClient } from "@/shared/api/client";
import type { FpiResponse } from "../types/fpi-status.types";

export async function fetchFpiData<T = Record<string, unknown>>(
  endpoint: string,
  payload: Record<string, unknown>
): Promise<FpiResponse<T>> {
  try {
    const res = await apiClient.post<FpiResponse<T>>(endpoint, payload);
    return res.data;
  } catch (error) {
    throw new Error(`Failed to fetch data from ${endpoint}`, { cause: error });
  }
}
