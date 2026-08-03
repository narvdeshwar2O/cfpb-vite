import { Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/shared/utils/lazyImport";
import { ROUTES } from "@/shared/constants/routes";
import { UserCheck } from "lucide-react";
import { PageSkeleton } from "@/components/ui/page-skeleton";

const UserWisePage = lazyImport(
  () => import("@/pages/UserWisePage"),
  "UserWisePage"
);

export const userWiseRoutes: RouteObject[] = [
  {
    path: ROUTES.userWise,
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <UserWisePage />
      </Suspense>
    ),
    handle: {
      title: "User Wise",
      icon: UserCheck,
      permission: "USER",
    },
  },
];

