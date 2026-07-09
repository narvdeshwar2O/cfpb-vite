import { useQuery } from "@tanstack/react-query";
import { fetchTotalDbSize, fetchEnrollData, fetchStateDistrictMaster } from "@/services/dashboard.service";

export function useTotalDbSize(state: string[] = []) {
  const cleanState = state.includes("all") ? [] : state;
  return useQuery({
    queryKey: ["total-db-size", state], // Use raw state for unique caching
    queryFn: async () => {
      if (state.length === 0) {
        return { success: true, data: { total_db_size: 0 }, filters: {} };
      }
      return fetchTotalDbSize(cleanState);
    },
  });
}

export function useEnrollData(
  state: string[] = [],
  district: string[] = [],
  startDate?: string,
  endDate?: string
) {
  const cleanState = state.includes("all") ? [] : state;
  const cleanDistrict = district.includes("all") ? [] : district;
  
  return useQuery({
    queryKey: ["enroll-data", state, district, startDate, endDate], // Use raw state/district
    queryFn: async () => {
      if (state.length === 0 || district.length === 0) {
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

export function useStateDistrictMaster() {
  return useQuery({
    queryKey: ["state-district-master"],
    queryFn: fetchStateDistrictMaster,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
