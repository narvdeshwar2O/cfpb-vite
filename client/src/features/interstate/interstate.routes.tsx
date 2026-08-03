import { Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/shared/utils/lazyImport";
import { ROUTES } from "@/shared/constants/routes";
import { Map } from "lucide-react";
import { PageSkeleton } from "@/components/ui/page-skeleton";

const InterstatePage = lazyImport(
  () => import("@/pages/InterstatePage"),
  "InterstatePage"
);

export const interstateRoutes: RouteObject[] = [
  {
    path: ROUTES.interstate,
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <InterstatePage />
      </Suspense>
    ),
    handle: {
      title: "Interstate",
      icon: Map,
      permission: "USER",
    },
  },
];

