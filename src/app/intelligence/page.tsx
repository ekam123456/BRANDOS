import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/PageFrame";

export const metadata: Metadata = { title: "Intelligence" };

export default function IntelligencePage() {
  return (
    <PageShell>
      <PageIntro eyebrow="Intelligence" title="The model that turns signals into useful judgment.">
        <p>
          BRANDOS is designed to interpret the difference between raw data, business observation, and a recommendation that deserves
          attention. It helps separate “what happened” from “what matters now.”
        </p>
      </PageIntro>

      <section className="container page-section">
        <div className="flow-grid">
          {[
            ["Data", "What happened."],
            ["Observation", "What changed or appears unusual."],
            ["Problem / opportunity", "Where attention may be needed."],
            ["Recommendation", "What could be done and why."],
            ["Action", "What gets executed and by whom."],
            ["Outcome", "What changed after the action."],
          ].map(([title, text]) => (
            <div key={title} className="flow-card">
              <span>{title}</span>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container page-section">
        <div className="section-header centered narrow">
          <p className="kicker">Why this?</p>
          <h2>Recommendations should explain themselves.</h2>
        </div>
        <div className="story-grid two-up">
          <div className="story-panel">
            <h3>Recommendations include context</h3>
            <ul className="bullet-list">
              <li>Evidence</li>
              <li>Confidence and uncertainty</li>
              <li>Potential impact</li>
              <li>Effort and urgency</li>
              <li>Dependencies and blockers</li>
            </ul>
          </div>
          <div className="story-panel emphasis">
            <h3>Future product interaction</h3>
            <p>“Why this?” is the product experience that turns recommendation into understanding. It helps the user see the logic behind the system rather than receiving a generic AI output.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
