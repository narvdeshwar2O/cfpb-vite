import { FilterBar } from "@/layouts";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import { useFilters } from "@/app/providers/filter-provider";

export default function ExpertOpinionPage() {
  const { filters } = useFilters();

  const { data: responseData, isLoading, isError } = useQuery({
    queryKey: ["fpi-expert-opinion", filters.state, filters.start_date, filters.end_date],
    queryFn: async () => {
      const payload = {
        state: filters.state.includes("all") ? [] : filters.state,
        start_date: filters.start_date,
        end_date: filters.end_date
      };
      
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://10.1.21.143:3000'}/fpi/lvq-rvq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("Failed to fetch expert opinion data");
      return res.json();
    }
  });

  const tableData = responseData?.data || [];
  const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
    const locationKey = "state";
    const locationLabel = "State/UTs/CLEAs";

    return [
      {
        key: "id",
        label: "Sl. No",
        headerClassName: "text-center align-middle w-20 border-r border-slate-200",
        cellClassName: "text-center align-middle font-medium text-slate-700 border-r border-slate-200",
        render: (_, idx) => idx + 1
      },
      {
        key: locationKey,
        label: locationLabel,
        headerClassName: "text-center align-middle border-r border-slate-200 min-w-32",
        cellClassName: "text-center align-middle border-r border-slate-200 min-w-32",
        render: (row: Record<string, unknown>) => {
          const val = row[locationKey];
          if (!val) return "N/A";
          return <span className="font-medium text-slate-700 uppercase">{String(val)}</span>;
        }
      },
      ...[
      { key: "sup_lv", label: "SUPLVQ" },
      { key: "sup_rv", label: "SUPRVQ" }
      ].map(col => ({
        key: col.key,
        label: col.label,
        headerClassName: "text-center align-middle border-r border-slate-200 min-w-28",
        cellClassName: "text-center align-middle border-r border-slate-200",
        render: (row: Record<string, unknown>) => Number(row[col.key] || 0).toLocaleString()
      }))
    ];
  }, []);

  const headerGroups = useMemo(() => [
    [
      { label: "Sl. No", colSpan: 1, rowSpan: 2 },
      { label: "State/UTs/CLEAs", colSpan: 1, rowSpan: 2 },
      { label: "Expert Opinion Recorded In Cases of", colSpan: 2 }
    ]
  ], []);

  return (
    <div className="flex flex-col h-full">
      <FilterBar />
      <div className="flex-1 overflow-auto">
        <DataTable
          columns={columns}
          data={tableData}
          isLoading={isLoading}
          isError={isError}
          headerGroups={headerGroups}
          showTotals={true}
        />
      </div>
    </div>
  );
}
