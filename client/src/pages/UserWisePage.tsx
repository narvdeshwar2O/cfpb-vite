import { USER_WISE_COLUMNS } from "@/constants/table-columns";
import { FilterBar } from "@/layouts";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";

// Mock data
const mockData = [
  {
    id: 1,
    state: "Delhi",
    districts: "New Delhi",
    policeStation: "Connaught Place",
    users: "45",
    tpEnrolment: "15,200",
    tpVerified: "14,500",
    tpDeleted: "150",
    cpEnrolled: "2,300",
    cpVerified: "2,100",
    cpDeleted: "20",
  },
  {
    id: 2,
    state: "Gujarat",
    districts: "Ahmedabad",
    policeStation: "Navrangpura",
    users: "64",
    tpEnrolment: "24,500",
    tpVerified: "23,900",
    tpDeleted: "130",
    cpEnrolled: "4,800",
    cpVerified: "4,600",
    cpDeleted: "30",
  },
  {
    id: 3,
    state: "Karnataka",
    districts: "Bengaluru",
    policeStation: "Koramangala",
    users: "92",
    tpEnrolment: "31,400",
    tpVerified: "30,900",
    tpDeleted: "210",
    cpEnrolled: "6,500",
    cpVerified: "6,300",
    cpDeleted: "45",
  },
  {
    id: 4,
    state: "Kerala",
    districts: "Thiruvananthapuram",
    policeStation: "Pettah",
    users: "35",
    tpEnrolment: "12,300",
    tpVerified: "12,100",
    tpDeleted: "40",
    cpEnrolled: "2,900",
    cpVerified: "2,850",
    cpDeleted: "15",
  },
  {
    id: 5,
    state: "Maharashtra",
    districts: "Mumbai",
    policeStation: "Colaba",
    users: "120",
    tpEnrolment: "45,600",
    tpVerified: "44,100",
    tpDeleted: "350",
    cpEnrolled: "8,900",
    cpVerified: "8,200",
    cpDeleted: "120",
  },
  {
    id: 6,
    state: "Rajasthan",
    districts: "Jaipur",
    policeStation: "Vidhyadhar Nagar",
    users: "55",
    tpEnrolment: "21,800",
    tpVerified: "21,100",
    tpDeleted: "220",
    cpEnrolled: "4,200",
    cpVerified: "4,000",
    cpDeleted: "60",
  },
  {
    id: 7,
    state: "Tamil Nadu",
    districts: "Chennai",
    policeStation: "Anna Nagar",
    users: "78",
    tpEnrolment: "28,900",
    tpVerified: "28,200",
    tpDeleted: "180",
    cpEnrolled: "5,100",
    cpVerified: "4,900",
    cpDeleted: "50",
  },
  {
    id: 8,
    state: "Uttar Pradesh",
    districts: "Lucknow",
    policeStation: "Hazratganj",
    users: "85",
    tpEnrolment: "62,100",
    tpVerified: "60,050",
    tpDeleted: "500",
    cpEnrolled: "12,400",
    cpVerified: "11,800",
    cpDeleted: "180",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: ColumnDef<any>[] = USER_WISE_COLUMNS.map((col, idx) => ({
  key: col.key === "slNo" ? "id" : col.key,
  label: col.label,
  headerClassName: `border-r border-slate-200 text-center align-middle ${idx === 0 ? "w-20" : ""}`,
  cellClassName: () => {
    let classes = "text-center align-middle border-r border-slate-200";
    if (col.key === "slNo") classes += " font-medium text-slate-700";
    if (col.key === "state") classes += " font-medium text-indigo-600";
    if (idx === USER_WISE_COLUMNS.length - 1) classes = "text-center align-middle";
    return classes;
  }
}));

export function UserWisePage() {
  return (
    <div className="flex flex-col h-full">
      <FilterBar />
      <DataTable 
        columns={columns} 
        data={mockData} 
      />
    </div>
  );
}
