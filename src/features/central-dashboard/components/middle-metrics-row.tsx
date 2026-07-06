"use client";

import { StatCard } from "@/features/reports/shared/components/stat-card";
import { SplitStatCard } from "@/features/reports/shared/components/split-stat-card";
import { useEnrollData } from "@/hooks/use-dashboard";
import { useSearchParams } from "react-router-dom";

export function MiddleMetricsRow() {
  const [searchParams] = useSearchParams();
  const stateParam = searchParams.get("state");
  const districtParam = searchParams.get("district");
  const startDate = searchParams.get("start_date") || undefined;
  const endDate = searchParams.get("end_date") || undefined;

  const selectedStates = !stateParam ? ["all"] : stateParam === "none" ? [] : stateParam.split(",");
  const selectedDistricts = !districtParam ? ["all"] : districtParam === "none" ? [] : districtParam.split(",");

  const { data: enrollData, isLoading } = useEnrollData(
    selectedStates,
    selectedDistricts,
    startDate,
    endDate
  );

  const formatNum = (key: keyof NonNullable<typeof enrollData>['data']['cards']) => {
    if (isLoading) return "Loading...";
    return enrollData?.data?.cards?.[key]?.toLocaleString() || "0";
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* 1. Total Active Users - NEUTRAL (Dummy for now) */}
      <StatCard
        label="Total Active Users"
        value="3,850"
        className="h-[90px]"
      />

      {/* 2. Slip Capture (Ten Print) - BLUE */}
      <SplitStatCard
        stats={[
          { label: "Total Hit", value: formatNum("tp_hit") },
          { label: "Total No Hit", value: formatNum("tp_nohit") },
        ]}
        indicatorColor="blue"
        className="h-[90px]"
      />

      {/* 3. Live Enrollment - EMERALD */}
      <SplitStatCard
        stats={[
          { label: "Total Hit", value: formatNum("live_hit") },
          { label: "Total No Hit", value: formatNum("live_nohit") },
        ]}
        indicatorColor="emerald"
        className="h-[90px]"
      />

      {/* 4. Chance Print (Latent) - VIOLET */}
      <SplitStatCard
        stats={[
          { label: "Total Hit", value: formatNum("lt_hit") },
          { label: "Total No Hit", value: formatNum("lt_nohit") },
        ]}
        indicatorColor="violet"
        className="h-[90px]"
      />
    </div>
  );
}
