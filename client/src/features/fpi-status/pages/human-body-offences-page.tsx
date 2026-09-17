import { FilterBar } from "@/layouts";
import { DataTable } from "@/components/ui/data-table";

import { useHumanBodyData } from "../hooks/use-fpi-status";

import { HUMAN_BODY_COLS, HUMAN_BODY_HEADERS } from "../constants/table-columns";

export default function HumanBodyOffencesPage() {
  const { data: responseData, isLoading, isError } = useHumanBodyData();

  const tableData = responseData?.data || [];

  return (
    <div className="flex flex-col h-full">
      <FilterBar />
      <div className="flex-1 overflow-auto">
        <DataTable 
          columns={HUMAN_BODY_COLS} 
          data={tableData} 
          isLoading={isLoading} 
          isError={isError} 
          headerGroups={HUMAN_BODY_HEADERS}
          showTotals={true}
        />
      </div>
    </div>
  );
}