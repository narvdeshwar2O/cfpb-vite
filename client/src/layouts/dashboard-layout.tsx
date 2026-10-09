import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { FilterProvider } from "@/app/providers/filter-provider";
import { recordAuditEvent } from "@/services/adminApi";
import { getNavLabelByPath } from "@/constants/navigation";

export function DashboardLayout() {
  const location = useLocation();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Only track if pathname changed and is not the audit page itself (avoid recursion)
    if (location.pathname && location.pathname !== lastTrackedPath.current) {
      lastTrackedPath.current = location.pathname;
      if (location.pathname !== "/admin/audit") {
        const pageTitle = getNavLabelByPath(location.pathname);
        recordAuditEvent({
          action: "page.view",
          resourceType: "dashboard",
          resourceId: location.pathname,
          outcome: "success",
          details: {
            pageTitle,
            path: location.pathname,
            search: location.search || null,
          },
        });
      }
    }
  }, [location.pathname, location.search]);

  return (
    <AuthGuard>
      <div className="flex h-screen bg-slate-50 overflow-hidden print:h-auto print:overflow-visible print:bg-white">
        <Sidebar />
        <FilterProvider key={location.pathname}>
          <style>
            {`
              @media print {
                @page { size: A4 landscape; margin: 0; }
                body { zoom: 0.65; -webkit-print-color-adjust: exact; print-color-adjust: exact; padding: 10mm; }
                .break-inside-avoid, canvas, .recharts-wrapper, .card, section, div > svg {
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                }
              }
            `}
          </style>
          <div className="flex flex-col flex-1 overflow-hidden min-w-0 print:overflow-visible">
            <Header />
            <main className="flex-1 overflow-y-auto overflow-x-hidden print:overflow-visible">
              <div className="w-full h-full print:h-auto print:block">
                <Outlet />
              </div>
            </main>
          </div>
        </FilterProvider>
      </div>
    </AuthGuard>
  );
}
