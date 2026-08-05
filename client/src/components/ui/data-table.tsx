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

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  isError?: boolean;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  isError,
  emptyMessage = "No records found",
}: DataTableProps<T>) {
  return (
    <div className="p-3">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, index) => (
              <TableHead
                key={col.key || index}
                className={col.headerClassName || "text-center align-middle border-r border-slate-200"}
              >
                {col.label}
              </TableHead>
            ))}
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
