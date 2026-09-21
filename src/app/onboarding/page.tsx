import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { OrganizationProfile } from "@clerk/nextjs";
import { isClerkConfigured } from "@/lib/auth";

export const metadata: Metadata = { title: "Business setup" };
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  if (!isClerkConfigured) {
    return <main className="auth-page"><div className="auth-panel"><p className="kicker">Stage 2 foundation</p><h1>Configure Clerk before onboarding.</h1><p>No business information is collected until authentication and organization context are configured.</p></div></main>;
  }

  const { isAuthenticated, orgId } = await auth();
  if (!isAuthenticated || !orgId) {
    return <main className="auth-page"><div className="auth-panel"><p className="kicker">Business setup</p><h1>Select an organization first.</h1><Link className="button" href="/dashboard">Return to workspace</Link></div></main>;
  }

  return (
    <main className="app-shell">
      <header className="app-header"><Link className="brand" href="/dashboard"><span className="mark">B<span>·</span></span><span>BRANDOS</span></Link></header>
      <section className="app-content onboarding-content">
        <p className="kicker">Business foundation</p>
        <h1>Tell BRANDOS what your organization owns.</h1>
        <p className="app-lede">The next step is intentionally simple: establish your organization identity before any Business Brain records are created.</p>
        <OrganizationProfile />
      </section>
    </main>
  );
}
