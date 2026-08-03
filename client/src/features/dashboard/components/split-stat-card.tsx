import { Card, CardContent } from "@/components/ui/card";
import { cn, formatIndianNumber } from "@/lib/utils";
import { Activity } from "lucide-react";
import { useState } from "react";
import { type IndicatorColor, statCardColorStyles as colorStyles } from "./stat-card-colors"

interface SplitStatCardProps {
  stats: {
    label: string;
    value: string | number | React.ReactNode;
  }[];
  className?: string;
  indicatorColor?: IndicatorColor;
}

export function SplitStatCard({
  stats,
  className,
  indicatorColor,
}: SplitStatCardProps) {
  const [showActual, setShowActual] = useState(false);
  if (stats.length !== 2) return null;
  const color = indicatorColor ? colorStyles[indicatorColor] : null;

  return (
    <Card
      onClick={() => setShowActual(!showActual)}
      className={cn(
        "bg-white border-slate-200 p-0 flex relative overflow-hidden group cursor-pointer select-none",
        color ? `border-l-4 ${color.border}` : "",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none",
          color ? color.bg : "bg-indigo-500",
        )}
      />
      {stats.map((stat, idx) => {
        let displayValue = stat.value;
        if (typeof stat.value === "number") {
          displayValue = showActual
            ? stat.value.toLocaleString("en-IN")
            : formatIndianNumber(stat.value);
        } else if (typeof stat.value === "string") {
          const numValue = Number(stat.value.replace(/,/g, ""));
          if (!isNaN(numValue) && stat.value.trim() !== "") {
            displayValue = showActual
              ? numValue.toLocaleString("en-IN")
              : formatIndianNumber(numValue);
          }
        }

        return (
          <CardContent
            key={idx}
            className={cn(
              "flex-1 p-5 flex flex-col justify-center relative z-10",
              idx === 0 ? "border-r border-slate-100" : "",
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity
                className={cn("size-4", color ? color.icon : "text-slate-400")}
              />
              <div className="text-slate-500 text-xs font-semibold tracking-wide uppercase">
                {stat.label}
              </div>
            </div>
            <div
              className={cn(
                "text-2xl font-bold tracking-tight",
                color ? color.text : "text-slate-800",
              )}
            >
              {displayValue}
            </div>
          </CardContent>
        );
      })}
    </Card>
  );
}
