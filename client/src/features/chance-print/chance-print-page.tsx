import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data
const mockData = [
  { id: 1, state: "Delhi", districts: "New Delhi", cases: "4,500", number: "12,200", hit: "1,500", noHit: "10,700" },
  { id: 2, state: "Gujarat", districts: "Ahmedabad", cases: "6,500", number: "18,500", hit: "2,400", noHit: "16,100" },
  { id: 3, state: "Karnataka", districts: "Bengaluru", cases: "8,900", number: "25,400", hit: "3,100", noHit: "22,300" },
  { id: 4, state: "Kerala", districts: "Thiruvananthapuram", cases: "3,200", number: "9,300", hit: "1,100", noHit: "8,200" },
  { id: 5, state: "Maharashtra", districts: "Mumbai", cases: "12,100", number: "35,600", hit: "4,200", noHit: "31,400" },
  { id: 6, state: "Rajasthan", districts: "Jaipur", cases: "5,800", number: "16,800", hit: "2,200", noHit: "14,600" },
  { id: 7, state: "Tamil Nadu", districts: "Chennai", cases: "7,200", number: "21,900", hit: "2,800", noHit: "19,100" },
  { id: 8, state: "Uttar Pradesh", districts: "Lucknow", cases: "15,800", number: "48,100", hit: "5,800", noHit: "42,300" },
]

export function ChancePrintPage() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1">
        <Table>
          <TableHeader>
            {/* Top Header Row */}
            <TableRow>
              <TableHead rowSpan={2} className="text-center align-middle w-[80px] border-r border-slate-200">
                Sl. No
              </TableHead>
              <TableHead rowSpan={2} className="text-center align-middle border-r border-slate-200">
                State/UTs/CLEAs
              </TableHead>
              <TableHead rowSpan={2} className="text-center align-middle border-r border-slate-200">
                District Name
              </TableHead>
              <TableHead rowSpan={2} className="text-center align-middle border-r border-slate-200">
                Total Chance print Cases
              </TableHead>
              <TableHead rowSpan={2} className="text-center align-middle border-r border-slate-200">
                Total Number of Chance prints
              </TableHead>
              <TableHead colSpan={2} className="text-center align-middle border-b border-slate-200">
                Total
              </TableHead>
            </TableRow>
            {/* Sub Header Row */}
            <TableRow>
              <TableHead className="text-center align-middle border-r border-slate-200">
                Hit
              </TableHead>
              <TableHead className="text-center align-middle">
                No-Hit
              </TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {mockData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-center align-middle font-medium text-slate-700 border-r border-slate-200">{row.id}</TableCell>
                <TableCell className="text-center align-middle font-medium text-indigo-600 border-r border-slate-200">{row.state}</TableCell>
                <TableCell className="text-center align-middle border-r border-slate-200">{row.districts}</TableCell>
                <TableCell className="text-center align-middle border-r border-slate-200">{row.cases}</TableCell>
                <TableCell className="text-center align-middle border-r border-slate-200">{row.number}</TableCell>
                <TableCell className="text-center align-middle border-r border-slate-200">{row.hit}</TableCell>
                <TableCell className="text-center align-middle">{row.noHit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
