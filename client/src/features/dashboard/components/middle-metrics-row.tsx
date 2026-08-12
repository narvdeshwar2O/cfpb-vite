"use client";

import { StatCard } from "./stat-card";
import { SplitStatCard } from "./split-stat-card";
import { useEnrollData } from "@/features/dashboard/hooks/use-dashboard";
import { useFilters } from "@/app/providers/filter-provider";

export function MiddleMetricsRow() {
  const { getFilterArray, getFilterString } = useFilters();
  const startDate = getFilterString("start_date") || undefined;
  const endDate = getFilterString("end_date") || undefined;

  const selectedStates = getFilterArray("state");
  const selectedDistricts = getFilterArray("district");

  const { data: enrollData, isLoading } = useEnrollData(
    selectedStates,
    selectedDistricts,
    startDate,
    endDate,
  );

  const formatNum = (
    key: keyof NonNullable<typeof enrollData>["data"]["cards"],
  ) => {
    if (isLoading) return "Loading...";
    return enrollData?.data?.cards?.[key]?.toLocaleString() || "0";
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* 1. Total Active Users - NEUTRAL (Dummy for now) */}
      <StatCard label="Total Nafis Users" value="3,850" className="h-22.5" />

      {/* 2. Slip Capture (Ten Print) - BLUE */}
      <SplitStatCard
        stats={[
          { label: "Total Hit", value: formatNum("tp_hit") },
          { label: "Total No Hit", value: formatNum("tp_nohit") },
        ]}
        indicatorColor="blue"
        className="h-22.5"
      />

      {/* 3. Live Enrollment - EMERALD */}
      <SplitStatCard
        stats={[
          { label: "Total Hit", value: formatNum("live_hit") },
          { label: "Total No Hit", value: formatNum("live_nohit") },
        ]}
        indicatorColor="emerald"
        className="h-22.5"
      />

      {/* 4. Chance Print (Latent) - VIOLET */}
      <SplitStatCard
        stats={[
          { label: "Total Hit", value: formatNum("lt_hit") },
          { label: "Total No Hit", value: formatNum("lt_nohit") },
        ]}
        indicatorColor="violet"
        className="h-22.5"
      />
    </div>
  );
}
