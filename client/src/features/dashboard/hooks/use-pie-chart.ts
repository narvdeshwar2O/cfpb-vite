import { useLayoutEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export function usePieChart(id: string, data: Array<{ name: string; value: number; fill?: string; percentage?: number }>, chartType: "pie" | "bar") {
  const chartRef = useRef<am4charts.Chart | null>(null);

  useLayoutEffect(() => {
    am4core.useTheme(am4themes_animated);
    let chart: am4charts.PieChart3D | am4charts.XYChart3D;

    if (chartType === "pie") {
      chart = am4core.create(id, am4charts.PieChart3D);
      chart.hiddenState.properties.opacity = 0;
      chart.depth = 45;
      chart.angle = 35;
      
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
      series.labels.template.disabled = true;
      series.ticks.template.disabled = true;
      
      // If we provided a percentage, use it, otherwise fallback to AMChart's calculation
      series.slices.template.adapter.add("tooltipText", (_text, target) => {
        const dataContext = target.dataItem?.dataContext as { percentage?: number };
        if (dataContext && dataContext.percentage !== undefined) {
          return "{category}: {percentage}% ({value})";
        }
        return "{category}: {value.percent.formatNumber('#.0')}% ({value})";
      });

      let hoverState = series.slices.template.states.getKey("hover");
      if (!hoverState) {
        hoverState = series.slices.template.states.create("hover");
      }
      hoverState.properties.shiftRadius = 0.1;
      hoverState.properties.scale = 1.0;
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
      
      series.columns.template.adapter.add("tooltipText", (_text, target) => {
        const dataContext = target.dataItem?.dataContext as { percentage?: number };
        if (dataContext && dataContext.percentage !== undefined) {
          return "{categoryX}: [bold]{percentage}% ({valueY})[/]";
        }
        return "{categoryX}: [bold]{valueY}[/]";
      });
    }

    chartRef.current = chart;

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, [id, data, chartType]);
}
