import { useAuth } from "@/context/AuthContext";

export function useStateScope() {
  const { user, isSuperAdmin } = useAuth();
  
  // State users are scoped strictly to their state
  const scopedState = user?.state ? user.state : null;
  const isScoped = Boolean(scopedState) && !isSuperAdmin;

  return { isScoped, scopedState };
}
