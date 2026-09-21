import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/PageFrame";

export const metadata: Metadata = { title: "How it works" };

export default function HowItWorksPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="How it works" title="A business loop that turns information into action.">
        <p>BRANDOS is designed as a continuous operating cycle: understand the business, identify what matters, recommend action, and learn from outcomes.</p>
      </PageIntro>

      <section className="container page-section">
        <div className="loop-grid">
          {[
            ["01", "Understand", "Build a living picture of how the business operates."],
            ["02", "Diagnose", "Surface friction, opportunity, change and uncertainty."],
            ["03", "Prioritize", "Focus attention on the few moves with disproportionate value."],
            ["04", "Recommend", "Explain what should happen, why it matters, and what supports it."],
            ["05", "Execute", "Prepare work, route approvals and perform trusted actions."],
            ["06", "Measure", "See the change that followed the action."],
            ["07", "Learn", "Improve future recommendations with new evidence."],
          ].map(([step, title, text]) => (
            <article key={step} className="loop-card">
              <span>{step}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
