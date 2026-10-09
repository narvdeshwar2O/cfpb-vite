/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  fetchMe,
  loginRequest,
  type AuthUser,
} from "@/services/authApi";
import { SUPER_ADMIN_ROLE } from "@/constants/rbac";

const TOKEN_KEY = "authToken";
const USER_KEY = "userData";

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  roles: string[];
  permissions: string[];
  isSuperAdmin: boolean;
  state: string | null;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  login: (username: string, password: string, authType?: "local" | "ldap") => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to parse JWT expiration timestamp
  const getTokenExpMs = (token: string): number | null => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      return typeof payload.exp === "number" ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  };

  const handleSessionExpired = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Proactive timer to automatically log out exactly when token expires (8 Hours)
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || !isAuthenticated) return;

    const expMs = getTokenExpMs(token);
    if (!expMs) return;

    const remainingMs = expMs - Date.now();
    if (remainingMs <= 0) {
      handleSessionExpired();
      return;
    }

    // Set auto-logout timer for the exact remaining duration of the 8H session
    const timer = setTimeout(() => {
      handleSessionExpired();
      window.location.href = "/login?expired=1";
    }, remainingMs);

    return () => clearTimeout(timer);
  }, [isAuthenticated, handleSessionExpired]);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Check if token already expired before even requesting
    const expMs = getTokenExpMs(token);
    if (expMs && Date.now() >= expMs) {
      handleSessionExpired();
      setIsLoading(false);
      return;
    }

    fetchMe(token)
      .then((freshUser) => {
        localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
        setUser(freshUser);
        setIsAuthenticated(true);
      })
      .catch(() => {
        handleSessionExpired();
      })
      .finally(() => setIsLoading(false));
  }, [handleSessionExpired]);

  const login = async (
    username: string,
    password: string,
    authType: "local" | "ldap" = "local"
  ): Promise<boolean> => {
    try {
      const { token, user: authUser } = await loginRequest(username, password, authType);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(authUser));
      setUser(authUser);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    handleSessionExpired();
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const roles = user?.roles ?? [];
  const permissions = user?.permissions ?? [];
  const isSuperAdmin = roles.includes(SUPER_ADMIN_ROLE);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        roles,
        permissions,
        isSuperAdmin,
        state: user?.state ?? null,
        hasRole: (role: string) => roles.includes(role),
        hasPermission: (permission: string) =>
          isSuperAdmin || permissions.includes(permission),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
