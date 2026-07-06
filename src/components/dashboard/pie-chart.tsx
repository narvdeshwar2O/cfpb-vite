"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart as PieChartIcon, BarChart3 as BarChartIcon } from "lucide-react"

interface PieChartProps {
  id: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
}

export function PieChart({ id, title, data }: PieChartProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any>(null);
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const am4core = require("@amcharts/amcharts4/core");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const am4charts = require("@amcharts/amcharts4/charts");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const am4themes_animated = require("@amcharts/amcharts4/themes/animated").default;

    am4core.useTheme(am4themes_animated);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let chart: any;

    if (chartType === "pie") {
      chart = am4core.create(id, am4charts.PieChart3D);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      // Enhance 3D effect
      chart.depth = 45;
      chart.angle = 35;

      // Legend configuration
      chart.legend = new am4charts.Legend();
      chart.legend.position = "bottom";
      chart.legend.labels.template.fontSize = 10;
      chart.legend.valueLabels.template.fontSize = 10;
      chart.legend.itemContainers.template.paddingTop = 2;
      chart.legend.itemContainers.template.paddingBottom = 2;

      chart.data = data;

      const series = chart.series.push(new am4charts.PieSeries3D());
      series.dataFields.value = "value";
      series.dataFields.category = "name";
      series.slices.template.propertyFields.fill = "fill";

      // Disable labels and ticks to give the pie chart maximum space
      series.labels.template.disabled = true;
      series.ticks.template.disabled = true;

      // Optional: add a tooltip since labels are disabled
      series.slices.template.tooltipText = "{category}: {value.percent.formatNumber('#.0')}% ({value})";

      // Increase hover pop-out effect
      let hoverState = series.slices.template.states.getKey("hover");
      if (!hoverState) {
          hoverState = series.slices.template.states.create("hover");
      }
      hoverState.properties.shiftRadius = 0.10; // Pull out 15% from center (default is usually smaller or 0)
      hoverState.properties.scale = 1.0; // Slightly scale up the hovered slice
    } else {
      chart = am4core.create(id, am4charts.XYChart3D);
      chart.hiddenState.properties.opacity = 0;
      
      chart.data = data;
      
      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "name";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.renderer.labels.template.rotation = -45;
      categoryAxis.renderer.labels.template.fontSize = 10;
      
      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.labels.template.fontSize = 10;
      
      const series = chart.series.push(new am4charts.ColumnSeries3D());
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "name";
      series.columns.template.propertyFields.fill = "fill";
      series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    }

    chartRef.current = chart;

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, [id, data, chartType]);

  return (
    <Card className="bg-white border-slate-200 col-span-1 min-h-[500px]">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-slate-700 text-sm font-semibold tracking-wide">
          {chartType === 'pie' ? <PieChartIcon className="w-4 h-4 text-indigo-500" /> : <BarChartIcon className="w-4 h-4 text-indigo-500" />}
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
  )
}
