/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterBar } from "@/layouts";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { useMemo } from "react";

export default function ChancePrintPage() {  // Dummy data for now
  const tableData = [
    { state: "Delhi", district: "New Delhi" }
  ];
  const isLoading = false;
  const isError = false;
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

      { key: "enrolled", label: "Total no. of Chance prints enrolled" },
      { key: "traced_same", label: "With state NFN" },
      { key: "traced_other", label: "With other state NFN" },
      { key: "untraced", label: "Total no. of Chance prints Untraced" },
      { key: "pending", label: "Total no. of chance prints pending for verification" }

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
      { label: "Sl. No", colSpan: 1, rowSpan: 2 },
      { label: "State/UTs/CLEAs", colSpan: 1, rowSpan: 2 },
      { label: "Total no. of Chance prints enrolled", colSpan: 1, rowSpan: 2 },
      { label: "Total no. of Chance Prints Traced", colSpan: 2 },
      { label: "Total no. of Chance prints Untraced", colSpan: 1, rowSpan: 2 },
      { label: "Total no. of chance prints pending for verification", colSpan: 1, rowSpan: 2 }
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
        />
      </div>
    </div>
  );
}
