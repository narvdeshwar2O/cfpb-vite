import { FilterBar } from "@/layouts";
import { useFilters } from "@/app/providers/filter-provider";
import { useInterstateStatus } from "@/features/interstate/hooks/use-interstate";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import type { InterstateStatusItem } from "@/features/interstate/types/interstate.types";

const columns: ColumnDef<InterstateStatusItem>[] = [
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
  { key: "tp_intra_hit", label: "Ten print HIT (Intra State)", cellClassName: "text-center align-middle border-r border-slate-200", render: (row) => row.tp_intra_hit?.toLocaleString() || 0 },
  { key: "tp_inter_hit", label: "Ten print HIT (Inter State)", cellClassName: "text-center align-middle border-r border-slate-200", render: (row) => row.tp_inter_hit?.toLocaleString() || 0 },
  { key: "lt_intra_hit", label: "Chance Print HIT (Intra State)", cellClassName: "text-center align-middle border-r border-slate-200", render: (row) => row.lt_intra_hit?.toLocaleString() || 0 },
  { key: "lt_inter_hit", label: "Chance Print HIT (Inter State)", headerClassName: "text-center align-middle", cellClassName: "text-center align-middle", render: (row) => row.lt_inter_hit?.toLocaleString() || 0 },
];

export function InterstatePage() {
  const { getFilterArray, getFilterString } = useFilters();
  const stateParam = getFilterArray("state");
  const districtParam = getFilterArray("district");
  const startDate = getFilterString("start_date") || undefined;
  const endDate = getFilterString("end_date") || undefined;

  const { data, isLoading, isError } = useInterstateStatus(
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
