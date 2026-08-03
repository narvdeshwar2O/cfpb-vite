import { StatCard } from "./stat-card";
import { useTopMetrics } from "../hooks/use-top-metrics";

export function TopMetricsRow() {
  const { metrics } = useTopMetrics();

  return (
    <div className="grid grid-cols-5 gap-3">
      {metrics.map((metric, idx) => (
        <StatCard
          key={idx}
          label={metric.label}
          value={
            metric.value === "loading" ? (
              <div className="mt-1 h-8 w-24 animate-pulse rounded bg-slate-200" />
            ) : (
              metric.value
            )
          }
          indicatorColor={metric.color}
          className="h-22.5"
        />
      ))}
    </div>
  );
}
