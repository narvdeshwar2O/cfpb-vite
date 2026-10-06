/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { Users, Shield, Key } from "lucide-react";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { PermissionGuard } from "@/components/auth/permission-guard";

// Admin pages are currently default exported in src/pages/admin
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const AdminRoles = lazy(() => import("@/pages/admin/AdminRoles"));
const AdminPermissions = lazy(() => import("@/pages/admin/AdminPermissions"));
const AdminLdap = lazy(() => import("@/pages/admin/AdminLdap"));

export const adminRoutes: RouteObject[] = [
  {
    path: ROUTES.adminUsers,
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <PermissionGuard required="users.manage">
          <AdminUsers />
        </PermissionGuard>
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
        <PermissionGuard required="roles.manage">
          <AdminRoles />
        </PermissionGuard>
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
        <PermissionGuard required="permissions.manage">
          <AdminPermissions />
        </PermissionGuard>
      </Suspense>
    ),
    handle: {
      title: "Permissions",
      icon: Key,
      permission: "ADMIN",
    },
  },
  {
    path: ROUTES.adminLdap,
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <PermissionGuard superAdminOnly>
          <AdminLdap />
        </PermissionGuard>
      </Suspense>
    ),
    handle: {
      title: "LDAP / Active Directory",
      permission: "SUPER_ADMIN",
    },
  },
];
