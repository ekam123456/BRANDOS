import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/PageFrame";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="About" title="A more thoughtful way to run a business.">
        <p>BRANDOS is built around a simple idea: businesses are complex systems, and modern operating models should help people reason clearly rather than overwhelm them with more noise.</p>
      </PageIntro>

      <section className="container page-section">
        <div className="story-grid two-up">
          <div className="story-panel">
            <h3>Product philosophy</h3>
            <p>BRANDOS aims to reduce fragmentation, improve clarity and support the decisions that shape a business over time.</p>
          </div>
          <div className="story-panel emphasis">
            <h3>Responsible AI</h3>
            <p>Human judgment remains central. Intelligence should support operating decisions, not replace accountability, expertise or governance.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
