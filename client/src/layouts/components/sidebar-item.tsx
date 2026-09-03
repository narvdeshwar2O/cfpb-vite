import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  link: { label: string; href?: string; icon: React.ElementType; preload?: () => void; children?: { label: string; href: string; preload?: () => void }[] };
  pathname: string;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  expandedMenus: Record<string, boolean>;
  setExpandedMenus: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export function SidebarItem({
  link,
  pathname,
  isCollapsed,
  setIsCollapsed,
  expandedMenus,
  setExpandedMenus,
}: SidebarItemProps) {
  const hasChildren = !!link.children;
  const isChildActive = hasChildren && link.children!.some((c) => pathname === c.href);
  const isActive = (link.href && pathname === link.href) || isChildActive;
  const Icon = link.icon;
  const isExpanded = expandedMenus[link.label] || isChildActive;

  if (hasChildren) {
    return (
      <div className="flex flex-col gap-1 w-full">
        <button
          onClick={() => {
            if (isCollapsed) setIsCollapsed(false);
            setExpandedMenus((prev) => ({ ...prev, [link.label]: !isExpanded }));
          }}
          title={isCollapsed ? link.label : undefined}
          className={cn(
            "w-full flex items-center py-3 rounded-xl font-semibold transition-all duration-200 group justify-between",
            isCollapsed ? "px-0 justify-center" : "px-4 text-[18px]",
            isActive
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
              : "text-black hover:bg-indigo-600 hover:text-white"
          )}
        >
          <div className={cn("flex items-center gap-3", isCollapsed && "justify-center w-full")}>
            <Icon
              className={cn(
                "w-6 h-6 transition-transform duration-200 shrink-0",
                isActive ? "text-white" : "text-black group-hover:text-white group-hover:scale-110"
              )}
            />
            {!isCollapsed && <span className="truncate">{link.label}</span>}
          </div>
          {!isCollapsed && (
            <ChevronRight
              size={18}
              className={cn("transition-transform duration-200", isExpanded && "rotate-90")}
            />
          )}
        </button>
        {isExpanded && !isCollapsed && (
          <div className="flex flex-col gap-1 ml-4 border-l-2 border-indigo-100 pl-3 mt-1">
            {link.children!.map((child) => {
              const isSubActive = pathname === child.href;
              return (
                <Link
                  key={child.href}
                  to={child.href}
                  onMouseEnter={() => child.preload?.()}
                  className={cn(
                    "w-full flex items-center py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200",
                    isSubActive
                      ? "bg-indigo-50 text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
                  )}
                >
                  <span className="truncate">{child.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <Link
        to={link.href!}
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
    </div>
  );
}
