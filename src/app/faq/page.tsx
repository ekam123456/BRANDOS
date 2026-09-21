import type { Metadata } from "next";
import FAQ from "@/components/FAQ";
import { PageIntro, PageShell } from "@/components/PageFrame";

export const metadata: Metadata = { title: "FAQ" };

export default function FAQPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="FAQ" title="Questions, answered plainly.">
        <p>Here is the core information visitors need to understand what BRANDOS is, what it is not, and how it is intended to operate.</p>
      </PageIntro>

      <section className="container page-section faq-layout">
        <FAQ />
      </section>
    </PageShell>
  );
}
