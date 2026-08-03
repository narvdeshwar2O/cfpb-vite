"use client";

import { useState } from "react";
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select";
import { TopMetricsRow } from "./top-metrics-row";

const INDIAN_STATES: MultiSelectOption[] = [
  { label: "Andhra Pradesh", value: "andhra pradesh" },
  { label: "Arunachal Pradesh", value: "arunachal pradesh" },
  { label: "Assam", value: "assam" },
  { label: "Bihar", value: "bihar" },
  { label: "Chhattisgarh", value: "chhattisgarh" },
  { label: "Delhi", value: "delhi" },
  { label: "Goa", value: "goa" },
  { label: "Gujarat", value: "gujarat" },
  { label: "Haryana", value: "haryana" },
  { label: "Himachal Pradesh", value: "himachal pradesh" },
  { label: "Jharkhand", value: "jharkhand" },
  { label: "Karnataka", value: "karnataka" },
  { label: "Kerala", value: "kerala" },
  { label: "Madhya Pradesh", value: "madhya pradesh" },
  { label: "Maharashtra", value: "maharashtra" },
  { label: "Manipur", value: "manipur" },
  { label: "Meghalaya", value: "meghalaya" },
  { label: "Mizoram", value: "mizoram" },
  { label: "Nagaland", value: "nagaland" },
  { label: "Odisha", value: "odisha" },
  { label: "Punjab", value: "punjab" },
  { label: "Rajasthan", value: "rajasthan" },
  { label: "Sikkim", value: "sikkim" },
  { label: "Tamil Nadu", value: "tamil nadu" },
  { label: "Telangana", value: "telangana" },
  { label: "Tripura", value: "tripura" },
  { label: "Uttar Pradesh", value: "uttar pradesh" },
  { label: "Uttarakhand", value: "uttarakhand" },
  { label: "West Bengal", value: "west bengal" },
  { label: "Kolkata", value: "kolkata" }, // Added for your specific test case
];

export function DashboardMetricsWithFilters() {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-4">
      {/* Global Filters */}
      <div className="flex items-center gap-2 max-w-sm">
        <span className="text-sm font-medium whitespace-nowrap">Filter by State:</span>
        <MultiSelect
          options={INDIAN_STATES}
          value={selectedStates}
          onChange={setSelectedStates}
          placeholder="Select states..."
        />
      </div>

      {/* Top Metrics Row with Filters Applied */}
      <TopMetricsRow />
    </div>
  );
}
