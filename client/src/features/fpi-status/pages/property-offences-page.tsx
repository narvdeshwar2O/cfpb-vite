/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterBar } from "@/layouts";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { useMemo } from "react";

export default function PropertyOffencesPage() {  // Dummy data for now
  const tableData = [
    { state: "Delhi", district: "New Delhi" }
  ];
  const isLoading = false;
  const isError = false;
  const columns = useMemo<ColumnDef<any>[]>(() => {
    const locationKey = "state";
    const locationLabel = "State/UTs/CLEAs";

    return [
      { 
        key: "id", 
        label: "Sl. No", 
        headerClassName: "text-center align-middle w-20 border-r border-slate-200",
        cellClassName: "text-center align-middle font-medium text-slate-700 border-r border-slate-200",
        render: (_, idx) => idx + 1 
      },
      { 
        key: locationKey, 
        label: locationLabel,
        headerClassName: "text-center align-middle border-r border-slate-200 min-w-32",
        cellClassName: "text-center align-middle border-r border-slate-200 min-w-32",
        render: (row: any) => {
          const val = row[locationKey];
          if (!val) return "N/A";
          return <span className="font-medium text-slate-700 uppercase">{val}</span>;
        }
      },
      ...[
        { key: "theft", label: "Theft Sec 379,382 IPC/ 303, 305-307 BNS" },
        { key: "burglary", label: "Burglary Sec 454 to460 r/w, 380 IPC/ 329(4),332-334 r/w,303 or 331 r/w 305 BNS" },
        { key: "robbery", label: "Robbery Sec 392,394,397 IPC/ 309(4),309(6),311 BNS" },
        { key: "dacoity", label: "Dacoity Sec 395, 397 & 396 IPC/ 310(2&3), 311 BNS" },
        { key: "forgery", label: "Forgery, Cheating & Fraud Sec 420 r/w, 465, 468-471IPC 318(4) r/w 336(2) (3) (4),340 (2) BNS" },
        { key: "counterfeiting", label: "Counterfeiting Sec 231-235, 237, 238-240 & 242-254, 255-260, 472, 473,489-A to 489-E IPC/ 178, 181, 183-186, 187-188, 341 (1) (2) (3) (4) BNS" },
        { key: "other", label: "Other IPC/ BNS Crimes" }
      ].map(col => ({
        key: col.key,
        label: col.label,
        headerClassName: "text-center align-middle border-r border-slate-200 min-w-28",
        cellClassName: "text-center align-middle border-r border-slate-200",
        render: (row: Record<string, any>) => Number(row[col.key] || 0).toLocaleString()
      }))
    ];
  }, []);

  const headerGroups = useMemo(() => [
    { label: "Sl. No", colSpan: 1, rowSpan: 2 },
    { label: "State/UTs/CLEAs", colSpan: 1, rowSpan: 2 },
    { label: "IPC/BNS -Offences Against Property", colSpan: 4 },
    { label: "IPC/BNS -Offences Relating to Document & Property Marks", colSpan: 3 }
  ], []);

  return (
    <div className="flex flex-col h-full">
      <FilterBar />
      <div className="flex-1 overflow-auto">
        <DataTable 
          columns={columns} 
          data={tableData} 
          isLoading={isLoading} 
          isError={isError} 
          headerGroups={headerGroups}
        />
      </div>
    </div>
  );
}