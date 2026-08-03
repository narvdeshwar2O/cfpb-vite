"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon, BarChart3 as BarChartIcon } from "lucide-react";
import { usePieChart } from "../hooks/use-pie-chart";

interface PieChartProps {
  id: string;
  title: string;
  data: Array<{ name: string; value: number; fill?: string }>;
}

export function PieChart({ id, title, data }: PieChartProps) {
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  usePieChart(id, data, chartType);

  return (
    <Card className="bg-white border-slate-200 col-span-1 min-h-[500px]">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-slate-700 text-sm font-semibold tracking-wide">
          {chartType === "pie" ? (
            <PieChartIcon className="size-4 text-indigo-500" />
          ) : (
            <BarChartIcon className="size-4 text-indigo-500" />
          )}
          {title}
        </CardTitle>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value as "pie" | "bar")}
          className="text-xs border border-slate-200 rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500 text-slate-600 bg-slate-50"
        >
          <option value="pie">Pie Chart</option>
          <option value="bar">Bar Chart</option>
        </select>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-0 px-2 pb-2">
        <div id={id} className="w-full min-h-[450px]"></div>
      </CardContent>
    </Card>
  );
}

