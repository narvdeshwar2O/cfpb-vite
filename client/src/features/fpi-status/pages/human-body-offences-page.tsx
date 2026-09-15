/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterBar } from "@/layouts";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import { useFilters } from "@/app/providers/filter-provider";

export default function HumanBodyOffencesPage() {
  const { filters } = useFilters();
  
  const { data: responseData, isLoading, isError } = useQuery({
    queryKey: ["fpi-human-body", filters.state, filters.start_date, filters.end_date],
    queryFn: async () => {
      const payload = {
        state: filters.state.includes("all") ? [] : filters.state,
        start_date: filters.start_date,
        end_date: filters.end_date
      };
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://10.1.21.143:3000'}/fpi/human`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("Failed to fetch human body offences data");
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
        { key: "murder", label: "Murder Sec. 302 IPC/ 103 (1) & (2) BNS" },
        { key: "culpable_homicide", label: "Culpable Homicide Sec. 304 IPC/ 105 BNS" },
        { key: "death_negligence", label: "Causing death by Negligence Sec 304-A IPC/ 106 BNS" },
        { key: "dowry_death", label: "Dowry Deaths Sec 304B IPC/ 80 BNS" },
        { key: "abedment_suicide", label: "Abetment of suicide Sec 305, 306 IPC/ 107, 108 BNS" },
        { key: "attempt_murder", label: "Attempt to Murder & Culpable homicide Sec 307 &Sec 308 IPC/ 109, 110 BNS" },
        { key: "griveous_hurt", label: "Grievous Hurt Sec 324, 325,326, 332, 333 & 353 IPC/ 117 (2,3,4), 118 (1,2), 121(1,2) r/w, 132 BNS" },
        { key: "acid_attack", label: "Acid attack Sec 326A,326B IPC/ 124 (1&2) BNS" },
        { key: "assault_women", label: "Assault on Women Sec 354, 354 A,B,C,D IPC/ 74, 75, 76, 77, 78 BNS" },
        { key: "kidnapping", label: "Kidnapping & Abduction Sec 363, 363A, 364, 364A, 365, 366 A,B & 367, 368 IPC/ 137 To 140 (1,2,3,4), 141, 142 BNS" },
        { key: "human_trafficking", label: "Human trafficking Sec 370, 370A, 372, 373 IPC/ 98, 99 BNS" },
        { key: "rape", label: "Rape Sec 376 IPC/ 64, 65, 66, 67, 68, 69, 70, 71 r/w, 72(1) BNS" }
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
    { label: "Sl. No", colSpan: 1, rowSpan: 2 },
    { label: "State/UTs/CLEAs", colSpan: 1, rowSpan: 2 },
    { label: "IPC/BNS - Offences against/affecting Human Body", colSpan: 12 }
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