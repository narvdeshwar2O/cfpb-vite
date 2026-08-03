/* eslint-disable no-useless-assignment */
import { useQuery } from "@tanstack/react-query";
import { fetchTotalDbSize, fetchEnrollData } from "../api/dashboard.api";
import { useStateScope } from "@/hooks/useStateScope";

const HARDCODED_DB_SIZE: Record<string, number> = {
  "GUJARAT": 202000,
  "JAMMU AND KASHMIR": 16638,
  "JAMMU": 16638,
  "MAHARASHTRA": 145700,
  "ODISHA": 52876,
  "RAJASTHAN": 39000,
  "PRISON": 762000,
};

export function useTotalDbSize(state: string[] = []) {
  const { isScoped, scopedState } = useStateScope();
  const effectiveState = isScoped && scopedState ? [scopedState] : state;
  const cleanState = effectiveState.includes("all") ? [] : effectiveState;

  return useQuery({
    queryKey: ["total-db-size", effectiveState], // Use effective state for unique caching
    queryFn: async () => {
      let apiTotal = 0;
      let apiResult = null;

      if (effectiveState.length === 0) {
        apiResult = { success: true, data: { total_db_size: 0 }, filters: {} };
      } else {
        apiResult = await fetchTotalDbSize(cleanState);
        if (apiResult.success && apiResult.data) {
          apiTotal = apiResult.data.total_db_size || 0;
        }
      }

      let hardcodedTotal = 0;
      if (effectiveState.length === 0) {
        hardcodedTotal = 0;
      } else if (cleanState.length === 0) {
        // "All" selected
        hardcodedTotal = Object.values(HARDCODED_DB_SIZE).reduce((acc, curr) => acc + curr, 0);
        hardcodedTotal -= 16638; // Deduct duplicate "Jammu"
      } else {
        hardcodedTotal = cleanState.reduce((acc, curr) => acc + (HARDCODED_DB_SIZE[curr.toUpperCase()] || 0), 0);
      }

      const finalTotal = apiTotal + hardcodedTotal;

      return { success: true, data: { total_db_size: finalTotal }, filters: apiResult?.filters || {} };
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


