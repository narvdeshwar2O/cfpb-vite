import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { recordAuditEvent } from "@/services/adminApi";

interface FilterState {
  state: string[];
  district: string[];
  police_station: string[];
  country: string[];
  start_date: string;
  end_date: string;
}

interface FilterContextType {
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: string | string[]) => void;
  getFilterArray: (key: keyof FilterState) => string[];
  getFilterString: (key: keyof FilterState) => string;
}

const defaultState: FilterState = {
  state: ["all"],
  district: ["all"],
  police_station: ["all"],
  country: ["all"],
  start_date: "",
  end_date: "",
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultState);
  const isInitialMount = useRef(true);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);


  const setFilter = (key: keyof FilterState, value: string | string[]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Debounced audit logging when user updates filters
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      // Record filter apply event
      recordAuditEvent({
        action: "report.filter.apply",
        resourceType: "dashboard",
        resourceId: window.location.pathname,
        outcome: "success",
        details: {
          path: window.location.pathname,
          filters: {
            state: filters.state,
            district: filters.district,
            start_date: filters.start_date || null,
            end_date: filters.end_date || null,
          },
        },
      });
    }, 1200);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [filters]);


  const getFilterArray = (key: keyof FilterState): string[] => {
    const val = filters[key];
    if (Array.isArray(val)) return val;
    return val ? val.split(",") : [];
  };

  const getFilterString = (key: keyof FilterState): string => {
    const val = filters[key];
    if (Array.isArray(val)) return val.join(",");
    return val;
  };

  return (
    <FilterContext.Provider value={{ filters, setFilter, getFilterArray, getFilterString }}>
      {children}
    </FilterContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}
