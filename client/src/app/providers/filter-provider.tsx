import { createContext, useContext, useState, type ReactNode } from "react";

interface FilterState {
  state: string[];
  district: string[];
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
  start_date: "",
  end_date: "",
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultState);

  const setFilter = (key: keyof FilterState, value: string | string[]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

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
