import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

interface SplitStatCardProps {
  stats: {
    label: string;
    value: string | number;
  }[];
  className?: string;
}

export function SplitStatCard({ stats, className }: SplitStatCardProps) {
  if (stats.length !== 2) return null;

  return (
    <Card
      className={cn(
        "bg-white border-slate-200 p-0 flex relative overflow-hidden group",
        className,
      )}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity bg-indigo-500 pointer-events-none" />
      {stats.map((stat, idx) => (
        <CardContent
          key={idx}
          className={cn(
            "flex-1 p-5 flex flex-col justify-center",
            idx === 0 ? "border-r border-slate-100" : "",
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="size-4 text-slate-400" />
            <div className="text-slate-500 text-xs font-semibold tracking-wide uppercase">
              {stat.label}
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800 tracking-tight">
            {stat.value}
          </div>
        </CardContent>
      ))}
    </Card>
  );
}
