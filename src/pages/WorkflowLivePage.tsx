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
  { id: 1, state: "Delhi", districts: "New Delhi", arrested: "1,200", convicted: "300", externee: "45", deportee: "12", civil: "450", suspect: "1,800", uifp: "90" },
  { id: 2, state: "Gujarat", districts: "Ahmedabad", arrested: "2,400", convicted: "580", externee: "55", deportee: "9", civil: "650", suspect: "2,800", uifp: "110" },
  { id: 3, state: "Karnataka", districts: "Bengaluru", arrested: "3,200", convicted: "850", externee: "80", deportee: "18", civil: "950", suspect: "3,900", uifp: "160" },
  { id: 4, state: "Kerala", districts: "Thiruvananthapuram", arrested: "1,100", convicted: "240", externee: "25", deportee: "4", civil: "320", suspect: "1,200", uifp: "60" },
  { id: 5, state: "Maharashtra", districts: "Mumbai", arrested: "4,500", convicted: "1,100", externee: "120", deportee: "34", civil: "1,200", suspect: "5,400", uifp: "210" },
  { id: 6, state: "Rajasthan", districts: "Jaipur", arrested: "1,900", convicted: "490", externee: "45", deportee: "11", civil: "520", suspect: "2,100", uifp: "95" },
  { id: 7, state: "Tamil Nadu", districts: "Chennai", arrested: "2,900", convicted: "720", externee: "65", deportee: "14", civil: "800", suspect: "3,100", uifp: "140" },
  { id: 8, state: "Uttar Pradesh", districts: "Lucknow", arrested: "8,100", convicted: "2,300", externee: "250", deportee: "67", civil: "2,500", suspect: "9,800", uifp: "450" },
]

export function WorkflowLivePage() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center align-middle w-[80px] border-r border-slate-200">
                Sl. No
              </TableHead>
              <TableHead className="text-center align-middle border-r border-slate-200">
                State/UTs/CLEAs
              </TableHead>
              <TableHead className="text-center align-middle border-r border-slate-200">
                District Name
              </TableHead>
              <TableHead className="text-center align-middle border-r border-slate-200">
                Arrested
              </TableHead>
              <TableHead className="text-center align-middle border-r border-slate-200">
                Convicted
              </TableHead>
              <TableHead className="text-center align-middle border-r border-slate-200">
                Externee
              </TableHead>
              <TableHead className="text-center align-middle border-r border-slate-200">
                Deportee
              </TableHead>
              <TableHead className="text-center align-middle border-r border-slate-200">
                Civil
              </TableHead>
              <TableHead className="text-center align-middle border-r border-slate-200">
                Suspect
              </TableHead>
              <TableHead className="text-center align-middle">
                UIFP
              </TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {mockData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-center align-middle font-medium text-slate-700 border-r border-slate-200">{row.id}</TableCell>
                <TableCell className="text-center align-middle font-medium text-indigo-600 border-r border-slate-200">{row.state}</TableCell>
                <TableCell className="text-center align-middle border-r border-slate-200">{row.districts}</TableCell>
                <TableCell className="text-center align-middle border-r border-slate-200">{row.arrested}</TableCell>
                <TableCell className="text-center align-middle border-r border-slate-200">{row.convicted}</TableCell>
                <TableCell className="text-center align-middle border-r border-slate-200">{row.externee}</TableCell>
                <TableCell className="text-center align-middle border-r border-slate-200">{row.deportee}</TableCell>
                <TableCell className="text-center align-middle border-r border-slate-200">{row.civil}</TableCell>
                <TableCell className="text-center align-middle border-r border-slate-200">{row.suspect}</TableCell>
                <TableCell className="text-center align-middle">{row.uifp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
