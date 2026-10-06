import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface PermissionGuardProps {
  required?: string;
  superAdminOnly?: boolean;
  children: React.ReactNode;
}

export function PermissionGuard({ required, superAdminOnly, children }: PermissionGuardProps) {
  const { hasPermission, isSuperAdmin } = useAuth();

  if (superAdminOnly && !isSuperAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Super Admins automatically bypass permission checks
  if (required && !isSuperAdmin && !hasPermission(required)) {
    // If the user doesn't have permission, redirect them to the unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
