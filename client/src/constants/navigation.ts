import {
  LayoutDashboard,
  Fingerprint,
  ScanLine,
  Users,
  Activity,
  FileDigit,
  Map,
  ShieldCheck,
  Network,
  FileText,
} from "lucide-react";

import { ROUTES } from "@/shared/constants/routes";

export const NAV_LINKS = [
  {
    label: "Central Admin",
    href: ROUTES.dashboard,
    icon: LayoutDashboard,
    requiredPermission: "dashboard.view",
    preload: () => import("@/features/dashboard/dashboard-page")
  },
  {
    label: "Ten print Status",
    href: ROUTES.tenPrint,
    icon: Fingerprint,
    requiredPermission: "ten.print.view",
    preload: () => import("@/features/ten-print/ten-print-page")
  },
  {
    label: "Chance Print Status",
    href: ROUTES.chancePrint,
    icon: ScanLine,
    requiredPermission: "chance.print.view",
    preload: () => import("@/features/chance-print/chance-print-page")
  },
  {
    label: "User wise Status",
    href: ROUTES.userWise,
    icon: Users,
    requiredPermission: "user.wise.view",
    preload: () => import("@/pages/UserWisePage")
  },
  {
    label: "Live Enrolment",
    href: ROUTES.workflowLive,
    icon: Activity,
    requiredPermission: "live.enrolment.view",
    preload: () => import("@/features/workflow/workflow-page")
  },
  {
    label: "Slip Capture",
    href: ROUTES.workflowSlip,
    icon: FileDigit,
    requiredPermission: "slip.view",
    preload: () => import("@/features/workflow/workflow-page")
  },
  {
    label: "Interstate Status",
    href: ROUTES.interstate,
    icon: Map,
    requiredPermission: "interstate.view",
    preload: () => import("@/pages/InterstatePage")
  },
  {
    label: "FPI Status",
    icon: ShieldCheck,
    children: [
      { 
        label: "Human Body Offences", 
        href: ROUTES.fpiHumanBody, 
        requiredPermission: "fpi.human_body.view",
        preload: () => import("@/features/fpi-status/pages/human-body-offences-page") 
      },
      {
        label: "Property & Document Offences",
        href: ROUTES.fpiProperty,
        requiredPermission: "fpi.property.view",
        preload: () => import("@/features/fpi-status/pages/property-offences-page"),
      },
      { 
        label: "SLL Crimes", 
        href: ROUTES.fpiSll, 
        requiredPermission: "fpi.sll.view",
        preload: () => import("@/features/fpi-status/pages/sll-crimes-page") 
      },
      { 
        label: "Ten Prints Enrolled", 
        href: ROUTES.fpiTenPrint, 
        requiredPermission: "fpi.ten_print.view",
        preload: () => import("@/features/fpi-status/pages/ten-prints-enrolled-page") 
      },
      { 
        label: "Foreigners TP Enrolled", 
        href: ROUTES.fpiForeigners, 
        requiredPermission: "fpi.foreigners.view",
        preload: () => import("@/features/fpi-status/pages/foreigners-tp-page") 
      },
      {
        label: "Latent Cases",
        href: ROUTES.fpiLatent,
        requiredPermission: "fpi.latent.view",
        preload: () => import("@/features/fpi-status/pages/latent-cases-page")
      },
      {
        label: "Chance Print",
        href: ROUTES.fpiChancePrint,
        requiredPermission: "fpi.chance_print.view",
        preload: () => import("@/features/fpi-status/pages/chance-print-page")
      },
      {
        label: "LVQ vs RVQ",
        href: ROUTES.fpiExpertOpinion,
        requiredPermission: "fpi.expert_opinion.view",
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
    requiredPermission: "users.manage",
    preload: () => import("@/pages/admin/AdminUsers")
  },
  {
    label: "Roles & Permissions",
    href: ROUTES.adminRoles,
    icon: ShieldCheck,
    requiredPermission: "roles.manage",
    preload: () => import("@/pages/admin/AdminRoles")
  },
  {
    label: "Permissions",
    href: ROUTES.adminPermissions,
    icon: ShieldCheck,
    requiredPermission: "permissions.manage",
    preload: () => import("@/pages/admin/AdminPermissions")
  },
  {
    label: "LDAP / AD",
    href: ROUTES.adminLdap,
    icon: Network,
    superAdminOnly: true,
    preload: () => import("@/pages/admin/AdminLdap")
  },
  {
    label: "Audit Logs",
    href: ROUTES.adminAudit,
    icon: FileText,
    superAdminOnly: true,
    preload: () => import("@/pages/admin/AdminAudit")
  },
];

export function getNavLabelByPath(pathname: string): string {
  if (!pathname || pathname === "/") return "Central Admin";
  
  // Normalize trailing slash if any
  const cleanPath = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  for (const item of NAV_LINKS) {
    if (item.href === cleanPath) return item.label;
    if (item.children) {
      for (const child of item.children) {
        if (child.href === cleanPath) {
          return `${item.label}: ${child.label}`;
        }
      }
    }
  }

  for (const item of ADMIN_NAV_LINKS) {
    if (item.href === cleanPath) return item.label;
  }

  return cleanPath;
}

