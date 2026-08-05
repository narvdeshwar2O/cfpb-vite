import { useQuery } from "@tanstack/react-query";
import { fetchInterstateStatus } from "../api/interstate.api";
import { useStateScope } from "@/hooks/useStateScope";

export function useInterstateStatus(
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
    queryKey: ["interstate-status", effectiveState, district, startDate, endDate],
    queryFn: async () => {
      return fetchInterstateStatus(cleanState, cleanDistrict, startDate, endDate);
    },
  });
}
