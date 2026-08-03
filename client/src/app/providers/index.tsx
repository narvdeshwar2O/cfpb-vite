import type { ReactNode } from "react";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/context/AuthContext";
import { FilterProvider } from "./filter-provider";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <FilterProvider>
          {children}
        </FilterProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
