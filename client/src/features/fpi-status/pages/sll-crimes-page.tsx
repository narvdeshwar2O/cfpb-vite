/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterBar } from "@/layouts";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { useMemo } from "react";

export default function SllCrimesPage() {  // Dummy data for now
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

      { key: "ndps", label: "NDPS Act" },
      { key: "pocso", label: "POCSO Act" },
      { key: "jj", label: "JJ Act" },
      { key: "it", label: "IT Act" },
      { key: "scst", label: "SC/ST Act" },
      { key: "mcoca", label: "MCOCA/ /Other organized crime" },
      { key: "arms", label: "Arms/ Explosive Acts" },
      { key: "other", label: "Other SLL if any" },
      { key: "uapa", label: "UAPA-1967" },
      { key: "crpc", label: "Cr. PC/ BNSS" }

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
    { label: "SLL Crimes", colSpan: 9 },
    { label: "Cr. PC/ BNSS", colSpan: 1, rowSpan: 2 }
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
