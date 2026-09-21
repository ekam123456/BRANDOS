"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  ["Today", "/dashboard/today"],
  ["Brain", "/dashboard/business-brain"],
  ["Intelligence", "/dashboard/intelligence"],
  ["Journey", "/dashboard/journey"],
  ["Work", "/dashboard/work"],
  ["Automations", "/dashboard/automations"],
  ["Analytics", "/dashboard/analytics"],
  ["Connections", "/dashboard/connections"],
] as const;

export function ProductShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  return (
    <div className="product-shell">
      <aside className="product-sidebar">
        <Link className="product-brand" href="/dashboard/today">
          <span className="mark">B<span>·</span></span>
          <span>BRANDOS</span>
        </Link>
        <p className="product-eyebrow">Business operating system</p>
        <nav className="product-nav" aria-label="Product navigation">
          {nav.map(([label, href]) => (
            <Link className={pathname === href ? "is-active" : ""} href={href} key={href}>{label}</Link>
          ))}
        </nav>
        <Link className={pathname === "/dashboard/settings" ? "product-settings is-active" : "product-settings"} href="/dashboard/settings">
          Settings
        </Link>
      </aside>
      <main className="product-main">
        <header className="product-topbar">
          <div className="product-mobile-brand"><span className="mark">B<span>·</span></span><span>BRANDOS</span></div>
          <div className="product-topbar-actions">
            {clerkConfigured ? <><OrganizationSwitcher hidePersonal /><UserButton /></> : <span className="status-badge">Auth setup required</span>}
          </div>
        </header>
        <div className="product-page">{children}</div>
      </main>
    </div>
  );
}

export function ProductHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <header className="product-page-header">
      <p className="kicker">{eyebrow}</p>
      <h1>{title}</h1>
      {description ? <p className="product-lede">{description}</p> : null}
    </header>
  );
}

export function EmptyState({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="product-empty" aria-live="polite">
      <span className="empty-symbol" aria-hidden="true">—</span>
      <h2>{title}</h2>
      <p>{children}</p>
      {action ? <div className="product-actions">{action}</div> : null}
    </section>
  );
}

export function StatusBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "pending" | "success" }) {
  return <span className={`status-badge status-${tone}`}>{children}</span>;
}
