import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { useFilters } from "@/app/providers/filter-provider";

export function FilterBarDate() {
  const { getFilterString, setFilter } = useFilters();

  return (
    <div className="flex items-center gap-3 shrink-0">
      <div className="flex items-center gap-2 relative">
        <label className="text-slate-600 font-medium text-sm flex items-center gap-1.5">
          <Calendar className="size-4 text-slate-400" />
          From
        </label>
        <Input
          type="date"
          className="w-37.5 bg-white shadow-sm text-slate-600"
          value={getFilterString("start_date") || ""}
          onChange={(e) => setFilter("start_date", e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2 relative">
        <label className="text-slate-600 font-medium text-sm">To</label>
        <Input
          type="date"
          className="w-37.5 bg-white shadow-sm text-slate-600"
          value={getFilterString("end_date") || ""}
          onChange={(e) => setFilter("end_date", e.target.value)}
        />
      </div>
    </div>
  );
}
