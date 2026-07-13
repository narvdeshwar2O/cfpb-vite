"use client";

import { PieChart } from "@/features/reports/shared/components/pie-chart";
import { useEnrollData } from "@/hooks/use-dashboard";
import { useSearchParams } from "react-router-dom";

const CATEGORY_COLORS = [
  '#60a5fa', // blue-400
  '#34d399', // emerald-400
  '#fbbf24', // amber-400
  '#a78bfa', // violet-400
  '#f472b6', // pink-400
  '#2dd4bf', // teal-400
  '#fb923c', // orange-400
  '#38bdf8', // sky-400
  '#818cf8', // indigo-400
  '#94a3b8', // slate-400
];

const assignColors = (data: { name: string; value: number }[]) => {
  return data.map((item, idx) => ({
    ...item,
    fill: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
  }));
};

export function BottomChartsRow() {
  const [searchParams] = useSearchParams();
  const stateParam = searchParams.get("state");
  const districtParam = searchParams.get("district");
  const startDate = searchParams.get("start_date") || undefined;
  const endDate = searchParams.get("end_date") || undefined;

  const selectedStates = !stateParam ? ["all"] : stateParam === "none" ? [] : stateParam.split(",");
  const selectedDistricts = !districtParam ? ["all"] : districtParam === "none" ? [] : districtParam.split(",");

  const { data: enrollData } = useEnrollData(
    selectedStates,
    selectedDistricts,
    startDate,
    endDate
  );

  // If loading or error, we just render empty or skeleton charts
  type ChartData = { name: string; value: number; fill?: string };
  let mesaData: ChartData[] = [];
  let slipData: ChartData[] = [];
  let stateData: ChartData[] = [];
  let districtData: ChartData[] = [];

  if (enrollData?.data) {
    const mesa = enrollData.data.mesa;
    if (mesa) {
      mesaData = assignColors([
        { name: "Arrested", value: mesa.arresty_received_tp },
        { name: "Convicted", value: mesa.convicted_received_tp },
        { name: "Externeee", value: mesa.externee_received_tp },
        { name: "Deportee", value: mesa.deportee_received_tp },
        { name: "UDB", value: mesa.deadbody_received_tp },
        { name: "Suspect", value: mesa.suspect_received_tp },
        { name: "UIFP", value: mesa.uifp_received_tp },
        { name: "Absconder", value: mesa.absconder_received_tp },
      ]);
    }

    const slip = enrollData.data.slip;
    if (slip) {
      slipData = assignColors([
        { name: "Arrested", value: slip.arresty_received_tp },
        { name: "Convicted", value: slip.convicted_received_tp },
        { name: "Externeee", value: slip.externee_received_tp },
        { name: "Deportee", value: slip.deportee_received_tp },
        { name: "UDB", value: slip.deadbody_received_tp },
        { name: "Suspect", value: slip.suspect_received_tp },
        { name: "UIFP", value: slip.uifp_received_tp },
        { name: "Absconder", value: slip.absconder_received_tp },
      ]);
    }

    if (enrollData.data.top_5_states) {
      stateData = assignColors(
        enrollData.data.top_5_states.map((s) => ({
          name: s.state.toUpperCase(),
          value: s.tp_hit,
        }))
      );
    }

    if (enrollData.data.top_5_districts) {
      districtData = assignColors(
        enrollData.data.top_5_districts.map((d) => ({
          name: d.district.toUpperCase(),
          value: d.tp_hit,
        }))
      );
    }
  }

  // If loading, show empty but don't crash
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
      <PieChart id="mesaChartLive" title="Categories (Live Enrollment)" data={mesaData} />
      <PieChart id="slipChartLive" title="Categories (SLIP)" data={slipData} />
      <PieChart id="stateChartLive" title="Top 5 States (HIT)" data={stateData} />
      <PieChart id="districtChartLive" title="Top 5 Districts (NO-HIT)" data={districtData} />
    </div>
  );
}
