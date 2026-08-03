import { Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/shared/utils/lazyImport";
import { ROUTES } from "@/shared/constants/routes";
import { Search } from "lucide-react";
import { PageSkeleton } from "@/components/ui/page-skeleton";

const ChancePrintPage = lazyImport(
  () => import("./chance-print-page"),
  "ChancePrintPage"
);

export const chancePrintRoutes: RouteObject[] = [
  {
    path: ROUTES.chancePrint,
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <ChancePrintPage />
      </Suspense>
    ),
    handle: {
      title: "Chance Print",
      icon: Search,
      permission: "USER",
    },
  },
];

