import { useTotalDbSize, useEnrollData } from "@/features/dashboard/hooks/use-dashboard";
import { useFilters } from "@/app/providers/filter-provider";
import React from "react";

export function useTopMetrics() {
  const { getFilterArray, getFilterString } = useFilters();
  
  const selectedStates = getFilterArray("state");
  const selectedDistricts = getFilterArray("district");
  
  const startDate = getFilterString("start_date") || undefined;
  const endDate = getFilterString("end_date") || undefined;

  const { data: dbData, isLoading: dbLoading, isError: dbError } = useTotalDbSize(selectedStates);
  const { data: enrollData, isLoading: enrollLoading, isError: enrollError } = useEnrollData(
    selectedStates,
    selectedDistricts,
    startDate,
    endDate
  );

  let totalDbSizeValue: string | React.ReactNode = "0";
  if (dbLoading) {
    totalDbSizeValue = "loading";
  } else if (!dbError && dbData) {
    totalDbSizeValue = dbData.data?.total_db_size?.toLocaleString() || "0";
  }

  const getEnrollValue = (key: keyof NonNullable<typeof enrollData>['data']['cards']): string | React.ReactNode => {
    if (enrollLoading) return "loading";
    if (enrollError) return "0";
    if (enrollData?.data?.cards) {
      return enrollData.data.cards[key].toLocaleString();
    }
    return "0";
  };

  const metrics = [
    { label: "Total DB Size", value: totalDbSizeValue },
    { label: "Total Digitization/Migration", value: getEnrollValue("migration") },
    { label: "Total Slip Capture", value: getEnrollValue("tp_enroll"), color: "blue" as const },
    { label: "Total Live Enrollment", value: getEnrollValue("live_enroll"), color: "emerald" as const },
    { label: "Total Chance Print", value: getEnrollValue("lt_enroll"), color: "violet" as const },
  ];

  return { metrics };
}
