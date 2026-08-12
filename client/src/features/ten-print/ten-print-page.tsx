import { FilterBar } from "@/layouts";
import { useFilters } from "@/app/providers/filter-provider";
import { useTenPrintStatus } from "@/features/ten-print/hooks/use-ten-print";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import type { TenPrintStatusItem } from "@/features/ten-print/types/ten-print.types";
import { useMemo } from "react";
import { useStateScope } from "@/hooks/useStateScope";

export function TenPrintPage() {
  const { getFilterArray, getFilterString, setFilter } = useFilters();
  const { isScoped } = useStateScope();
  
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

  const columns = useMemo<ColumnDef<TenPrintStatusItem>[]>(() => {
    const isStateSelected = isScoped || (stateParam.length > 0 && !stateParam.includes("all"));
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
      { key: "tp_enroll", label: "Total TP enrolment", cellClassName: "text-center align-middle border-r border-slate-200", render: (row) => row.tp_enroll?.toLocaleString() || 0 },
      { key: "tp_verified", label: "Total TP verified", cellClassName: "text-center align-middle border-r border-slate-200", render: (row) => row.tp_verified?.toLocaleString() || 0 },
      { key: "tp_delete", label: "Total TP Deleted", cellClassName: "text-center align-middle border-r border-slate-200", render: (row) => row.tp_delete?.toLocaleString() || 0 },
      { key: "cp_enroll", label: "Total CP enrolled", cellClassName: "text-center align-middle border-r border-slate-200", render: (row) => row.cp_enroll?.toLocaleString() || 0 },
      { key: "cp_verified", label: "Total CP verified", cellClassName: "text-center align-middle border-r border-slate-200", render: (row) => row.cp_verified?.toLocaleString() || 0 },
      { key: "cp_delete", label: "Total CP Deleted", headerClassName: "text-center align-middle", cellClassName: "text-center align-middle", render: (row) => row.cp_delete?.toLocaleString() || 0 },
    ];
  }, [stateParam, districtParam, setFilter, isScoped]);

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
