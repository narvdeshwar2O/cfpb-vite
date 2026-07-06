import { TopMetricsRow } from "./components/top-metrics-row";
import { MiddleMetricsRow } from "./components/middle-metrics-row";
import { BottomChartsRow } from "./components/bottom-charts-row";

export function CentralDashboardPage() {
  return (
    <div className="flex flex-col gap-3">
      {/* Top Metrics Row */}
      <TopMetricsRow />

      {/* Middle Metrics Row */}
      <MiddleMetricsRow />

      {/* Bottom Section */}
      <BottomChartsRow />
    </div>
  );
}
