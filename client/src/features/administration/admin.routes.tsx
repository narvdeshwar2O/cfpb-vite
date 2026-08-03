/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { Users, Shield, Key } from "lucide-react";
import { PageSkeleton } from "@/components/ui/page-skeleton";

// Admin pages are currently default exported in src/pages/admin
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const AdminRoles = lazy(() => import("@/pages/admin/AdminRoles"));
const AdminPermissions = lazy(() => import("@/pages/admin/AdminPermissions"));

export const adminRoutes: RouteObject[] = [
  {
    path: ROUTES.adminUsers,
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <AdminUsers />
      </Suspense>
    ),
    handle: {
      title: "Users",
      icon: Users,
      permission: "ADMIN",
    },
  },
  {
    path: ROUTES.adminRoles,
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <AdminRoles />
      </Suspense>
    ),
    handle: {
      title: "Roles",
      icon: Shield,
      permission: "ADMIN",
    },
  },
  {
    path: ROUTES.adminPermissions,
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <AdminPermissions />
      </Suspense>
    ),
    handle: {
      title: "Permissions",
      icon: Key,
      permission: "ADMIN",
    },
  },
];
