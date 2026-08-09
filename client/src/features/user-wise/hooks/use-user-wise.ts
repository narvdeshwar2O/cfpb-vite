import { useQuery } from "@tanstack/react-query";
import { fetchUserWiseStatus } from "../api/user-wise.api";
import { useStateScope } from "@/hooks/useStateScope";

export function useUserWiseStatus(
  state: string[] = [],
  district: string[] = [],
  policeStation: string[] = [],
  startDate?: string,
  endDate?: string
) {
  const { isScoped, scopedState } = useStateScope();
  const effectiveState = isScoped && scopedState ? [scopedState] : state;

  const cleanState = effectiveState.includes("all") ? [] : effectiveState;
  const cleanDistrict = district.includes("all") ? [] : district;
  const cleanPS = policeStation.includes("all") ? [] : policeStation;

  return useQuery({
    queryKey: ["user-wise-status", effectiveState, district, policeStation, startDate, endDate],
    queryFn: async () => {
      return fetchUserWiseStatus(cleanState, cleanDistrict, cleanPS, startDate, endDate);
    },
  });
}
