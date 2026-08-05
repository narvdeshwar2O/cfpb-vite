import { FilterBar } from "@/layouts";
import { useFilters } from "@/app/providers/filter-provider";
import { useChancePrintStatus } from "@/features/chance-print/hooks/use-chance-print";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import type { ChancePrintStatusItem } from "@/features/chance-print/types/chance-print.types";

const columns: ColumnDef<ChancePrintStatusItem>[] = [
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
  // The API doesn't seem to return district names, but table columns expect it.
  { key: "districts", label: "District Name", render: () => "All Districts" },
  { key: "total_chance_print_cases", label: "Total Chance print Cases", render: (row) => row.total_chance_print_cases?.toLocaleString() || 0 },
  { key: "total_chance_prints", label: "Total Number of Chance prints", render: (row) => row.total_chance_prints?.toLocaleString() || 0 },
  { key: "hit", label: "Total Hit", render: (row) => row.hit?.toLocaleString() || 0 },
  { key: "nohit", label: "Total No-Hit", headerClassName: "text-center align-middle", cellClassName: "text-center align-middle", render: (row) => row.nohit?.toLocaleString() || 0 },
];

export function ChancePrintPage() {
  const { getFilterArray, getFilterString } = useFilters();
  const stateParam = getFilterArray("state");
  const districtParam = getFilterArray("district");
  const startDate = getFilterString("start_date") || undefined;
  const endDate = getFilterString("end_date") || undefined;

  const { data, isLoading, isError } = useChancePrintStatus(
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
