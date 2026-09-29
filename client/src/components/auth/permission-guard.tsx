import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface PermissionGuardProps {
  required: string;
  children: React.ReactNode;
}

export function PermissionGuard({ required, children }: PermissionGuardProps) {
  const { hasPermission, isSuperAdmin } = useAuth();

  // Super Admins automatically bypass permission checks
  if (!isSuperAdmin && !hasPermission(required)) {
    // If the user doesn't have permission, redirect them to the dashboard
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
