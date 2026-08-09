import { useQuery } from "@tanstack/react-query";
import { fetchTotalDbSize, fetchEnrollData } from "../api/dashboard.api";
import { useStateScope } from "@/hooks/useStateScope";

export function useTotalDbSize(state: string[] = []) {
  const { isScoped, scopedState } = useStateScope();
  const effectiveState = isScoped && scopedState ? [scopedState] : state;
  const cleanState = effectiveState.includes("all") ? [] : effectiveState;

  return useQuery({
    queryKey: ["total-db-size", effectiveState], 
    queryFn: async () => {
      if (effectiveState.length === 0) {
        return { success: true, data: { total_db_size: 0 }, filters: {} };
      }
      
      const apiResult = await fetchTotalDbSize(cleanState);
      const apiTotal = (apiResult.success && apiResult.data) ? (apiResult.data.total_db_size || 0) : 0;
      
      return { success: true, data: { total_db_size: apiTotal }, filters: apiResult?.filters || {} };
    },
  });
}

export function useEnrollData(
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
    queryKey: ["enroll-data", effectiveState, district, startDate, endDate], 
    queryFn: async () => {
      if (effectiveState.length === 0 || district.length === 0) {
        return {
          success: true,
          data: {
            cards: {
              migration: 0, tp_enroll: 0, live_enroll: 0, lt_enroll: 0,
              tp_hit: 0, tp_nohit: 0, live_hit: 0, live_nohit: 0,
              lt_hit: 0, lt_nohit: 0,
            },
            mesa: null,
            slip: null,
            top_5_states: [],
            top_5_districts: []
          }
        };
      }
      return fetchEnrollData(cleanState, cleanDistrict, startDate, endDate);
    },
  });
}


