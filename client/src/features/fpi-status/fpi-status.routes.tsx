import type { RouteObject } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
// FPI pages are lazy loaded
export const fpiStatusRoutes: RouteObject[] = [
  {
    path: ROUTES.fpiHumanBody,
    lazy: async () => ({ Component: (await import("./pages/human-body-offences-page")).default }),
  },
  {
    path: ROUTES.fpiProperty,
    lazy: async () => ({ Component: (await import("./pages/property-offences-page")).default }),
  },
  {
    path: ROUTES.fpiSll,
    lazy: async () => ({ Component: (await import("./pages/sll-crimes-page")).default }),
  },
  {
    path: ROUTES.fpiTenPrint,
    lazy: async () => ({ Component: (await import("./pages/ten-prints-enrolled-page")).default }),
  },
  {
    path: ROUTES.fpiForeigners,
    lazy: async () => ({ Component: (await import("./pages/foreigners-tp-page")).default }),
  },
  {
    path: ROUTES.fpiLatent,
    lazy: async () => ({ Component: (await import("./pages/latent-cases-page")).default }),
  },
  {
    path: ROUTES.fpiChancePrint,
    lazy: async () => ({ Component: (await import("./pages/chance-print-page")).default }),
  },
  {
    path: ROUTES.fpiExpertOpinion,
    lazy: async () => ({ Component: (await import("./pages/expert-opinion-page")).default }),
  },
];
