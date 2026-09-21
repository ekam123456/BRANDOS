import type { Metadata } from "next";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { isClerkConfigured } from "@/lib/auth";

export const metadata: Metadata = { title: "Workspace" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!isClerkConfigured) {
    return <StageTwoSetup />;
  }

  const { isAuthenticated, orgId } = await auth();
  if (!isAuthenticated) {
    return <StageTwoSetup />;
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <Link className="brand" href="/"><span className="mark">B<span>·</span></span><span>BRANDOS</span></Link>
        <div className="app-header-actions">
          <OrganizationSwitcher hidePersonal />
          <UserButton />
        </div>
      </header>
      <section className="app-content">
        <p className="kicker">Workspace</p>
        <h1>Start with the context your business owns.</h1>
        <p className="app-lede">
          This protected workspace is the Stage 2 foundation. Business Brain records, goals, and intelligence are not created
          until your organization provides them.
        </p>
        {orgId ? (
          <div className="app-actions">
            <Link className="button" href="/onboarding">Set up business foundation</Link>
            <span className="tenant-note">Active organization: {orgId}</span>
          </div>
        ) : (
          <p className="tenant-note">Select an organization to continue.</p>
        )}
      </section>
    </main>
  );
}

function StageTwoSetup() {
  return (
    <main className="auth-page">
      <div className="auth-panel">
        <p className="kicker">Stage 2 foundation</p>
        <h1>Configure Clerk to open the workspace.</h1>
        <p>The protected product shell is ready, but this deployment does not have Clerk credentials configured.</p>
      </div>
    </main>
  );
}
