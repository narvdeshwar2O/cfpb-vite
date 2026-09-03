import React from "react";
import { Printer, FileDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { NAV_LINKS } from "@/constants/navigation";

export const FilterBarExport = React.memo(function FilterBarExport() {
  const { pathname } = useLocation();
  const isDashboard = pathname === "/";

  const handlePrint = () => {
    if (isDashboard) {
      window.print();
      return;
    }

    const table = document.querySelector("table");
    if (!table) {
      window.print(); // Fallback if no table found on a random page
      return;
    }
    
    const printWindow = window.open('', '', 'height=800,width=1200');
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>&#8203;</title>');
    printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
    printWindow.document.write('<style>');
    printWindow.document.write('@page { size: A4 landscape; margin: 0; }');
    printWindow.document.write('body { font-family: ui-sans-serif, system-ui, sans-serif; padding: 15mm; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; font-size: 8px; table-layout: fixed; }');
    printWindow.document.write('th, td { border: 1px solid #cbd5e1; padding: 4px; text-align: center; word-wrap: break-word; overflow-wrap: break-word; }');
    printWindow.document.write('th { background-color: #f8fafc; font-weight: bold; color: #334155; }');
    printWindow.document.write('@media print { body { zoom: 0.75; } }');
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    
    // Find the current page title based on route
    let pageTitle = "Data Export";
    for (const link of NAV_LINKS) {
      if (link.href === pathname) {
        pageTitle = link.label;
        break;
      }
      if (link.children) {
        const child = link.children.find((c) => c.href === pathname);
        if (child) {
          pageTitle = child.label;
          break;
        }
      }
    }

    printWindow.document.write(`<h2 style="margin-bottom: 16px; font-size: 18px; font-weight: bold; color: #1e293b;">${pageTitle}</h2>`);
    printWindow.document.write(table.outerHTML);
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 750);
  };

  const handleExportCSV = () => {
    const table = document.querySelector("table");
    if (!table) {
      alert("No table found to export on this page.");
      return;
    }

    const rows = Array.from(table.querySelectorAll("tr"));
    const csvContent = rows
      .map((row) => {
        const cells = Array.from(row.querySelectorAll("th, td"));
        return cells
          .map((cell) => {
            let text = cell.textContent || "";
            text = text.replace(/"/g, '""');
            return `"${text.trim()}"`;
          })
          .join(",");
      })
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isDashboard) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 ml-auto shrink-0">
      <button
        onClick={handlePrint}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium text-sm transition-colors border border-slate-300"
        title="Print Page"
      >
        <Printer className="size-4" />
        <span className="hidden sm:inline">Print</span>
      </button>
      <button
        onClick={handleExportCSV}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md font-medium text-sm transition-colors border border-indigo-200"
        title="Export to CSV"
      >
        <FileDown className="size-4" />
        <span className="hidden sm:inline">Export CSV</span>
      </button>
    </div>
  );
});
