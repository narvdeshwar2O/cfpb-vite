import { TopMetricsRow } from "./components/top-metrics-row";
import { MiddleMetricsRow } from "./components/middle-metrics-row";
import { BottomChartsRow } from "./components/bottom-charts-row";

import { FilterBar } from "@/layouts";

export function CentralDashboardPage() {
  return (
    <div className="flex flex-col h-full min-w-0">
      <FilterBar />
      <div className="flex flex-col gap-3 flex-1 p-3 min-w-0">
      {/* Top Metrics Row */}
      <TopMetricsRow />

      {/* Middle Metrics Row */}
      <MiddleMetricsRow />

      {/* Bottom Section */}
      <BottomChartsRow />
      </div>
    </div>
  );
}
