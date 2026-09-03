export const ROUTES = {
  login: "/login",
  dashboard: "/",
  interstate: "/interstate",
  tenPrint: "/ten-print",
  chancePrint: "/chance-print",
  userWise: "/user-wise",
  workflowLive: "/live-enrollment",
  workflowSlip: "/slip-capture",
  
  // FPI Status
  fpiHumanBody: "/fpi/human-body",
  fpiProperty: "/fpi/property",
  fpiDocument: "/fpi/document",
  fpiSll: "/fpi/sll-crimes",
  fpiTenPrint: "/fpi/ten-print",
  fpiForeigners: "/fpi/foreigners",
  fpiLatent: "/fpi/latent",
  fpiChancePrint: "/fpi/chance-print",
  fpiExpertOpinion: "/fpi/expert-opinion",

  // Administration
  adminUsers: "/admin/users",
  adminRoles: "/admin/roles",
  adminPermissions: "/admin/permissions",
} as const;
