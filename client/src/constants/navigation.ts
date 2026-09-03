import {
  LayoutDashboard,
  Fingerprint,
  ScanLine,
  Users,
  Activity,
  FileDigit,
  Map,
  ShieldCheck,
} from "lucide-react";

import { ROUTES } from "@/shared/constants/routes";

export const NAV_LINKS = [
  {
    label: "Central Admin",
    href: ROUTES.dashboard,
    icon: LayoutDashboard,
    preload: () => import("@/features/dashboard/dashboard-page")
  },
  {
    label: "Ten print Status",
    href: ROUTES.tenPrint,
    icon: Fingerprint,
    preload: () => import("@/features/ten-print/ten-print-page")
  },
  {
    label: "Chance Print Status",
    href: ROUTES.chancePrint,
    icon: ScanLine,
    preload: () => import("@/features/chance-print/chance-print-page")
  },
  {
    label: "User wise Status",
    href: ROUTES.userWise,
    icon: Users,
    preload: () => import("@/pages/UserWisePage")
  },
  {
    label: "Live Enrolment",
    href: ROUTES.workflowLive,
    icon: Activity,
    preload: () => import("@/features/workflow/workflow-page")
  },
  {
    label: "Slip Capture",
    href: ROUTES.workflowSlip,
    icon: FileDigit,
    preload: () => import("@/features/workflow/workflow-page")
  },
  {
    label: "Interstate Status",
    href: ROUTES.interstate,
    icon: Map,
    preload: () => import("@/pages/InterstatePage")
  },
  {
    label: "FPI Status",
    icon: ShieldCheck,
    children: [
      { label: "Human Body Offences", href: ROUTES.fpiHumanBody, preload: () => import("@/features/fpi-status/pages/human-body-offences-page") },
      {
        label: "Property & Document Offences",
        href: ROUTES.fpiProperty,
        preload: () => import("@/features/fpi-status/pages/property-offences-page"),
      },
      { label: "All Crimes", href: ROUTES.fpiSll, preload: () => import("@/features/fpi-status/pages/sll-crimes-page") },
      { label: "Ten Prints Enrolled", href: ROUTES.fpiTenPrint, preload: () => import("@/features/fpi-status/pages/ten-prints-enrolled-page") },
      { label: "Foreigners TP Enrolled", href: ROUTES.fpiForeigners, preload: () => import("@/features/fpi-status/pages/foreigners-tp-page") },
      {
        label: "Latent Cases",
        href: ROUTES.fpiLatent,
        preload: () => import("@/features/fpi-status/pages/latent-cases-page")
      },
      {
        label: "Chance Print",
        href: ROUTES.fpiChancePrint,
        preload: () => import("@/features/fpi-status/pages/chance-print-page")
      },
      {
        label: "LVQ vs RVQ",
        href: ROUTES.fpiExpertOpinion,
        preload: () => import("@/features/fpi-status/pages/expert-opinion-page")
      }
    ]
  },
];

export const ADMIN_NAV_LINKS = [
  {
    label: "User Management",
    href: ROUTES.adminUsers,
    icon: Users,
    preload: () => import("@/pages/admin/AdminUsers")
  },
  {
    label: "Roles & Permissions",
    href: ROUTES.adminRoles,
    icon: ShieldCheck,
    preload: () => import("@/pages/admin/AdminRoles")
  },
  {
    label: "Permissions",
    href: ROUTES.adminPermissions,
    icon: ShieldCheck,
    preload: () => import("@/pages/admin/AdminPermissions")
  },
];
