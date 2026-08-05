import { useQuery } from "@tanstack/react-query";
import { fetchTenPrintStatus } from "../api/ten-print.api";
import { useStateScope } from "@/hooks/useStateScope";

export function useTenPrintStatus(
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
    queryKey: ["ten-print-status", effectiveState, district, startDate, endDate],
    queryFn: async () => {
      return fetchTenPrintStatus(cleanState, cleanDistrict, startDate, endDate);
    },
  });
}
