import { FilterBar } from "@/layouts";
import { DataTable } from "@/components/ui/data-table";
import { useSllCrimesData } from "../hooks/use-fpi-status";
import { SLL_CRIMES_COLS, SLL_CRIMES_HEADERS } from "../constants/table-columns";

export default function SllCrimesPage() {
  const { data: responseData, isLoading, isError } = useSllCrimesData();

  const tableData = responseData?.data || [];

  return (
    <div className="flex flex-col h-full">
      <FilterBar />
      <div className="flex-1 overflow-auto">
        <DataTable
          columns={SLL_CRIMES_COLS}
          data={tableData}
          isLoading={isLoading}
          isError={isError}
          headerGroups={SLL_CRIMES_HEADERS}
          showTotals={true}
        />
      </div>
    </div>
  );
}
