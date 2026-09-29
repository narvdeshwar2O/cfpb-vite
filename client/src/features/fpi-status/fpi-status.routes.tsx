import type { RouteObject } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { PermissionGuard } from "@/components/auth/permission-guard";

// FPI pages are lazy loaded
export const fpiStatusRoutes: RouteObject[] = [
  {
    path: ROUTES.fpiHumanBody,
    lazy: async () => {
      const Page = (await import("./pages/human-body-offences-page")).default;
      return { Component: () => <PermissionGuard required="fpi.human_body.view"><Page /></PermissionGuard> };
    },
  },
  {
    path: ROUTES.fpiProperty,
    lazy: async () => {
      const Page = (await import("./pages/property-offences-page")).default;
      return { Component: () => <PermissionGuard required="fpi.property.view"><Page /></PermissionGuard> };
    },
  },
  {
    path: ROUTES.fpiSll,
    lazy: async () => {
      const Page = (await import("./pages/sll-crimes-page")).default;
      return { Component: () => <PermissionGuard required="fpi.sll.view"><Page /></PermissionGuard> };
    },
  },
  {
    path: ROUTES.fpiTenPrint,
    lazy: async () => {
      const Page = (await import("./pages/ten-prints-enrolled-page")).default;
      return { Component: () => <PermissionGuard required="fpi.ten_print.view"><Page /></PermissionGuard> };
    },
  },
  {
    path: ROUTES.fpiForeigners,
    lazy: async () => {
      const Page = (await import("./pages/foreigners-tp-page")).default;
      return { Component: () => <PermissionGuard required="fpi.foreigners.view"><Page /></PermissionGuard> };
    },
  },
  {
    path: ROUTES.fpiLatent,
    lazy: async () => {
      const Page = (await import("./pages/latent-cases-page")).default;
      return { Component: () => <PermissionGuard required="fpi.latent.view"><Page /></PermissionGuard> };
    },
  },
  {
    path: ROUTES.fpiChancePrint,
    lazy: async () => {
      const Page = (await import("./pages/chance-print-page")).default;
      return { Component: () => <PermissionGuard required="fpi.chance_print.view"><Page /></PermissionGuard> };
    },
  },
  {
    path: ROUTES.fpiExpertOpinion,
    lazy: async () => {
      const Page = (await import("./pages/expert-opinion-page")).default;
      return { Component: () => <PermissionGuard required="fpi.expert_opinion.view"><Page /></PermissionGuard> };
    },
  },
];
