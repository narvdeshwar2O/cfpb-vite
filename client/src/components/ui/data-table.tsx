import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface ColumnDef<T> {
  key: string;
  label: ReactNode;
  headerClassName?: string;
  cellClassName?: ((row: T) => string) | string;
  render?: (row: T, index: number) => ReactNode;
}

export interface HeaderGroup {
  label: ReactNode;
  colSpan: number;
  rowSpan?: number;
  className?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  isError?: boolean;
  emptyMessage?: string;
  headerGroups?: HeaderGroup[][] | HeaderGroup[];
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  isError,
  emptyMessage = "No records found",
  headerGroups,
}: DataTableProps<T>) {
  const colIndexToSkip = new Set<number>();
  const normalizedHeaderGroups: HeaderGroup[][] = headerGroups 
    ? (Array.isArray(headerGroups[0]) ? headerGroups as HeaderGroup[][] : [headerGroups as HeaderGroup[]]) 
    : [];

  if (normalizedHeaderGroups.length > 0) {
    // Calculate simple colIndex spanning across all header groups that drop into the bottom column row
    // A robust algorithm would track an entire grid, but for our simple layout, rowSpan reaching the bottom is enough.
    // Actually, to keep it simple, if a header has rowSpan > 1, it will skip columns in the bottom row.
    // For a 3-tier header: 
    // Tier 1 (top): "Sl. No" (rowSpan 3), "TP HIT" (colSpan 4)
    // Tier 2 (middle): "TP to TP" (colSpan 2), "UL" (colSpan 2)
    // Tier 3 (bottom): columns array.
    // Our existing logic assumes if any header group has rowSpan > length of headerGroups, it skips the bottom column.
    
    // Let's implement a robust grid indexer to find which bottom columns are covered by rowSpans from above.
    const grid: boolean[][] = [];
    for (let r = 0; r < normalizedHeaderGroups.length + 1; r++) {
      grid[r] = [];
    }

    normalizedHeaderGroups.forEach((rowGroups, r) => {
      let c = 0;
      rowGroups.forEach(group => {
        while (grid[r][c]) c++; // skip already occupied cells
        const rSpan = group.rowSpan || 1;
        const cSpan = group.colSpan || 1;
        for (let rr = 0; rr < rSpan; rr++) {
          for (let cc = 0; cc < cSpan; cc++) {
            grid[r + rr][c + cc] = true;
          }
        }
        c += cSpan;
      });
    });

    // The bottom row corresponds to grid[normalizedHeaderGroups.length]
    // Any column where grid[normalizedHeaderGroups.length][c] is true should be skipped!
    const bottomRowIndex = normalizedHeaderGroups.length;
    for (let c = 0; c < columns.length; c++) {
      if (grid[bottomRowIndex] && grid[bottomRowIndex][c]) {
        colIndexToSkip.add(c);
      }
    }
  }

  return (
    <div className="p-3">
      <Table>
        <TableHeader>
          {normalizedHeaderGroups.map((rowGroups, rowIndex) => (
            <TableRow key={rowIndex}>
              {rowGroups.map((group, index) => (
                <TableHead
                  key={index}
                  colSpan={group.colSpan}
                  rowSpan={group.rowSpan}
                  className={group.className || "text-center align-middle font-bold text-slate-800 border-r border-b border-slate-200 bg-slate-50"}
                >
                  {group.label}
                </TableHead>
              ))}
            </TableRow>
          ))}
          <TableRow>
            {columns.map((col, index) => {
              if (colIndexToSkip.has(index)) return null;
              return (
                <TableHead
                  key={col.key || index}
                  className={col.headerClassName || "text-center align-middle border-r border-slate-200 bg-slate-50"}
                >
                  {col.label}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-10">
                <div className="flex justify-center items-center gap-2">
                  <span className="text-slate-500">Loading data...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-red-500 py-10">
                Failed to load data. Please try again.
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-slate-500 py-10">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col, colIndex) => {
                  const cellClass =
                    typeof col.cellClassName === "function"
                      ? col.cellClassName(row)
                      : col.cellClassName || "text-center align-middle border-r border-slate-200";

                  return (
                    <TableCell key={col.key || colIndex} className={cellClass}>
                      {col.render
                        ? col.render(row, rowIndex)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        : (row as any)[col.key]}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
