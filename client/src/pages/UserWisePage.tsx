import { useMemo } from "react";
import { USER_WISE_COLUMNS } from "@/constants/table-columns";
import { FilterBar } from "@/layouts";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { useFilters } from "@/app/providers/filter-provider";
import { useUserWiseStatus } from "@/features/user-wise/hooks/use-user-wise";
import { useStateScope } from "@/hooks/useStateScope";

export function UserWisePage() {
  const { getFilterArray, getFilterString, setFilter } = useFilters();
  const { isScoped } = useStateScope();
  
  const selectedState = getFilterArray("state");
  const selectedDistrict = getFilterArray("district");
  const selectedPS = getFilterArray("police_station");
  const startDate = getFilterString("start_date");
  const endDate = getFilterString("end_date");

  const { data: userWiseResponse, isLoading, isError } = useUserWiseStatus(
    selectedState,
    selectedDistrict,
    selectedPS,
    startDate,
    endDate
  );

  const isStateSelected = isScoped || (selectedState.length === 1 && selectedState[0] !== "all");

  const columns = useMemo(() => {
    // Determine the dynamic column: State vs District
    let locationLabel = "State/UTs/CLEAs";
    let locationKey = "state";

    if (isStateSelected) {
      locationLabel = "District Name";
      locationKey = "districts";
    }

    return USER_WISE_COLUMNS.map((col, idx) => {
      let key = col.key === "slNo" ? "id" : col.key;
      let label = col.label;

      if (key === "state" || key === "districts" || key === "policeStation") {
        if (key !== "state") return null;
        key = locationKey;
        label = locationLabel;
      }

      return {
        key,
        label,
        headerClassName: `border-r border-slate-200 text-center align-middle ${idx === 0 ? "w-20" : ""}`,
        cellClassName: () => {
          let classes = "text-center align-middle border-r border-slate-200";
          if (key === "id") classes += " font-medium text-slate-700";
          if (idx === USER_WISE_COLUMNS.length - 1) classes = "text-center align-middle";
          return classes;
        },
        render: (row: Record<string, unknown>, rowIdx: number) => {
          if (key === "id") return rowIdx + 1;
          const val = row[key];
          
          if (key === locationKey && val) {
            if (locationKey === "state") {
              return (
                <span 
                  className="font-medium text-indigo-600 cursor-pointer hover:underline uppercase"
                  onClick={() => setFilter("state", [val as string])}
                >
                  {val as string}
                </span>
              );
            } else if (locationKey === "districts") {
              // Police station data not available for this route, so stop drilldown here
              return <span className="font-medium text-slate-700 uppercase">{val as string}</span>;
            }
          }
          
          return typeof val === 'string' ? val.toUpperCase() : (val as string);
        }
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).filter(Boolean) as ColumnDef<any>[];
  }, [isStateSelected, setFilter]);

  const tableData = useMemo(() => {
    if (!userWiseResponse?.data) return [];
    
    return userWiseResponse.data.map((item, idx) => ({
      id: idx + 1,
      state: item.state,
      districts: item.district,
      policeStation: item.police_station,
      users: item.unique_user_count || 0,
      tpEnrolment: item.tp_enroll || 0,
      tpVerified: item.tp_verified || 0,
      tpDeleted: item.tp_delete || 0,
      cpEnrolled: item.cp_enroll || 0,
      cpVerified: item.cp_verified || 0,
      cpDeleted: item.cp_delete || 0,
    }));
  }, [userWiseResponse]);

  return (
    <div className="flex flex-col h-full">
      <FilterBar />
      <div className="flex-1 overflow-auto">
        <DataTable 
          columns={columns} 
          data={tableData} 
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  );
}
