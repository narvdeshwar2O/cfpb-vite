import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn, formatIndianNumber } from "@/lib/utils"
import { TrendingUp } from "lucide-react"
import { useState } from "react"

import { type IndicatorColor, statCardColorStyles as colorStyles } from "./stat-card-colors"

interface StatCardProps {
  label: string
  value: string | number | React.ReactNode
  className?: string
  indicatorColor?: IndicatorColor
}

export function StatCard({ label, value, className, indicatorColor }: StatCardProps) {
  const [showActual, setShowActual] = useState(false)
  const color = indicatorColor ? colorStyles[indicatorColor] : null
  
  let displayValue = value;
  let isClickable = false;

  if (typeof value === "number") {
    displayValue = showActual ? value.toLocaleString('en-IN') : formatIndianNumber(value);
    isClickable = true;
  } else if (typeof value === "string") {
    const numValue = Number(value.replace(/,/g, ''));
    if (!isNaN(numValue) && value.trim() !== "") {
       displayValue = showActual ? numValue.toLocaleString('en-IN') : formatIndianNumber(numValue);
       isClickable = true;
    }
  }

  return (
    <Card 
      onClick={() => isClickable && setShowActual(!showActual)}
      className={cn(
        "bg-white border-slate-200 overflow-hidden relative group", 
        color ? `border-l-4 ${color.border}` : "",
        isClickable ? "cursor-pointer select-none" : "",
        className
      )}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <TrendingUp className={cn("w-16 h-16", color ? color.icon : "text-slate-400")} />
      </div>
      <CardHeader className="p-5 pb-2 relative z-10">
        <CardTitle className="text-slate-500 text-sm font-medium tracking-wide truncate" title={label}>
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0 relative z-10">
        <div className={cn("text-3xl font-bold tracking-tight", color ? color.text : "text-slate-800")}>{displayValue}</div>
      </CardContent>
    </Card>
  )
}
