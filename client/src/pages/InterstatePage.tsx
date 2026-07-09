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
  { id: 1, state: "Delhi", districts: "New Delhi", tpIntra: "450", tpInter: "120", cpIntra: "85", cpInter: "34" },
  { id: 2, state: "Gujarat", districts: "Ahmedabad", tpIntra: "650", tpInter: "150", cpIntra: "95", cpInter: "32" },
  { id: 3, state: "Karnataka", districts: "Bengaluru", tpIntra: "890", tpInter: "210", cpIntra: "150", cpInter: "67" },
  { id: 4, state: "Kerala", districts: "Thiruvananthapuram", tpIntra: "340", tpInter: "85", cpIntra: "45", cpInter: "18" },
  { id: 5, state: "Maharashtra", districts: "Mumbai", tpIntra: "1,200", tpInter: "340", cpIntra: "210", cpInter: "89" },
  { id: 6, state: "Rajasthan", districts: "Jaipur", tpIntra: "560", tpInter: "130", cpIntra: "88", cpInter: "29" },
  { id: 7, state: "Tamil Nadu", districts: "Chennai", tpIntra: "780", tpInter: "190", cpIntra: "120", cpInter: "45" },
  { id: 8, state: "Uttar Pradesh", districts: "Lucknow", tpIntra: "2,500", tpInter: "560", cpIntra: "450", cpInter: "145" },
]

export function InterstatePage() {
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
                State/UT
              </TableHead>
              <TableHead rowSpan={2} className="text-center align-middle border-r border-slate-200">
                District Name
              </TableHead>
              <TableHead colSpan={2} className="text-center align-middle border-r border-b border-slate-200">
                Ten print HIT
              </TableHead>
              <TableHead colSpan={2} className="text-center align-middle border-b border-slate-200">
                Chance Print HIT
              </TableHead>
            </TableRow>
            {/* Sub Header Row */}
            <TableRow>
              <TableHead className="text-center align-middle border-r border-slate-200">
                Intra State
              </TableHead>
              <TableHead className="text-center align-middle border-r border-slate-200">
                Inter State
              </TableHead>
              <TableHead className="text-center align-middle border-r border-slate-200">
                Intra State
              </TableHead>
              <TableHead className="text-center align-middle">
                Inter State
              </TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {mockData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-center align-middle font-medium text-slate-700 border-r border-slate-200">{row.id}</TableCell>
                <TableCell className="text-center align-middle font-medium text-indigo-600 border-r border-slate-200">{row.state}</TableCell>
                <TableCell className="text-center align-middle border-r border-slate-200">{row.districts}</TableCell>
                <TableCell className="text-center align-middle border-r border-slate-200">{row.tpIntra}</TableCell>
                <TableCell className="text-center align-middle border-r border-slate-200">{row.tpInter}</TableCell>
                <TableCell className="text-center align-middle border-r border-slate-200">{row.cpIntra}</TableCell>
                <TableCell className="text-center align-middle">{row.cpInter}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
