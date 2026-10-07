import { Card } from "@/components/ui/card";
import { cn, formatIndianNumber } from "@/lib/utils";
import { Activity } from "lucide-react";
import { useState } from "react";
import { type IndicatorColor, statCardColorStyles as colorStyles } from "./stat-card-colors";

export interface DualSubSection {
  title: string;
  hit: string | number;
  noHit: string | number;
}

interface DualSubSectionCardProps {
  leftSection: DualSubSection;
  rightSection: DualSubSection;
  className?: string;
  indicatorColor?: IndicatorColor;
}

export function DualSubSectionCard({
  leftSection,
  rightSection,
  className,
  indicatorColor,
}: DualSubSectionCardProps) {
  const [showActual, setShowActual] = useState(false);
  const color = indicatorColor ? colorStyles[indicatorColor] : null;

  const renderValue = (val: string | number) => {
    if (typeof val === "number") {
      return showActual ? val.toLocaleString("en-IN") : formatIndianNumber(val);
    }
    const numValue = Number(String(val).replace(/,/g, ""));
    if (!isNaN(numValue) && String(val).trim() !== "") {
      return showActual ? numValue.toLocaleString("en-IN") : formatIndianNumber(numValue);
    }
    return val;
  };

  const renderSubBlock = (section: DualSubSection, isRightSide = false) => (
    <div className={cn("flex-1 flex flex-col min-w-0 h-full", isRightSide ? "bg-slate-50/60" : "")}>
      {/* Sub-header with horizontal divider touching left to right */}
      <div className="flex items-center justify-center gap-1.5 py-1.5 px-2 border-b border-slate-200">
        <Activity className={cn("size-3.5 shrink-0", color ? color.icon : "text-slate-400")} />
        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight truncate">
          {section.title}
        </span>
      </div>

      {/* 2-column values with centered text and full-height divider */}
      <div className="grid grid-cols-2 flex-1 items-stretch">
        <div className="flex flex-col items-center justify-center p-2 text-center min-w-0">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight truncate w-full">
            Total Hit
          </div>
          <div className={cn("text-base font-extrabold tracking-tight truncate w-full mt-0.5", color ? color.text : "text-slate-800")}>
            {renderValue(section.hit)}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-2 text-center min-w-0 border-l border-slate-200">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight truncate w-full">
            Total No Hit
          </div>
          <div className="text-base font-extrabold text-slate-800 tracking-tight truncate w-full mt-0.5">
            {renderValue(section.noHit)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card
      onClick={() => setShowActual(!showActual)}
      className={cn(
        "bg-white border-slate-200 p-0 flex relative overflow-hidden group cursor-pointer select-none",
        color ? `border-l-4 ${color.border}` : "",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none",
          color ? color.bg : "bg-indigo-500"
        )}
      />
      {renderSubBlock(leftSection, false)}
      <div className="w-px bg-slate-200 self-stretch shrink-0" />
      {renderSubBlock(rightSection, true)}
    </Card>
  );
}
