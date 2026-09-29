import { Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/shared/utils/lazyImport";
import { ROUTES } from "@/shared/constants/routes";
import { LayoutDashboard } from "lucide-react";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { PermissionGuard } from "@/components/auth/permission-guard";

const CentralDashboardPage = lazyImport(
  () => import("./dashboard-page"),
  "CentralDashboardPage"
);

export const dashboardRoutes: RouteObject[] = [
  {
    path: ROUTES.dashboard,
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <PermissionGuard required="dashboard.view">
          <CentralDashboardPage />
        </PermissionGuard>
      </Suspense>
    ),
    handle: {
      title: "Dashboard",
      icon: LayoutDashboard,
      permission: "USER",
    },
  },
];

