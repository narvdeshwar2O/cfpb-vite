import { useQuery } from "@tanstack/react-query";
import { fetchStateDistrictMaster } from "../api/master.api";

export function useStateDistrictMaster() {
  return useQuery({
    queryKey: ["state-district-master"],
    queryFn: fetchStateDistrictMaster,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
