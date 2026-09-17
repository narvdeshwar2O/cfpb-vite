import { FilterBar } from "@/layouts";
import { DataTable } from "@/components/ui/data-table";

import { usePropertyData } from "../hooks/use-fpi-status";

import { PROPERTY_COLS, PROPERTY_HEADERS } from "../constants/table-columns";

export default function PropertyOffencesPage() {
  const { data: responseData, isLoading, isError } = usePropertyData();

  const tableData = responseData?.data || [];

  return (
    <div className="flex flex-col h-full">
      <FilterBar />
      <div className="flex-1 overflow-auto">
        <DataTable
          columns={PROPERTY_COLS}
          data={tableData}
          isLoading={isLoading}
          isError={isError}
          headerGroups={PROPERTY_HEADERS}
          showTotals={true}
        />
      </div>
    </div>
  );
}
