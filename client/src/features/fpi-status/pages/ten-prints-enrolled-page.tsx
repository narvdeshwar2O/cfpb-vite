import { FilterBar } from "@/layouts";
import { DataTable } from "@/components/ui/data-table";
import { useTenPrintsData } from "../hooks/use-fpi-status";

import { TEN_PRINTS_COLS, TEN_PRINTS_HEADERS } from "../constants/table-columns";

export default function TenPrintsEnrolledPage() {
  const { data: responseData, isLoading, isError } = useTenPrintsData();

  const tableData = responseData?.data || [];

  return (
    <div className="flex flex-col h-full">
      <FilterBar />
      <div className="flex-1 overflow-auto">
        <DataTable
          columns={TEN_PRINTS_COLS}
          data={tableData}
          isLoading={isLoading}
          isError={isError}
          headerGroups={TEN_PRINTS_HEADERS}
          showTotals={true}
        />
      </div>
    </div>
  );
}
