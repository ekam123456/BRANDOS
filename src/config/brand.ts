import { z } from "zod";

export const brandConfiguration = {
  name: "BRANDOS",
  logo: "BRANDOS",
  favicon: "/favicon.svg",
  colors: { ink: "#101b1d", paper: "#f6f2eb", accent: "#9ec7b5", accentStrong: "#607f78", muted: "#586c6f" },
  typography: { display: "Manrope", body: "Manrope" },
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  emailIdentity: "hello@brandos.example",
  featureFlags: { waitlist: true, authenticatedApp: false },
} as const;

export const waitlistSchema = z.object({ email: z.string().email() });
export type BrandConfiguration = typeof brandConfiguration;
