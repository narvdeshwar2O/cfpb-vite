import { useQuery } from "@tanstack/react-query";
import { fetchWorkflowStatus } from "../api/workflow.api";
import { useStateScope } from "@/hooks/useStateScope";

export function useWorkflowStatus(
  type: "live-enrollment" | "slip-capture",
  state: string[] = [],
  district: string[] = [],
  startDate?: string,
  endDate?: string
) {
  const { isScoped, scopedState } = useStateScope();
  const effectiveState = isScoped && scopedState ? [scopedState] : state;

  const cleanState = effectiveState.includes("all") ? [] : effectiveState;
  const cleanDistrict = district.includes("all") ? [] : district;

  return useQuery({
    queryKey: [`${type}-status`, effectiveState, district, startDate, endDate],
    queryFn: async () => {
      return fetchWorkflowStatus(type, cleanState, cleanDistrict, startDate, endDate);
    },
  });
}
