import { z } from "zod";

export const brandConfiguration = {
  name: "BRANDOS",
  logo: "BRANDOS",
  favicon: "/favicon.svg",
  colors: { ink: "#15221e", paper: "#f7f8f4", accent: "#b8ef72", muted: "#68756f" },
  typography: { display: "DM Sans", body: "DM Sans" },
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  emailIdentity: "hello@example.com",
  featureFlags: { waitlist: true, authenticatedApp: false },
} as const;

export const waitlistSchema = z.object({ email: z.string().email() });
export type BrandConfiguration = typeof brandConfiguration;
