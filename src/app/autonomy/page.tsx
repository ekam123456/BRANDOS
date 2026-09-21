import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/PageFrame";

export const metadata: Metadata = { title: "Autonomy" };

export default function AutonomyPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="Autonomy" title="Intentional control over how much the system acts.">
        <p>Autonomy is not “AI at max power.” It is a governance model that defines how much the system may act, with what permissions, and under which approvals.</p>
      </PageIntro>

      <section className="container page-section">
        <div className="autonomy-flow">
          {[
            ["Manual", "The system tells the user what to do."],
            ["Assisted", "The system prepares the work; the user approves."],
            ["Auto", "Predefined actions run inside explicit permissions."],
            ["Autopilot", "The system continuously works toward goals inside strict boundaries."],
          ].map(([label, text], index) => (
            <article key={label} className={index === 1 ? "autonomy-card selected" : "autonomy-card"}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{label}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container page-section">
        <div className="story-panel emphasis wide">
          <h3>Governance first</h3>
          <p>Permissions, approvals, data access rules and verification checkpoints decide how much autonomy is safe. Human control remains visible at every layer.</p>
        </div>
      </section>
    </PageShell>
  );
}
