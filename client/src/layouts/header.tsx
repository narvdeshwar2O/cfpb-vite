import React from "react";
import { LogOut } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { NAV_LINKS } from "@/constants/navigation"
import { useAuth } from "@/context/AuthContext"

export const Header = React.memo(function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  let title = "NAFIS Dashboard";
  let currentIcon = null;

  for (const link of NAV_LINKS) {
    if (link.href === pathname) {
      title = link.label;
      currentIcon = link.icon;
      break;
    }
    if (link.children) {
      const child = link.children.find((c: { href: string; label: string }) => c.href === pathname);
      if (child) {
        title = child.label;
        currentIcon = link.icon; // Use parent icon for children
        break;
      }
    }
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const rawName = user?.fullName || user?.username || "Admin User";
  const userState = user?.state?.trim();

  // If state is present, show state name with user name (e.g. "Admin User (DELHI)")
  const displayName = userState ? `${rawName} (${userState})` : rawName;

  // Role display:
  // When state is not present, role in navbar will be "super_admin" only.
  // When state is present, do not show super_admin role title (state is already attached with user name).
  const roleTitle: string | null = !userState ? "super_admin" : null;

  const initials = rawName.substring(0, 2).toUpperCase();

  return (
    <header className="flex h-18.25 shrink-0 items-center justify-between bg-white border-b border-slate-200 px-6 sticky top-0 z-20 print:hidden">
      <div className="flex items-center gap-3">
        {currentIcon && React.createElement(currentIcon, { className: "w-6 h-6 text-indigo-600" })}
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* User Profile & Logout */}
        <div className="flex items-center gap-3 pl-2">
          <div className="hidden md:flex flex-col text-right justify-center">
            <span className="text-sm font-semibold text-slate-700">{displayName}</span>
            {roleTitle && (
              <span className="text-xs text-slate-500 font-medium">{roleTitle}</span>
            )}
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-inner shadow-indigo-200/50">
            {initials}
          </div>
          <button onClick={handleLogout} className="p-2 ml-1 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
});
