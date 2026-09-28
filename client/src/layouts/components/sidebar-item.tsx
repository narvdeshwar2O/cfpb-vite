import React from "react";
import { Link } from "react-router-dom";
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
  const isExpanded = link.label === "FPI Status" || expandedMenus[link.label] || isChildActive;

  const itemClasses = cn(
    "w-full flex items-center py-1 rounded-md font-semibold transition-all duration-200 group",
    isCollapsed ? "justify-center px-0" : "gap-3 px-4 text-[14px]",
    isActive
      ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
      : "text-black hover:bg-indigo-600 hover:text-white"
  );

  const iconClasses = cn(
    "w-6 h-6 transition-transform duration-200 shrink-0",
    isActive ? "text-white" : "text-black group-hover:text-white group-hover:scale-110"
  );

  const content = (
    <>
      <Icon className={iconClasses} />
      {!isCollapsed && <span className="truncate">{link.label}</span>}
    </>
  );

  return (
    <div className="flex flex-col gap-1 w-full">
      {hasChildren ? (
        <>
          <button
            onClick={() => {
              if (isCollapsed) setIsCollapsed(false);
              if (link.label !== "FPI Status") {
                setExpandedMenus((prev) => ({ ...prev, [link.label]: !isExpanded }));
              }
            }}
            title={isCollapsed ? link.label : undefined}
            className={itemClasses}
          >
            {content}
          </button>
          {isExpanded && !isCollapsed && (
            <div className="flex flex-col gap-1 ml-4 border-l-2 border-indigo-100 pl-3 mt-1">
              {link.children!.map((child) => (
                <Link
                  key={child.href}
                  to={child.href}
                  onMouseEnter={() => child.preload?.()}
                  className={cn(
                    "w-full flex items-center py-1 px-3 rounded-lg text-sm font-medium transition-all duration-200",
                    pathname === child.href
                      ? "bg-indigo-50 text-indigo-700 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
                  )}
                >
                  <span className="truncate">{child.label}</span>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          to={link.href!}
          onMouseEnter={() => link.preload?.()}
          title={isCollapsed ? link.label : undefined}
          className={itemClasses}
        >
          {content}
        </Link>
      )}
    </div>
  );
}
