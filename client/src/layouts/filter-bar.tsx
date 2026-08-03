"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Filter, Calendar } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  MultiSelect,
  type MultiSelectOption,
} from "@/components/ui/multi-select";
import { useStateDistrictMaster } from "@/shared/hooks/use-master";
import { useStateScope } from "@/hooks/useStateScope";
import { useFilters } from "@/app/providers/filter-provider";

export const FilterBar = React.memo(function FilterBar() {
  const { pathname } = useLocation();
  const { isScoped, scopedState } = useStateScope();
  const { getFilterArray, getFilterString, setFilter } = useFilters();
  const { data: masterData } = useStateDistrictMaster();

  const showUserIdFilter = pathname?.includes("user-wise");

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const selectedStates = getFilterArray("state");
  const effectiveStates = isScoped && scopedState ? [scopedState] : selectedStates;

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
      effectiveStates.length === 0 || effectiveStates.includes("all");
    const districtsToShow = new Set<string>();

    if (isAllStatesSelected) {
      Object.values(dataMap).forEach((districts) => {
        districts.forEach((d) => districtsToShow.add(d));
      });
    } else {
      effectiveStates.forEach((state) => {
        const districts = dataMap[state.toUpperCase()] || dataMap[state];
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

  const handleStateChange = (val: string[]) => {
    if (val.length === 0) setFilter("state", []);
    else setFilter("state", val);
  };

  const handleDistrictChange = (val: string[]) => {
    if (val.length === 0) setFilter("district", []);
    else setFilter("district", val);
  };

  return (
    <div className="flex items-center overflow-x-auto gap-3 bg-white border-b border-slate-200 w-full p-3 min-w-0 min-h-18.25">
      <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm uppercase tracking-wider shrink-0 mr-1">
        <Filter className="size-4" />
        Filters
      </div>

      <div className="flex items-center gap-3 shrink-0 z-50">
        {!isScoped && (
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
            value={getFilterString("start_date") || ""}
            onChange={(e) => setFilter("start_date", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 relative">
          <label className="text-slate-600 font-medium text-sm">To</label>
          <Input
            type="date"
            className="w-37.5 bg-white shadow-sm text-slate-600"
            value={getFilterString("end_date") || ""}
            onChange={(e) => setFilter("end_date", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
});
