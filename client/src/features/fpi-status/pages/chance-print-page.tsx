import { FilterBar } from "@/layouts";
import { DataTable } from "@/components/ui/data-table";

import { useChancePrintData } from "../hooks/use-fpi-status";
import { CHANCE_PRINT_COLS, CHANCE_PRINT_HEADERS } from "../constants/table-columns";

export default function ChancePrintPage() {
  const { data: responseData, isLoading, isError } = useChancePrintData();

  const tableData = responseData?.data || [];

  return (
    <div className="flex flex-col h-full">
      <FilterBar />
      <div className="flex-1 overflow-auto">
        <DataTable
          columns={CHANCE_PRINT_COLS}
          data={tableData}
          isLoading={isLoading}
          isError={isError}
          headerGroups={CHANCE_PRINT_HEADERS}
          showTotals={true}
        />
      </div>
    </div>
  );
}
