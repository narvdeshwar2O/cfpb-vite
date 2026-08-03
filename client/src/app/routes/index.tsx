import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardLayout, PublicLayout } from "@/layouts";
import { LoginForm } from "@/components/auth/login-form";
import { ROUTES } from "@/shared/constants/routes";
import { ErrorPage } from "@/pages/ErrorPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

// Import route modules
import { dashboardRoutes } from "@/features/dashboard/dashboard.routes";
import { adminRoutes } from "@/features/administration/admin.routes";
import { workflowRoutes } from "@/features/workflow/workflow.routes";
import { tenPrintRoutes } from "@/features/ten-print/ten-print.routes";
import { chancePrintRoutes } from "@/features/chance-print/chance-print.routes";
import { interstateRoutes } from "@/features/interstate/interstate.routes";
import { userWiseRoutes } from "@/features/user-wise/user-wise.routes";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: ROUTES.login,
        element: <LoginForm />,
      },
    ],
  },
  {
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      ...dashboardRoutes,
      ...interstateRoutes,
      ...tenPrintRoutes,
      ...chancePrintRoutes,
      ...userWiseRoutes,
      ...workflowRoutes,
      ...adminRoutes,
      {
        path: "*",
        element: <NotFoundPage />,
      }
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
