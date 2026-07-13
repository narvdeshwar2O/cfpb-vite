import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { QueryProvider } from "./components/providers/query-provider";
import { AuthGuard } from "./components/auth/auth-guard";
import { Sidebar } from "./components/layout/sidebar";
import { Header } from "./components/layout/header";
import { FilterBar } from "./components/layout/filter-bar";
import { CentralDashboardPage } from "./features/central-dashboard/central-dashboard-page";
import { ChancePrintPage } from "./features/chance-print/chance-print-page";
import { TenPrintPage } from "./features/ten-print/ten-print-page";
import { LoginForm } from "./components/auth/login-form";
import { InterstatePage } from "./pages/InterstatePage";
import { UserWisePage } from "./pages/UserWisePage";
import { WorkflowLivePage } from "./pages/WorkflowLivePage";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRoles from "./pages/admin/AdminRoles";
import AdminPermissions from "./pages/admin/AdminPermissions";
import { Toaster } from "@/components/ui/sonner";

function DashboardLayout() {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <FilterBar />
          <main className="flex-1 overflow-y-auto p-3">
            <div className="w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={
              <div className="min-h-screen flex items-center justify-center bg-white p-4">
                <LoginForm />
              </div>
            } />

            <Route element={<DashboardLayout />}>
              <Route path="/" element={<CentralDashboardPage />} />
              <Route path="/interstate" element={<InterstatePage />} />
              <Route path="/ten-print" element={<TenPrintPage />} />
              <Route path="/chance-print" element={<ChancePrintPage />} />
              <Route path="/user-wise" element={<UserWisePage />} />
              <Route path="/workflow-live" element={<WorkflowLivePage />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/roles" element={<AdminRoles />} />
              <Route path="/admin/permissions" element={<AdminPermissions />} />
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryProvider>
  );
}
