"use client";

import React from "react";
import { Filter } from "lucide-react";
import { useLocation } from "react-router-dom";
import { FilterBarLocation } from "./filter-bar-location";
import { FilterBarDate } from "./filter-bar-date";

export const FilterBar = React.memo(function FilterBar() {
  const { pathname } = useLocation();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="flex items-center overflow-x-auto gap-3 bg-white border-b border-slate-200 w-full p-3 min-w-0 min-h-18.25">
      <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm uppercase tracking-wider shrink-0 mr-1">
        <Filter className="size-4" />
        Filters
      </div>

      <FilterBarLocation />

      <div className="h-8 w-px bg-slate-200 hidden xl:block mx-1"></div>

      <FilterBarDate />
    </div>
  );
});
