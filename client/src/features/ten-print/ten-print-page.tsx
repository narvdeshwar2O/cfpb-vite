import { FilterBar } from "@/layouts";
import { useFilters } from "@/app/providers/filter-provider";
import { useTenPrintStatus } from "@/features/ten-print/hooks/use-ten-print";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import type { TenPrintStatusItem } from "@/features/ten-print/types/ten-print.types";

const columns: ColumnDef<TenPrintStatusItem>[] = [
  { 
    key: "id", 
    label: "Sl. No", 
    headerClassName: "text-center align-middle w-20 border-r border-slate-200",
    cellClassName: "text-center align-middle font-medium text-slate-700 border-r border-slate-200",
    render: (_, idx) => idx + 1 
  },
  { 
    key: "state", 
    label: "State/UTs/CLEAs",
    cellClassName: "text-center align-middle font-medium text-indigo-600 border-r border-slate-200 uppercase",
  },
  { key: "districts", label: "District Name", render: () => "All Districts", cellClassName: "text-center align-middle border-r border-slate-200" },
  { key: "tp_enroll", label: "Total TP enrolment", cellClassName: "text-center align-middle border-r border-slate-200", render: (row) => row.tp_enroll?.toLocaleString() || 0 },
  { key: "tp_verified", label: "Total TP verified", cellClassName: "text-center align-middle border-r border-slate-200", render: (row) => row.tp_verified?.toLocaleString() || 0 },
  { key: "tp_delete", label: "Total TP Deleted", cellClassName: "text-center align-middle border-r border-slate-200", render: (row) => row.tp_delete?.toLocaleString() || 0 },
  { key: "cp_enroll", label: "Total CP enrolled", cellClassName: "text-center align-middle border-r border-slate-200", render: (row) => row.cp_enroll?.toLocaleString() || 0 },
  { key: "cp_verified", label: "Total CP verified", cellClassName: "text-center align-middle border-r border-slate-200", render: (row) => row.cp_verified?.toLocaleString() || 0 },
  { key: "cp_delete", label: "Total CP Deleted", headerClassName: "text-center align-middle", cellClassName: "text-center align-middle", render: (row) => row.cp_delete?.toLocaleString() || 0 },
];

export function TenPrintPage() {
  const { getFilterArray, getFilterString } = useFilters();
  const stateParam = getFilterArray("state");
  const districtParam = getFilterArray("district");
  const startDate = getFilterString("start_date") || undefined;
  const endDate = getFilterString("end_date") || undefined;

  const { data, isLoading, isError } = useTenPrintStatus(
    stateParam,
    districtParam,
    startDate,
    endDate
  );

  const tableData = data?.data || [];

  return (
    <div className="flex flex-col h-full">
      <FilterBar />
      <DataTable 
        columns={columns} 
        data={tableData} 
        isLoading={isLoading} 
        isError={isError} 
      />
    </div>
  );
}
