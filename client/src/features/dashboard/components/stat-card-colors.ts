export type IndicatorColor = "blue" | "emerald" | "indigo" | "amber" | "rose" | "violet";

export const statCardColorStyles: Record<IndicatorColor, { border: string, icon: string, bg: string, text: string }> = {
  blue: { border: "border-l-blue-500", icon: "text-blue-500", bg: "bg-blue-50", text: "text-blue-600" },
  emerald: { border: "border-l-emerald-500", icon: "text-emerald-500", bg: "bg-emerald-50", text: "text-emerald-600" },
  indigo: { border: "border-l-indigo-500", icon: "text-indigo-500", bg: "bg-indigo-50", text: "text-indigo-600" },
  amber: { border: "border-l-amber-500", icon: "text-amber-500", bg: "bg-amber-50", text: "text-amber-600" },
  rose: { border: "border-l-rose-500", icon: "text-rose-500", bg: "bg-rose-50", text: "text-rose-600" },
  violet: { border: "border-l-violet-500", icon: "text-violet-500", bg: "bg-violet-50", text: "text-violet-600" },
};
