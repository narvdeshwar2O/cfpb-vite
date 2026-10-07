"use client";

import { StatCard } from "./stat-card";
import { DualSubSectionCard } from "./dual-sub-section-card";
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
      <StatCard label="Total Nafis Users" value="3,850" className="h-28" />

      {/* 2. Slip Capture (TPTP vs TPUL) - BLUE */}
      <DualSubSectionCard
        leftSection={{
          title: "TPTP",
          hit: formatNum("tp_hit"),
          noHit: formatNum("tp_nohit"),
        }}
        rightSection={{
          title: "TPUL",
          hit: 0,
          noHit: 0,
        }}
        indicatorColor="blue"
        className="h-28"
      />

      {/* 3. Live Enrollment (TPTP vs TPUL) - EMERALD */}
      <DualSubSectionCard
        leftSection={{
          title: "TPTP",
          hit: formatNum("live_hit"),
          noHit: formatNum("live_nohit"),
        }}
        rightSection={{
          title: "TPUL",
          hit: 0,
          noHit: 0,
        }}
        indicatorColor="emerald"
        className="h-28"
      />

      {/* 4. Chance Print (LT-TP vs LT-PALM) - VIOLET */}
      <DualSubSectionCard
        leftSection={{
          title: "LT-TP",
          hit: formatNum("lt_hit"),
          noHit: formatNum("lt_nohit"),
        }}
        rightSection={{
          title: "LT-PALM",
          hit: 0,
          noHit: 0,
        }}
        indicatorColor="violet"
        className="h-28"
      />
    </div>
  );
}
