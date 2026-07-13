import React, { useState, useMemo, useRef, useEffect, useDeferredValue } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MultiSelectCheckboxProps {
  label?: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  disabledText?: string;
  getOptionLabel?: (value: string) => React.ReactNode;
  requireSearch?: boolean;
  loading?: boolean;
  inlineLabel?: boolean;
  className?: string;
  clearSearchOnSelect?:boolean
}

export const MultiSelectCheckbox = ({
  label,
  options,
  selected,
  onChange,
  placeholder = "Select Options",
  disabled = false,
  disabledText,
  getOptionLabel,
  requireSearch = false,
  clearSearchOnSelect = false,
  loading = false,
  inlineLabel = false,
  className = "",
}: MultiSelectCheckboxProps) => {
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Default label transformation function
  const getDisplayLabel = (value: string): React.ReactNode => {
    if (getOptionLabel) {
      return getOptionLabel(value);
    }

    if (value.toLowerCase() === "enrol") {
      return "ENROLL";
    }

    return value.toUpperCase();
  };

  const safeSetOpen = (v: boolean) => {
    if (disabled) return;
    setOpen(v);
    setSearch(""); // reset search when closing/opening
  };

  const toggleOption = (value: string) => {
    if (disabled) return;
    startTransition(() => {
      if (selected.includes(value)) {
        onChange(selected.filter((item) => item !== value));
      } else {
        onChange([...selected, value]);
      }
    });

    if (clearSearchOnSelect) {
      setSearch("");
    }
  };

  const handleSelectAll = () => {
    if (disabled) return;
    startTransition(() => {
      onChange(options);
    });
  };

  const handleClearAll = () => {
    if (disabled) return;
    startTransition(() => {
      onChange([]);
    });
  };

  const handleRemoveChip = (value: string) => {
    startTransition(() => {
      onChange(selected.filter((item) => item !== value));
    });
  };

  const isSelected = (value: string) => selected.includes(value);

  const buttonLabel = (disabled || loading)
    ? (loading ? "Loading..." : (disabledText ?? placeholder))
    : selected.length > 0
    ? `${selected.length} Selected`
    : placeholder;

  // Filter options based on search term (search both original value and display label)
  const filteredOptions = useMemo(() => {
    const searchTerm = deferredSearch.toLowerCase().trim();

    // Enforce 2-character minimum if requireSearch is true
    if (requireSearch && searchTerm.length < 2) {
      return [];
    }

    // If search is empty and requireSearch is false, we might still want to limit for performance
    // but usually requireSearch=false is used for small sets (states, districts)
    if (!searchTerm) {
      return options.slice(0, 1000); // Prevent huge renders even when not searching
    }

    const results = [];
    const maxResults = 200;
    const isCustomLabel = !!getOptionLabel;

    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const optLower = opt.toLowerCase();

      let matches = optLower.includes(searchTerm);

      if (!matches && isCustomLabel) {
        const displayLabel = getOptionLabel!(opt);
        if (typeof displayLabel === 'string') {
          matches = displayLabel.toLowerCase().includes(searchTerm);
        }
      }

      if (matches) {
        results.push(opt);
        if (results.length >= maxResults) break;
      }
    }

    return results;
  }, [options, deferredSearch, requireSearch, getOptionLabel]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [selected, search]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div className={`mt-1 ${inlineLabel ? "flex items-center gap-3" : "space-y-2"} ${className}`}>
      {label && (
        <label className={`text-sm font-medium flex items-center ${inlineLabel ? "whitespace-nowrap" : "h-5"}`}>
          {label}
        </label>
      )}
      {!label && !inlineLabel && <div className="h-5" />}
      <Popover open={disabled ? false : open} onOpenChange={safeSetOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`justify-between ${inlineLabel ? "w-[180px]" : "w-full"}`}
            disabled={disabled}
          >
            {buttonLabel}
            {loading || isPending ? (
              <div className="h-4 w-4 ml-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        {!disabled && (
          <PopoverContent className="w-80 max-h-80 p-2 space-y-2">
            {/* Chips + Search inside scrollable row */}
            <div
              ref={containerRef}
              className="flex items-center gap-1 border rounded px-2 py-1 overflow-x-auto scrollbar-hide"
            >
              {selected.slice(0, 15).map((sel) => (
                <span
                  key={sel}
                  className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full text-xs whitespace-nowrap"
                >
                  {getDisplayLabel(sel)}
                  <X
                    className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveChip(sel);
                    }}
                  />
                </span>
              ))}
              {selected.length > 15 && (
                <span className="text-[10px] text-muted-foreground whitespace-nowrap px-1">
                  +{selected.length - 15} more
                </span>
              )}
              <Input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="flex-1 border-none shadow-none focus-visible:ring-0 text-sm min-w-[100px]"
              />
            </div>

            {/* Select All / Clear All */}
            <div className="flex justify-between text-sm text-muted-foreground px-1">
              <button onClick={handleSelectAll} className="hover:underline">
                Select All
              </button>
              <button onClick={handleClearAll} className="hover:underline">
                Clear All
              </button>
            </div>

            {/* Options */}
            <div className="space-y-1 max-h-56 overflow-y-auto">
              {requireSearch && search.trim().length > 0 && search.trim().length < 2 ? (
                <div className="text-sm text-blue-600 px-1 py-2 italic">
                  Please type at least 2 characters to search
                </div>
              ) : filteredOptions.length > 0 ? (
                <>
                  {filteredOptions.map((option) => (
                    <div
                      key={option}
                      className="flex items-center space-x-2 px-1 py-1 rounded hover:bg-muted cursor-pointer"
                    >
                      <Checkbox
                        id={option}
                        checked={isSelected(option)}
                        onCheckedChange={() => toggleOption(option)}
                      />
                      <label htmlFor={option} className="text-sm">
                        {getDisplayLabel(option)}
                      </label>
                    </div>
                  ))}
                  {options.length > filteredOptions.length && search.trim().length >= 2 && (
                    <div className="text-xs text-muted-foreground px-1 py-2 border-t mt-1">
                      Showing first {filteredOptions.length} results. Try a more specific search.
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-muted-foreground px-1 py-2">
                  {requireSearch && !search.trim() ? "Type to search sections..." : "No results found"}
                </div>
              )}
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
};

export default MultiSelectCheckbox;
