/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterBar } from "@/layouts";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFilters } from "@/app/providers/filter-provider";

export default function TenPrintsEnrolledPage() {
  const { filters } = useFilters();

  const { data: responseData, isLoading, isError } = useQuery({
    queryKey: ["fpi-ten-print", filters.state, filters.start_date, filters.end_date],
    queryFn: async () => {
      const payload = {
        state: filters.state.includes("all") ? [] : filters.state,
        start_date: filters.start_date,
        end_date: filters.end_date
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://10.1.21.143:3000'}/fpi/tenprint-enrolled`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to fetch ten-print enrolled data");
      return res.json();
    }
  });

  const tableData = responseData?.data || [];
  const columns = useMemo<ColumnDef<any>[]>(() => {
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
        render: (row: any) => {
          const val = row[locationKey];
          if (!val) return "N/A";
          return <span className="font-medium text-slate-700 uppercase">{val}</span>;
        }
      },
      ...[

      { key: "tp_enroll", label: "Total no. of Ten Prints enrolled" },
      { key: "tp_intra_tptp_hit", label: "With same State NFN" },
      { key: "tp_inter_tptp_hit", label: "With other State NFN" },
      { key: "tp_intra_tppul_hit", label: "With Same state ID" },
      { key: "tp_inter_tppul_hit", label: "With other State ID" },
      { key: "tp_no_hit", label: "Total no. of TP NOHIT" },


      ].map(col => ({
        key: col.key,
        label: col.label,
        headerClassName: "text-center align-middle border-r border-slate-200 min-w-28",
        cellClassName: "text-center align-middle border-r border-slate-200",
        render: (row: Record<string, any>) => Number(row[col.key] || 0).toLocaleString()
      }))
    ];
  }, []);

  const headerGroups = useMemo(() => [
    [
      { label: "Sl. No", colSpan: 1, rowSpan: 4 },
      { label: "State/UTs/CLEAs", colSpan: 1, rowSpan: 4 },
      { label: "Total no. of TP (Arrested and Record) Enrolled Related Information", colSpan: 7 }
    ],
    [
      { label: "Total no. of Ten Prints enrolled", colSpan: 1, rowSpan: 3 },
      { label: "Total no. of TP HIT", colSpan: 4 },
      { label: "Total no. of TP NOHIT", colSpan: 1, rowSpan: 3 },

    ],
    [
      { label: "With TP to TP", colSpan: 2 },
      { label: "With Unsolved Latent (UL)", colSpan: 2 }
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
