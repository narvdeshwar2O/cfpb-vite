import { apiClient } from "@/shared/api/client";
import type { WorkflowStatusResponse } from "../types/workflow.types";

export async function fetchWorkflowStatus(
  type: "live-enrollment" | "slip-capture",
  state: string[] = [],
  district: string[] = [],
  startDate?: string,
  endDate?: string
): Promise<WorkflowStatusResponse> {
  const payload: Record<string, unknown> = { state, district };
  if (startDate) payload.start_date = startDate;
  if (endDate) payload.end_date = endDate;

  try {
    const res = await apiClient.post(`/landing/${type}-status`, payload);
    return res.data;
  } catch (error) {
    throw new Error(`Failed to fetch ${type} status`, { cause: error });
  }
}
