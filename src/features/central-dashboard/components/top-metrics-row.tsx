"use client";

import { StatCard } from "@/features/reports/shared/components/stat-card";
import { TOP_METRICS } from "../constants/constants";
import { useTotalDbSize, useEnrollData } from "@/hooks/use-dashboard";
import { useSearchParams } from "react-router-dom";

export function TopMetricsRow() {
  const [searchParams] = useSearchParams();
  const stateParam = searchParams.get("state");
  const districtParam = searchParams.get("district");
  const startDate = searchParams.get("start_date") || undefined;
  const endDate = searchParams.get("end_date") || undefined;

  const selectedStates = !stateParam ? ["all"] : stateParam === "none" ? [] : stateParam.split(",");
  const selectedDistricts = !districtParam ? ["all"] : districtParam === "none" ? [] : districtParam.split(",");

  // Total DB Size ONLY cares about state
  const { data: dbData, isLoading: dbLoading, isError: dbError } = useTotalDbSize(selectedStates);

  // Enroll Data cares about all filters
  const { data: enrollData, isLoading: enrollLoading, isError: enrollError } = useEnrollData(
    selectedStates,
    selectedDistricts,
    startDate,
    endDate
  );

  // Parse DB Size
  let totalDbSizeValue: React.ReactNode = (
    <div className="mt-1 h-8 w-24 animate-pulse rounded bg-slate-200" />
  );
  if (!dbLoading) {
    if (dbError) {
      totalDbSizeValue = "0";
    } else if (dbData) {
      totalDbSizeValue = dbData.data?.total_db_size?.toLocaleString() || "0";
    }
  }

  // Parse Enroll Data
  const getEnrollValue = (key: keyof NonNullable<typeof enrollData>['data']['cards']) => {
    if (enrollLoading) return <div className="mt-1 h-8 w-24 animate-pulse rounded bg-slate-200" />;
    if (enrollError) return "0";
    if (enrollData?.data?.cards) {
      return enrollData.data.cards[key].toLocaleString();
    }
    return "0";
  };

  // Config-driven approach: Map over the constants but overwrite values dynamically
  const metrics = [...TOP_METRICS];
  if (metrics.length > 0) {
    // 0: Total DB Size
    metrics[0] = { ...metrics[0], value: totalDbSizeValue as any };
    // 1: Total digitization/migration
    metrics[1] = { ...metrics[1], value: getEnrollValue("migration") as any };
    // 2: Total Slip Capture
    metrics[2] = { ...metrics[2], value: getEnrollValue("tp_enroll") as any };
    // 3: Total Live Enrollment
    metrics[3] = { ...metrics[3], value: getEnrollValue("live_enroll") as any };
    // 4: Total Chance Print
    metrics[4] = { ...metrics[4], value: getEnrollValue("lt_enroll") as any };
  }

  return (
    <div className="grid grid-cols-5 gap-3">
      {metrics.map((metric, idx) => {
        let color: "blue" | "emerald" | "violet" | undefined = undefined;
        if (idx === 2) color = "blue"; // Total Slip Capture
        if (idx === 3) color = "emerald"; // Total Live Enrollment
        if (idx === 4) color = "violet"; // Total Chance Print

        return (
          <StatCard
            key={idx}
            label={metric.label}
            value={metric.value}
            indicatorColor={color as any}
            className="h-[90px]"
          />
        );
      })}
    </div>
  );
}
