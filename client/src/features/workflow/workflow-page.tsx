import { useLocation } from "react-router-dom";
import { FilterBar } from "@/layouts";
import { useFilters } from "@/app/providers/filter-provider";
import { useWorkflowStatus } from "@/features/workflow/hooks/use-workflow";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import type { WorkflowStatusItem } from "@/features/workflow/types/workflow.types";
import { ROUTES } from "@/shared/constants/routes";
import { useMemo } from "react";
import { useStateScope } from "@/hooks/useStateScope";

export function WorkflowPage() {
  const location = useLocation();
  const type = location.pathname === ROUTES.workflowSlip ? "slip-capture" : "live-enrollment";

  const { getFilterArray, getFilterString, setFilter } = useFilters();
  const { isScoped } = useStateScope();
  
  const stateParam = getFilterArray("state");
  const districtParam = getFilterArray("district");
  const startDate = getFilterString("start_date") || undefined;
  const endDate = getFilterString("end_date") || undefined;

  const { data, isLoading, isError } = useWorkflowStatus(
    type,
    stateParam,
    districtParam,
    startDate,
    endDate
  );

  const tableData = data?.data || [];

  const columns = useMemo<ColumnDef<WorkflowStatusItem>[]>(() => {
    const isStateSelected = isScoped || (stateParam.length > 0 && !stateParam.includes("all"));
    // const isDistrictSelected = districtParam.length > 0 && !districtParam.includes("all");
    
    let locationKey: "state" | "district" | "police_station" = "state";
    let locationLabel = "State/UTs/CLEAs";
    
    if (isStateSelected) {
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
            // Police station data not available for this route, so stop drilldown here
            return <span className="font-medium text-slate-700 uppercase">{val}</span>;
          }
          
          return <span className="font-medium text-slate-700 uppercase">{val}</span>;
        }
      },
      { key: "arrested", label: "Arrested", render: (row) => row.arrested?.toLocaleString() || 0 },
      { key: "convicted", label: "Convicted", render: (row) => row.convicted?.toLocaleString() || 0 },
      { key: "externee", label: "Externee", render: (row) => row.externee?.toLocaleString() || 0 },
      { key: "deportee", label: "Deportee", render: (row) => row.deportee?.toLocaleString() || 0 },
      { key: "suspect", label: "Suspect", render: (row) => row.suspect?.toLocaleString() || 0 },
      { key: "absconder", label: "Absconder", render: (row) => row.absconder?.toLocaleString() || 0 },
      { key: "deadbody", label: "Deadbody", render: (row) => row.deadbody?.toLocaleString() || 0 },
      { key: "UIFP", label: "UIFP", headerClassName: "text-center align-middle", cellClassName: "text-center align-middle", render: (row) => row.UIFP?.toLocaleString() || 0 },
    ];
  }, [stateParam, setFilter, isScoped]);

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
