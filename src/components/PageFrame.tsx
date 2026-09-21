import Header, { SiteFooter } from "@/components/Header";

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <section className="page-hero">
      <div className="container narrow">
        <p className="kicker">{eyebrow}</p>
        <h1>{title}</h1>
        {children ? <div className="page-hero-copy">{children}</div> : null}
      </div>
    </section>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="page-shell">
      <Header />
      {children}
      <SiteFooter />
    </main>
  );
}
