import { useQuery } from "@tanstack/react-query";
import { useFilters } from "@/app/providers/filter-provider";

const API_BASE = import.meta.env.VITE_API_URL;

const createPayload = (filters: ReturnType<typeof useFilters>['filters'], useCountry: boolean = false) => {
  if (useCountry) {
    return {
      country: filters.country.includes("all") ? [] : filters.country,
      start_date: filters.start_date,
      end_date: filters.end_date
    };
  }
  return {
    state: filters.state.includes("all") ? [] : filters.state,
    start_date: filters.start_date,
    end_date: filters.end_date
  };
};

const fetchFpiData = async (endpoint: string, payload: Record<string, unknown>) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to fetch data from ${endpoint}`);
  return res.json();
};

export function useHumanBodyData() {
  const { filters } = useFilters();
  return useQuery({
    queryKey: ["fpi-human-body", filters.state, filters.start_date, filters.end_date],
    queryFn: () => fetchFpiData('/fpi/human', createPayload(filters))
  });
}

export function usePropertyData() {
  const { filters } = useFilters();
  return useQuery({
    queryKey: ["fpi-property", filters.state, filters.start_date, filters.end_date],
    queryFn: () => fetchFpiData('/fpi/human', createPayload(filters))
  });
}

export function useExpertOpinionData() {
  const { filters } = useFilters();
  return useQuery({
    queryKey: ["fpi-expert-opinion", filters.state, filters.start_date, filters.end_date],
    queryFn: () => fetchFpiData('/fpi/lvq-rvq', createPayload(filters))
  });
}

export function useTenPrintsData() {
  const { filters } = useFilters();
  return useQuery({
    queryKey: ["fpi-ten-print", filters.state, filters.start_date, filters.end_date],
    queryFn: () => fetchFpiData('/fpi/tenprint-enrolled', createPayload(filters))
  });
}

export function useForeignersTpData() {
  const { filters } = useFilters();
  return useQuery({
    queryKey: ["fpi-foreigners", filters.country, filters.start_date, filters.end_date],
    queryFn: () => fetchFpiData('/fpi/foreigners-enrolled', createPayload(filters, true))
  });
}

export function useChancePrintData() {
  const { filters } = useFilters();
  return useQuery({
    queryKey: ["fpi-chance-print", filters.state, filters.start_date, filters.end_date],
    queryFn: () => fetchFpiData('/fpi/chance-print', createPayload(filters))
  });
}
