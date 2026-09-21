import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/PageFrame";

export const metadata: Metadata = { title: "Product" };

export default function ProductPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="Product" title="The operating layer around the business.">
        <p>
          BRANDOS sits between scattered tools and decisive action. It helps a business understand itself, identify what matters,
          recommend the next move, and keep execution grounded in context instead of isolated signals.
        </p>
      </PageIntro>

      <section className="container page-section">
        <div className="story-grid two-up">
          <div className="story-panel">
            <h3>Disconnected tools create noise.</h3>
            <p>Analytics, CRM, marketing, operations, support, communications and finance all produce information. The problem is not a lack of data. It is a lack of shared meaning.</p>
          </div>
          <div className="story-panel emphasis">
            <h3>BRANDOS creates the missing layer.</h3>
            <p>It gathers context, identifies patterns, explains trade-offs and supports decisions that connect understanding to execution.</p>
          </div>
        </div>
      </section>

      <section className="container page-section">
        <div className="section-header centered narrow">
          <p className="kicker">Operating model</p>
          <h2>From information to business clarity.</h2>
        </div>
        <div className="flow-grid">
          {[
            ["Signals", "Activity, data and change across the business"],
            ["Context", "A shared understanding of the business model"],
            ["Diagnosis", "Disruption, drift, opportunity and risk"],
            ["Priorities", "The few moves that deserve attention"],
            ["Execution", "Tasks, approvals and accountability"],
            ["Learning", "Outcomes improve future decisions"],
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
          <p className="kicker">What it is not</p>
          <h2>A category shift, not another dashboard.</h2>
        </div>
        <div className="comparison-grid">
          {[
            ["Analytics tools", "Reveal what happened."],
            ["Project management", "Keep work organized."],
            ["CRM", "Track relationships."],
            ["AI chat", "Generate answers."],
            ["Automation tools", "Trigger actions."],
            ["Business OS", "Connect understanding, decisions and execution around the business."],
          ].map(([label, value]) => (
            <div key={label} className="comparison-card">
              <span>{label}</span>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
