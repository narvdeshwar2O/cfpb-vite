import { Outlet, useLocation } from "react-router-dom";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { FilterProvider } from "@/app/providers/filter-provider";

export function DashboardLayout() {
  const location = useLocation();

  return (
    <AuthGuard>
      <FilterProvider key={location.pathname}>
        <div className="flex h-screen bg-slate-50 overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden min-w-0">
            <Header />
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="w-full h-full">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </FilterProvider>
    </AuthGuard>
  );
}
