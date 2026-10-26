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

  const getCardValue = (
    ...keys: (keyof NonNullable<typeof enrollData>["data"]["cards"])[]
  ) => {
    if (isLoading) return "Loading...";
    const cards = enrollData?.data?.cards;
    if (!cards) return "0";
    for (const key of keys) {
      const val = cards[key];
      if (val !== undefined && val !== null) {
        return val.toLocaleString();
      }
    }
    return "0";
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* 1. Total Active Users - NEUTRAL (Dummy for now) */}
      <StatCard label="Total Nafis Users" value="3,850" className="h-28" />

      {/* 2. Slip Capture (TPTP vs TPUL) - BLUE */}
      <DualSubSectionCard
        leftSection={{
          title: "TPTP",
          hit: getCardValue("tp_hit_tptp", "tp_hit"),
          noHit: getCardValue("tp_no_hit_tptp", "tp_nohit"),
        }}
        rightSection={{
          title: "TPUL",
          hit: getCardValue("tp_hit_tpul"),
          noHit: getCardValue("tp_no_hit_tpul"),
        }}
        indicatorColor="blue"
        className="h-28"
      />

      {/* 3. Live Enrollment (TPTP vs TPUL) - EMERALD */}
      <DualSubSectionCard
        leftSection={{
          title: "TPTP",
          hit: getCardValue("live_hit_tptp", "live_hit"),
          noHit: getCardValue("live_no_hit_tptp", "live_nohit"),
        }}
        rightSection={{
          title: "TPUL",
          hit: getCardValue("live_hit_tpul"),
          noHit: getCardValue("live_no_hit_tpul"),
        }}
        indicatorColor="emerald"
        className="h-28"
      />

      {/* 4. Chance Print (LT-TP vs LT-PALM) - VIOLET */}
      <DualSubSectionCard
        leftSection={{
          title: "LT-TP",
          hit: getCardValue("lt_hit_lttp"),
          noHit: getCardValue("lt_no_hit_lttp"),
        }}
        rightSection={{
          title: "LT-PALM",
          hit: getCardValue("lt_hit_ltpalm"),
          noHit: getCardValue("lt_no_hit_ltpalm"),
        }}
        indicatorColor="violet"
        className="h-28"
      />
    </div>
  );
}
