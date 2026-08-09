import type { ReactNode } from "react";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/context/AuthContext";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryProvider>
  );
}
