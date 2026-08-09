import { FilterBar } from "@/layouts";
import { useFilters } from "@/app/providers/filter-provider";
import { useChancePrintStatus } from "@/features/chance-print/hooks/use-chance-print";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import type { ChancePrintStatusItem } from "@/features/chance-print/types/chance-print.types";
import { useMemo } from "react";

export function ChancePrintPage() {
  const { getFilterArray, getFilterString, setFilter } = useFilters();
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

  const columns = useMemo<ColumnDef<ChancePrintStatusItem>[]>(() => {
    const isStateSelected = stateParam.length > 0 && !stateParam.includes("all");
    const isDistrictSelected = districtParam.length > 0 && !districtParam.includes("all");
    
    let locationKey: "state" | "district" | "police_station" = "state";
    let locationLabel = "State/UTs/CLEAs";
    
    if (isDistrictSelected) {
      locationKey = "police_station";
      locationLabel = "Police Station";
    } else if (isStateSelected) {
      locationKey = "district";
      locationLabel = "District Name";
    }

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
        headerClassName: "text-center align-middle border-r border-slate-200",
        cellClassName: "text-center align-middle border-r border-slate-200",
        render: (row) => {
          const val = row[locationKey];
          if (!val) return "N/A";
          
          if (locationKey === "state") {
            return (
              <span 
                className="font-medium text-indigo-600 uppercase cursor-pointer hover:underline"
                onClick={() => setFilter("state", [val])}
              >
                {val}
              </span>
            );
          } else if (locationKey === "district") {
            return (
              <span 
                className="font-medium text-indigo-600 uppercase cursor-pointer hover:underline"
                onClick={() => setFilter("district", [val])}
              >
                {val}
              </span>
            );
          }
          
          return <span className="font-medium text-slate-700 uppercase">{val}</span>;
        }
      },
      { key: "total_chance_print_cases", label: "Total Chance print Cases", render: (row) => row.total_chance_print_cases?.toLocaleString() || 0 },
      { key: "total_chance_prints", label: "Total Number of Chance prints", render: (row) => row.total_chance_prints?.toLocaleString() || 0 },
      { key: "hit", label: "Total Hit", render: (row) => row.hit?.toLocaleString() || 0 },
      { key: "nohit", label: "Total No-Hit", headerClassName: "text-center align-middle", cellClassName: "text-center align-middle", render: (row) => row.nohit?.toLocaleString() || 0 },
    ];
  }, [stateParam, districtParam, setFilter]);

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
