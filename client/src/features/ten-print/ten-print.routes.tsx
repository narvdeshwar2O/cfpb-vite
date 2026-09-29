import { Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/shared/utils/lazyImport";
import { ROUTES } from "@/shared/constants/routes";
import { Fingerprint } from "lucide-react";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { PermissionGuard } from "@/components/auth/permission-guard";

const TenPrintPage = lazyImport(
  () => import("./ten-print-page"),
  "TenPrintPage"
);

export const tenPrintRoutes: RouteObject[] = [
  {
    path: ROUTES.tenPrint,
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <PermissionGuard required="ten.print.view">
          <TenPrintPage />
        </PermissionGuard>
      </Suspense>
    ),
    handle: {
      title: "Ten Print",
      icon: Fingerprint,
      permission: "USER",
    },
  },
];

