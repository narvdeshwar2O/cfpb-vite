"use client";

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NAV_LINKS, ADMIN_NAV_LINKS } from "@/constants/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SidebarItem } from "./components/sidebar-item";
import { SidebarAdmin } from "./components/sidebar-admin";

export const Sidebar = React.memo(function Sidebar() {
  const { pathname } = useLocation();
  const { isSuperAdmin } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  return (
    <aside
      className={cn(
        "h-full shrink-0 border-r border-slate-300 bg-card flex flex-col p-3 shadow-xl shadow-slate-900/10 z-10 transition-all duration-300 relative print:hidden",
        isCollapsed ? "w-20" : "w-72"
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
            <h2 className="text-indigo-600 font-bold tracking-wider text-[28px]">NAFIS</h2>
            <p className="text-indigo-500 text-md font-bold uppercase tracking-widest whitespace-nowrap">
              Dashboard
            </p>
          </>
        )}
      </div>

      <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-2 overflow-x-hidden">
        {NAV_LINKS.map((link) => (
          <SidebarItem
            key={link.label}
            link={link}
            pathname={pathname}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            expandedMenus={expandedMenus}
            setExpandedMenus={setExpandedMenus}
          />
        ))}

        {isSuperAdmin && (
          <SidebarAdmin
            pathname={pathname}
            isCollapsed={isCollapsed}
            adminLinks={ADMIN_NAV_LINKS}
          />
        )}
      </nav>

      {/* Developed By Footer */}
      <div className={cn("mt-auto pt-4 flex flex-col items-center justify-center shrink-0 border-t border-slate-200", isCollapsed ? "px-1" : "px-4")}>
        {/* {!isCollapsed && <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Developed by</span>} */}
        <img
          src="/opsvision.webp"
          alt="Opsvision Logo"
          className={cn("h-auto object-contain transition-all duration-300 rounded-md", isCollapsed ? "w-16" : "w-64")}
        />
      </div>
    </aside>
  );
});
