import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/PageFrame";

export const metadata: Metadata = { title: "Agents" };

export default function AgentsPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="Agents" title="Controlled workers inside the Business OS.">
        <p>Agents are not isolated chatbots. They are defined workers with a role, a toolkit, boundaries, execution history and verification.</p>
      </PageIntro>

      <section className="container page-section">
        <div className="agent-grid">
          {[
            ["Research", "Gathers information, validates signals and maps the context behind a question."],
            ["Marketing", "Links campaign signals, customer behavior and channel activity to strategic recommendations."],
            ["Content", "Turns strategic intent into content plans and customer-facing narratives."],
            ["Sales", "Supports pipeline diagnosis, outreach prioritization and follow-up preparation."],
            ["Analytics", "Finds anomalies, correlations and patterns that deserve attention."],
            ["Operations", "Helps structure workflows, dependencies and execution assumptions."],
            ["Customer support", "Connects service signals to customer impact and operational follow-up."],
            ["Finance", "Helps interpret revenue, timing, cash pressure and operating trade-offs."],
          ].map(([title, text]) => (
            <article key={title} className="agent-card">
              <span>{title}</span>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container page-section">
        <div className="section-header centered narrow">
          <p className="kicker">Governance</p>
          <h2>Each agent needs a boundary.</h2>
        </div>
        <div className="story-grid two-up">
          <div className="story-panel">
            <h3>Capabilities</h3>
            <ul className="bullet-list">
              <li>Defined tools and permissions</li>
              <li>Approval checkpoints</li>
              <li>Execution audit trail</li>
              <li>Access boundaries</li>
              <li>Versioned task history</li>
            </ul>
          </div>
          <div className="story-panel emphasis">
            <h3>Principle</h3>
            <p>Agents should be visible as part of a governed operating system, not unbounded conversational interfaces.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
