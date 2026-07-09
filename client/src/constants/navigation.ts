import {
  LayoutDashboard,
  Fingerprint,
  ScanLine,
  Users,
  Activity,
  FileDigit,
  Map,
  BarChart,
  ShieldCheck,
} from "lucide-react";

export const NAV_LINKS = [
  { label: "Central Admin", href: "/", icon: LayoutDashboard },
  { label: "Ten print Status", href: "/ten-print", icon: Fingerprint },
  { label: "Chance Print Status", href: "/chance-print", icon: ScanLine },
  { label: "User wise Status", href: "/user-wise", icon: Users },
  { label: "Live Enrolment", href: "/workflow-live", icon: Activity },
  { label: "Slip Capture", href: "/workflow-slip", icon: FileDigit },
  { label: "Interstate Status", href: "/interstate", icon: Map },
  { label: "Overall NAFIS Status", href: "/overall-nafis", icon: BarChart },
  { label: "FPI Status", href: "/fpi", icon: ShieldCheck },
];
