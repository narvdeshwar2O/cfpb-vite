"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NAV_LINKS, ADMIN_NAV_LINKS } from "@/constants/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Sidebar() {
  const { pathname } = useLocation();
  const { isSuperAdmin } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-full shrink-0 border-r border-slate-300 bg-card flex flex-col p-3 shadow-xl shadow-slate-900/10 z-10 transition-all duration-300 relative",
        isCollapsed ? "w-20" : "w-72",
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-indigo-600 text-slate-300 rounded-full p-1 border border-slate-600 hover:text-white hover:bg-indigo-700 z-50 shadow-md"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="flex flex-col items-center justify-center mb-8 mt-3 shrink-0 overflow-hidden">
        <div className="w-full px-2 bg-tranparent flex items-center justify-center mb-1">
          <img
            src="/logo.png"
            alt="Logo"
            width={259}
            height={80}
            className="w-full h-auto object-contain transition-all duration-300"
          />
        </div>
        {!isCollapsed && (
          <>
            <h2 className="text-indigo-600 font-bold tracking-wider text-[28px]">
              NAFIS
            </h2>
            <p className="text-indigo-500 text-md font-bold uppercase tracking-widest whitespace-nowrap">
              Dashboard
            </p>
          </>
        )}
      </div>

      <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-2 overflow-x-hidden">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              to={link.href}
              title={isCollapsed ? link.label : undefined}
              className={cn(
                "w-full flex items-center py-3 rounded-xl font-semibold transition-all duration-200 group",
                isCollapsed ? "justify-center px-0" : "gap-3 px-4 text-[18px]",
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
                  : "text-black hover:bg-indigo-600 hover:text-white",
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6 transition-transform duration-200 shrink-0",
                  isActive
                    ? "text-white"
                    : "text-black group-hover:text-white group-hover:scale-110",
                )}
              />
              {!isCollapsed && <span className="truncate">{link.label}</span>}
            </Link>
          );
        })}

        {isSuperAdmin && (
          <div className="mt-4 flex flex-col gap-1.5">
            {!isCollapsed && (
              <h3 className="px-4 mb-2 text-sm font-semibold tracking-wide text-slate-500">
                Administration
              </h3>
            )}
            {/* Divider for collapsed state so icons don't bleed into main nav visually */}
            {isCollapsed && <div className="h-px w-8 bg-slate-200 mx-auto my-2"></div>}
            
            {ADMIN_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  title={isCollapsed ? link.label : undefined}
                  className={cn(
                    "w-full flex items-center py-3 rounded-xl font-semibold transition-all duration-200 group",
                    isCollapsed ? "justify-center px-0" : "gap-3 px-4 text-[18px]",
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
                      : "text-black hover:bg-indigo-600 hover:text-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-6 h-6 transition-transform duration-200 shrink-0",
                      isActive
                        ? "text-white"
                        : "text-black group-hover:text-white group-hover:scale-110",
                    )}
                  />
                  {!isCollapsed && <span className="truncate">{link.label}</span>}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </aside>
  );
}
