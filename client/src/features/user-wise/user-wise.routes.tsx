import { Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/shared/utils/lazyImport";
import { ROUTES } from "@/shared/constants/routes";
import { UserCheck } from "lucide-react";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { PermissionGuard } from "@/components/auth/permission-guard";

const UserWisePage = lazyImport(
  () => import("@/pages/UserWisePage"),
  "UserWisePage"
);

export const userWiseRoutes: RouteObject[] = [
  {
    path: ROUTES.userWise,
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <PermissionGuard required="user.wise.view">
          <UserWisePage />
        </PermissionGuard>
      </Suspense>
    ),
    handle: {
      title: "User Wise",
      icon: UserCheck,
      permission: "USER",
    },
  },
];

