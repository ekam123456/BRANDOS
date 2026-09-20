import { brandConfiguration } from "@/config/brand";
export default function robots() { return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${brandConfiguration.domain}/sitemap.xml` }; }
