import { FilterBar } from "@/layouts";
import { DataTable } from "@/components/ui/data-table";

import { useExpertOpinionData } from "../hooks/use-fpi-status";

import { EXPERT_OPINION_COLS, EXPERT_OPINION_HEADERS } from "../constants/table-columns";

export default function ExpertOpinionPage() {
  const { data: responseData, isLoading, isError } = useExpertOpinionData();

  const tableData = responseData?.data || [];

  return (
    <div className="flex flex-col h-full">
      <FilterBar />
      <div className="flex-1 overflow-auto">
        <DataTable
          columns={EXPERT_OPINION_COLS}
          data={tableData}
          isLoading={isLoading}
          isError={isError}
          headerGroups={EXPERT_OPINION_HEADERS}
          showTotals={true}
        />
      </div>
    </div>
  );
}
