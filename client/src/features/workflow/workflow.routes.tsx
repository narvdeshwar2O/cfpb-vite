import { Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { lazyImport } from "@/shared/utils/lazyImport";
import { ROUTES } from "@/shared/constants/routes";
import { Activity } from "lucide-react";
import { PageSkeleton } from "@/components/ui/page-skeleton";

// The WorkflowLivePage acts as the unified workflow page.
// In Phase 4, we will update it to read the `:type` param.
const WorkflowPage = lazyImport(
  () => import("./workflow-page"),
  "WorkflowPage"
);

export const workflowRoutes: RouteObject[] = [
  {
    path: ROUTES.workflowLive,
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <WorkflowPage />
      </Suspense>
    ),
    handle: {
      title: "Live Enrolment",
      icon: Activity,
      permission: "USER",
    },
  },
  {
    path: ROUTES.workflowSlip,
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <WorkflowPage />
      </Suspense>
    ),
    handle: {
      title: "Slip Capture",
      icon: Activity, // Use same icon or different if you prefer
      permission: "USER",
    },
  },
];
