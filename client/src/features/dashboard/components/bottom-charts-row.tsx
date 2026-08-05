"use client";

import { PieChart } from "./pie-chart";
import { useEnrollData } from "@/features/dashboard/hooks/use-dashboard";
import { useFilters } from "@/app/providers/filter-provider";

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

const assignColors = (data: { name: string; value: number; percentage?: number }[]) => {
  return data.map((item, idx) => ({
    ...item,
    fill: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
  }));
};

export function BottomChartsRow() {
  const { getFilterArray, getFilterString } = useFilters();
  const startDate = getFilterString("start_date") || undefined;
  const endDate = getFilterString("end_date") || undefined;

  const selectedStates = getFilterArray("state");
  const selectedDistricts = getFilterArray("district");

  const { data: enrollData } = useEnrollData(
    selectedStates,
    selectedDistricts,
    startDate,
    endDate
  );

  // If loading or error, we just render empty or skeleton charts
  type ChartData = { name: string; value: number; fill?: string; percentage?: number };
  let mesaData: ChartData[] = [];
  let slipData: ChartData[] = [];
  let stateData: ChartData[] = [];
  let districtData: ChartData[] = [];

  if (enrollData?.data) {
    const mesa = enrollData.data.mesa;
    if (mesa) {
      mesaData = assignColors([
        { name: "Arrested", value: mesa.arresty_received_tp, percentage: mesa.arresty_received_tp_percentage },
        { name: "Convicted", value: mesa.convicted_received_tp, percentage: mesa.convicted_received_tp_percentage },
        { name: "Externeee", value: mesa.externee_received_tp, percentage: mesa.externee_received_tp_percentage },
        { name: "Deportee", value: mesa.deportee_received_tp, percentage: mesa.deportee_received_tp_percentage },
        { name: "UDB", value: mesa.deadbody_received_tp, percentage: mesa.deadbody_received_tp_percentage },
        { name: "Suspect", value: mesa.suspect_received_tp, percentage: mesa.suspect_received_tp_percentage },
        { name: "UIFP", value: mesa.uifp_received_tp, percentage: mesa.uifp_received_tp_percentage },
        { name: "Absconder", value: mesa.absconder_received_tp, percentage: mesa.absconder_received_tp_percentage },
      ]);
    }

    const slip = enrollData.data.slip;
    if (slip) {
      slipData = assignColors([
        { name: "Arrested", value: slip.arresty_received_tp, percentage: slip.arresty_received_tp_percentage },
        { name: "Convicted", value: slip.convicted_received_tp, percentage: slip.convicted_received_tp_percentage },
        { name: "Externeee", value: slip.externee_received_tp, percentage: slip.externee_received_tp_percentage },
        { name: "Deportee", value: slip.deportee_received_tp, percentage: slip.deportee_received_tp_percentage },
        { name: "UDB", value: slip.deadbody_received_tp, percentage: slip.deadbody_received_tp_percentage },
        { name: "Suspect", value: slip.suspect_received_tp, percentage: slip.suspect_received_tp_percentage },
        { name: "UIFP", value: slip.uifp_received_tp, percentage: slip.uifp_received_tp_percentage },
        { name: "Absconder", value: slip.absconder_received_tp, percentage: slip.absconder_received_tp_percentage },
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
