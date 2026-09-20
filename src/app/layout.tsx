import type { Metadata } from "next";
import { brandConfiguration } from "@/config/brand";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(brandConfiguration.domain),
  title: { default: "BRANDOS — Open your business", template: `%s — ${brandConfiguration.name}` },
  description: "A Business Operating System that turns scattered information into understanding, priorities and controlled execution.",
  openGraph: { title: "Open your business", description: "A clearer way to understand what matters and what to do next.", type: "website", siteName: brandConfiguration.name },
  twitter: { card: "summary_large_image", title: "Open your business", description: "The Business Operating System for the next decision." },
  icons: { icon: brandConfiguration.favicon },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
