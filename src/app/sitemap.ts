import { brandConfiguration } from "@/config/brand";
export default function sitemap() { return [{ url: brandConfiguration.domain, lastModified: new Date() }]; }
