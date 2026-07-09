"use client";

import { Input } from "@/components/ui/input";
import { Filter, Calendar } from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  MultiSelect,
  type MultiSelectOption,
} from "@/components/ui/multi-select";
import { useStateDistrictMaster } from "@/hooks/use-dashboard";

export function FilterBar() {
  const { pathname } = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  const showUserIdFilter = pathname?.includes("user-wise");

  // Helper to parse comma-separated string back to array
  const getInitialValues = (key: string) => {
    const val = searchParams.get(key);
    if (val === "none") return [];
    return val ? val.split(",") : ["all"];
  };

  const { data: masterData } = useStateDistrictMaster();
  const selectedStates = getInitialValues("state");

  const stateOptions: MultiSelectOption[] = [{ label: "All", value: "all" }];
  const districtOptions: MultiSelectOption[] = [{ label: "All", value: "all" }];

  if (masterData?.data) {
    const dataMap = masterData.data;
    Object.keys(dataMap)
      .sort()
      .forEach((state) => {
        stateOptions.push({ label: state, value: state });
      });

    const isAllStatesSelected =
      selectedStates.length === 0 || selectedStates.includes("all");
    const districtsToShow = new Set<string>();

    if (isAllStatesSelected) {
      Object.values(dataMap).forEach((districts) => {
        districts.forEach((d) => districtsToShow.add(d));
      });
    } else {
      selectedStates.forEach((state) => {
        const districts = dataMap[state];
        if (districts) {
          districts.forEach((d) => districtsToShow.add(d));
        }
      });
    }

    Array.from(districtsToShow)
      .sort()
      .forEach((d) => {
        districtOptions.push({ label: d, value: d });
      });
  }

  // Update URL helper
  const updateUrlParam = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length > 0) {
      params.set(key, values.join(","));
    } else {
      params.set(key, "none");
    }

    // If state changes, we probably want to clear district selection if the district is no longer valid
    // but the user can easily uncheck it if they want.

    setSearchParams(params);
  };

  // Update URL helper for single strings (dates)
  const updateSingleParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  return (
    <div className="flex items-center flex-wrap gap-3 p-4 bg-slate-50 border-b border-slate-200 w-full">
      <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm uppercase tracking-wider shrink-0 mr-1">
        <Filter className="size-4" />
        Filters
      </div>

      <div className="flex items-center gap-3 shrink-0 z-50">
        <div className="flex items-center gap-2">
          <label className="text-slate-600 font-medium text-sm">State</label>
          <div className="w-64">
            <MultiSelect
              options={stateOptions}
              value={getInitialValues("state")}
              onChange={(val) => updateUrlParam("state", val)}
              placeholder="Select State..."
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-600 font-medium text-sm">District</label>
          <div className="w-64">
            <MultiSelect
              options={districtOptions}
              value={getInitialValues("district")}
              onChange={(val) => updateUrlParam("district", val)}
              placeholder="Select District..."
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-600 font-medium text-sm">Station</label>
          <Input
            className="w-48 bg-white shadow-sm"
            placeholder="Police Station..."
          />
        </div>

        {showUserIdFilter && (
          <div className="flex items-center gap-2">
            <label className="text-slate-600 font-medium text-sm">
              User ID
            </label>
            <Input
              className="w-48 bg-white shadow-sm"
              placeholder="User ID..."
            />
          </div>
        )}
      </div>

      <div className="h-8 w-px bg-slate-200 hidden xl:block mx-1"></div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 relative">
          <label className="text-slate-600 font-medium text-sm flex items-center gap-1.5">
            <Calendar className="size-4 text-slate-400" />
            From
          </label>
          <Input
            type="date" 
            className="w-37.5 bg-white shadow-sm text-slate-600"
            value={searchParams.get("start_date") || ""}
            onChange={(e) => updateSingleParam("start_date", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 relative">
          <label className="text-slate-600 font-medium text-sm">To</label>
          <Input
            type="date"
            className="w-37.5 bg-white shadow-sm text-slate-600"
            value={searchParams.get("end_date") || ""}
            onChange={(e) => updateSingleParam("end_date", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
