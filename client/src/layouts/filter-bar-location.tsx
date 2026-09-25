// import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { useFilters } from "@/app/providers/filter-provider";
import { useFilterOptions } from "./use-filter-options";
import { useStateScope } from "@/hooks/useStateScope";
import { useLocation } from "react-router-dom";
import { useCountryMaster } from "@/shared/hooks/use-master";

export function FilterBarLocation() {
  const { pathname } = useLocation();
  const isFpiRoute = pathname.startsWith("/fpi");
  const { isScoped, scopedState } = useStateScope();
  const { getFilterArray, setFilter } = useFilters();

  // const showUserIdFilter = pathname?.includes("user-wise");
  const selectedStates = getFilterArray("state");
  const selectedDistricts = getFilterArray("district");
  const effectiveStates = isScoped && scopedState ? [scopedState] : selectedStates;

  const { stateOptions, districtOptions /*, psOptions */ } = useFilterOptions(effectiveStates, selectedDistricts);

  const handleStateChange = (val: string[]) => {
    setFilter("state", val.length === 0 ? [] : val);
    setFilter("district", ["all"]);
    setFilter("police_station", ["all"]);
  };

  const handleDistrictChange = (val: string[]) => {
    setFilter("district", val.length === 0 ? [] : val);
    setFilter("police_station", ["all"]);
  };

  /*
  const handlePSChange = (val: string[]) => {
    setFilter("police_station", val.length === 0 ? [] : val);
  };
  */

  const isForeignersRoute = pathname === "/fpi/foreigners";

  const { data: countryMasterData } = useCountryMaster();

  const countryOptions = [
    { label: "All Selected", value: "all" },
    ...(countryMasterData?.data?.map(c => ({ 
      label: c.country, 
      value: c.country.toLowerCase() 
    })) || [])
  ];

  const handleCountryChange = (val: string[]) => {
    setFilter("country", val.length === 0 ? [] : val);
  };

  return (
    <div className="flex items-center gap-3 shrink-0 z-50">
        {!isScoped && !isForeignersRoute && (
          <div className="flex items-center gap-2">
            <label className="text-slate-600 font-medium text-sm">State</label>
            <div className="w-64">
              <MultiSelect
                options={stateOptions}
                value={getFilterArray("state")}
                onChange={handleStateChange}
                placeholder="Select State..."
              />
            </div>
          </div>
        )}
        {isForeignersRoute && (
          <div className="flex items-center gap-2">
            <label className="text-slate-600 font-medium text-sm">Country</label>
            <div className="w-64">
              <MultiSelect
                options={countryOptions}
                value={getFilterArray("country")}
                onChange={handleCountryChange}
                placeholder="Select Country..."
              />
            </div>
          </div>
        )}
      {!isFpiRoute && (
        <div className="flex items-center gap-2">
          <label className="text-slate-600 font-medium text-sm">District</label>
          <div className="w-64">
            <MultiSelect
              options={districtOptions}
              value={getFilterArray("district")}
              onChange={handleDistrictChange}
              placeholder="Select District..."
            />
          </div>
        </div>
      )}
        {/* <div className="flex items-center gap-2">
          <label className="text-slate-600 font-medium text-sm">Station</label>
          <div className="w-64">
            <MultiSelect
              options={psOptions}
              value={getFilterArray("police_station")}
              onChange={handlePSChange}
              placeholder="Select Station..."
            />
          </div>
        </div> */}
        {/* {showUserIdFilter && (
          <div className="flex items-center gap-2">
            <label className="text-slate-600 font-medium text-sm">User ID</label>
            <Input className="w-48 bg-white shadow-sm" placeholder="User ID..." />
          </div>
        )} */}
    </div>
  );
}
