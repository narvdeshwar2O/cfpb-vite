import { useQuery } from "@tanstack/react-query";
import { useFilters } from "@/app/providers/filter-provider";
import { useStateScope } from "@/hooks/useStateScope";
import { fetchFpiData } from "../api/fpi-status.api";

const createPayload = (
  filters: ReturnType<typeof useFilters>['filters'],
  isScoped: boolean,
  scopedState: string | null,
  useCountry: boolean = false
) => {
  const effectiveState = isScoped && scopedState ? [scopedState] : filters.state;
  const cleanState = effectiveState.includes("all") ? [] : effectiveState;

  if (useCountry) {
    return {
      country: filters.country.includes("all") ? [] : filters.country,
      state: cleanState,
      start_date: filters.start_date,
      end_date: filters.end_date
    };
  }
  return {
    state: cleanState,
    start_date: filters.start_date,
    end_date: filters.end_date
  };
};

export function useHumanBodyData() {
  const { filters } = useFilters();
  const { isScoped, scopedState } = useStateScope();
  const effectiveState = isScoped && scopedState ? [scopedState] : filters.state;

  return useQuery({
    queryKey: ["fpi-human-body", effectiveState, filters.start_date, filters.end_date],
    queryFn: () => fetchFpiData('/fpi/human', createPayload(filters, isScoped, scopedState))
  });
}

export function usePropertyData() {
  const { filters } = useFilters();
  const { isScoped, scopedState } = useStateScope();
  const effectiveState = isScoped && scopedState ? [scopedState] : filters.state;

  return useQuery({
    queryKey: ["fpi-property", effectiveState, filters.start_date, filters.end_date],
    queryFn: () => fetchFpiData('/fpi/human', createPayload(filters, isScoped, scopedState))
  });
}

export function useExpertOpinionData() {
  const { filters } = useFilters();
  const { isScoped, scopedState } = useStateScope();
  const effectiveState = isScoped && scopedState ? [scopedState] : filters.state;

  return useQuery({
    queryKey: ["fpi-expert-opinion", effectiveState, filters.start_date, filters.end_date],
    queryFn: () => fetchFpiData('/fpi/lvq-rvq', createPayload(filters, isScoped, scopedState))
  });
}

export function useTenPrintsData() {
  const { filters } = useFilters();
  const { isScoped, scopedState } = useStateScope();
  const effectiveState = isScoped && scopedState ? [scopedState] : filters.state;

  return useQuery({
    queryKey: ["fpi-ten-print", effectiveState, filters.start_date, filters.end_date],
    queryFn: () => fetchFpiData('/fpi/tenprint-enrolled', createPayload(filters, isScoped, scopedState))
  });
}

export function useForeignersTpData() {
  const { filters } = useFilters();
  const { isScoped, scopedState } = useStateScope();
  const effectiveState = isScoped && scopedState ? [scopedState] : filters.state;

  return useQuery({
    queryKey: ["fpi-foreigners", filters.country, effectiveState, filters.start_date, filters.end_date],
    queryFn: () => fetchFpiData('/fpi/foreigners-enrolled', createPayload(filters, isScoped, scopedState, true))
  });
}

export function useChancePrintData() {
  const { filters } = useFilters();
  const { isScoped, scopedState } = useStateScope();
  const effectiveState = isScoped && scopedState ? [scopedState] : filters.state;

  return useQuery({
    queryKey: ["fpi-chance-print", effectiveState, filters.start_date, filters.end_date],
    queryFn: () => fetchFpiData('/fpi/chance-print', createPayload(filters, isScoped, scopedState))
  });
}
