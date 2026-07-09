import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp } from "lucide-react"

interface StatCardProps {
  label: string
  value: string | number
  className?: string
}

export function StatCard({ label, value, className }: StatCardProps) {
  return (
    <Card className={cn("bg-white border-slate-200 overflow-hidden relative group", className)}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <TrendingUp className="w-16 h-16 text-indigo-500" />
      </div>
      <CardHeader className="p-5 pb-2 relative z-10">
        <CardTitle className="text-slate-500 text-sm font-medium tracking-wide">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0 relative z-10">
        <div className="text-3xl font-bold text-slate-800 tracking-tight">{value}</div>
      </CardContent>
    </Card>
  )
}
