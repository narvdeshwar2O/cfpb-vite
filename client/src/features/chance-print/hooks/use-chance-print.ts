import { useQuery } from "@tanstack/react-query";
import { fetchChancePrintStatus } from "../api/chance-print.api";
import { useStateScope } from "@/hooks/useStateScope";

export function useChancePrintStatus(
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
    queryKey: ["chance-print-status", effectiveState, district, startDate, endDate],
    queryFn: async () => {
      return fetchChancePrintStatus(cleanState, cleanDistrict, startDate, endDate);
    },
  });
}
