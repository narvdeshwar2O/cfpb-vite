import { FilterBar } from "@/layouts";
import { DataTable } from "@/components/ui/data-table";

import { useForeignersTpData } from "../hooks/use-fpi-status";

import { FOREIGNERS_TP_COLS } from "../constants/table-columns";

export default function ForeignersTpPage() {
  const { data: responseData, isLoading, isError } = useForeignersTpData();

  const tableData = responseData?.data || [];

  return (
    <div className="flex flex-col h-full">
      <FilterBar />
      <div className="flex-1 overflow-auto">
        <DataTable 
          columns={FOREIGNERS_TP_COLS} 
          data={tableData} 
          isLoading={isLoading} 
          isError={isError} 
          showTotals={true}
        />
      </div>
    </div>
  );
}