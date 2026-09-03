import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarAdminProps {
  pathname: string;
  isCollapsed: boolean;
  adminLinks: { label: string; href: string; icon: React.ElementType; preload?: () => void }[];
}

export function SidebarAdmin({ pathname, isCollapsed, adminLinks }: SidebarAdminProps) {
  return (
    <div className="mt-4 flex flex-col gap-1.5">
      {!isCollapsed && (
        <h3 className="px-4 mb-2 text-sm font-semibold tracking-wide text-slate-500">
          Administration
        </h3>
      )}
      {isCollapsed && <div className="h-px w-8 bg-slate-200 mx-auto my-2"></div>}

      {adminLinks.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            to={link.href}
            onMouseEnter={() => link.preload?.()}
            title={isCollapsed ? link.label : undefined}
            className={cn(
              "w-full flex items-center py-3 rounded-xl font-semibold transition-all duration-200 group",
              isCollapsed ? "justify-center px-0" : "gap-3 px-4 text-[18px]",
              isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
                : "text-black hover:bg-indigo-600 hover:text-white"
            )}
          >
            <Icon
              className={cn(
                "w-6 h-6 transition-transform duration-200 shrink-0",
                isActive ? "text-white" : "text-black group-hover:text-white group-hover:scale-110"
              )}
            />
            {!isCollapsed && <span className="truncate">{link.label}</span>}
          </Link>
        );
      })}
    </div>
  );
}
