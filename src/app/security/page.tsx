import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/PageFrame";

export const metadata: Metadata = { title: "Security" };

export default function SecurityPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="Security" title="Trust requires clear controls and honest boundaries.">
        <p>BRANDOS is designed around data separation, permission boundaries and auditable execution. Security is not an afterthought—it is part of the product architecture.</p>
      </PageIntro>

      <section className="container page-section">
        <div className="trust-grid enlarged">
          {[
            "Tenant isolation",
            "Authentication",
            "Authorization",
            "Granular permissions",
            "Secure credentials",
            "Encryption",
            "Approval flows",
            "Auditability",
            "Agent boundaries",
            "Least privilege",
            "Integration security",
            "Recovery and review",
          ].map((item) => (
            <div key={item} className="trust-card">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="container page-section">
        <div className="story-panel emphasis wide">
          <h3>Planned architecture vs. implemented controls</h3>
          <p>The website explains the architecture honestly: some controls are conceptual and future-facing, while real security controls must be implemented and verified before being described as operational.</p>
        </div>
      </section>
    </PageShell>
  );
}
