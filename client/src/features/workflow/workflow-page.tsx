import { useLocation } from "react-router-dom";
import { FilterBar } from "@/layouts";
import { useFilters } from "@/app/providers/filter-provider";
import { useWorkflowStatus } from "@/features/workflow/hooks/use-workflow";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import type { WorkflowStatusItem } from "@/features/workflow/types/workflow.types";
import { ROUTES } from "@/shared/constants/routes";

const columns: ColumnDef<WorkflowStatusItem>[] = [
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
  { key: "arrested", label: "Arrested", render: (row) => row.arrested?.toLocaleString() || 0 },
  { key: "convicted", label: "Convicted", render: (row) => row.convicted?.toLocaleString() || 0 },
  { key: "externee", label: "Externee", render: (row) => row.externee?.toLocaleString() || 0 },
  { key: "deportee", label: "Deportee", render: (row) => row.deportee?.toLocaleString() || 0 },
  { key: "suspect", label: "Suspect", render: (row) => row.suspect?.toLocaleString() || 0 },
  { key: "absconder", label: "Absconder", render: (row) => row.absconder?.toLocaleString() || 0 },
  { key: "deadbody", label: "Deadbody", render: (row) => row.deadbody?.toLocaleString() || 0 },
  { key: "UIFP", label: "UIFP", headerClassName: "text-center align-middle", cellClassName: "text-center align-middle", render: (row) => row.UIFP?.toLocaleString() || 0 },
];

export function WorkflowPage() {
  const location = useLocation();
  const type = location.pathname === ROUTES.workflowSlip ? "slip-capture" : "live-enrollment";

  const { getFilterArray, getFilterString } = useFilters();
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
