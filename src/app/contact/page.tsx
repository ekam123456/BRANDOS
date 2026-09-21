import type { Metadata } from "next";
import Link from "next/link";
import { brandConfiguration } from "@/config/brand";
import { PageIntro, PageShell } from "@/components/PageFrame";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="Contact" title="Start a conversation about your business.">
        <p>At this stage, this is a public product website, not a connected backend. If you want to start building, reach out directly using the contact details below.</p>
      </PageIntro>

      <section className="container page-section">
        <div className="contact-card">
          <h3>Contact</h3>
          <p>Email: <a href={`mailto:${brandConfiguration.emailIdentity}`}>{brandConfiguration.emailIdentity}</a></p>
          <p>Use this as a placeholder contact while the marketing site remains in public-launch stages.</p>
          <Link className="button" href={`mailto:${brandConfiguration.emailIdentity}?subject=Start%20building%20my%20business`}>Start building</Link>
        </div>
      </section>
    </PageShell>
  );
}
