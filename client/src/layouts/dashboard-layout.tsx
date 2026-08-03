import { Outlet } from "react-router-dom";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function DashboardLayout() {
  return (
    <AuthGuard>
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
    </AuthGuard>
  );
}
