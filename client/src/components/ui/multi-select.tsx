"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({ options, value, onChange, placeholder = "Select...", className }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()));

  const toggleOption = (optValue: string) => {
    if (optValue === "all") {
      // If clicking "all", clear others and just select "all" (or toggle it off if already selected)
      onChange(value.includes("all") ? [] : ["all"]);
      return;
    }

    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      // If adding a specific option, remove "all" if it was selected
      const newValue = value.filter((v) => v !== "all");
      onChange([...newValue, optValue]);
    }
  };

  const removeOption = (e: React.MouseEvent, optValue: string) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optValue));
  };

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {/* Trigger Box */}
      <div
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer overflow-hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex gap-1 items-center flex-1 overflow-hidden whitespace-nowrap">
          {value.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
          {value.includes("all") ? (
             <span className="flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground shrink-0">
               All Selected
               <X className="h-3 w-3 hover:text-destructive cursor-pointer" onClick={(e) => removeOption(e, "all")} />
             </span>
          ) : value.length > 2 ? (
             <span className="flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground shrink-0">
               {value.length} selected
             </span>
          ) : (
            value.map((v) => {
              const opt = options.find((o) => o.value === v);
              return (
                <span key={v} className="flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground shrink-0">
                  {opt?.label || v}
                  <X className="h-3 w-3 hover:text-destructive cursor-pointer" onClick={(e) => removeOption(e, v)} />
                </span>
              );
            })
          )}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80">
          <div className="sticky top-0 bg-popover flex items-center px-3 border-b">
            <Search className="h-4 w-4 mr-2 opacity-50" />
            <input
              type="text"
              placeholder="Search..."
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()} // Prevent closing
            />
          </div>
          <div className="p-1">
            {filteredOptions.length === 0 && <div className="py-6 text-center text-sm text-muted-foreground">No options found.</div>}
            {filteredOptions.map((opt) => {
              const isSelected = value.includes(opt.value) || value.includes("all");
              return (
                <div
                  key={opt.value}
                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  onClick={() => toggleOption(opt.value)}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {isSelected && <Check className="h-4 w-4" />}
                  </span>
                  {opt.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
