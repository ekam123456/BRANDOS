import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/PageFrame";

export const metadata: Metadata = { title: "Use cases" };

export default function UseCasesPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="Use cases" title="Different businesses, same need for clarity.">
        <p>BRANDOS is designed to support a broad range of organizations, from new ventures to mature businesses with more operational complexity.</p>
      </PageIntro>

      <section className="container page-section">
        <div className="usecase-grid">
          {[
            ["Startups", "Turn early signals, assumptions and goals into a focused operating rhythm."],
            ["Ecommerce", "Connect demand, customer behavior, fulfillment and margin into the next best move."],
            ["Local businesses", "Bring daily operations, service delivery and customer context into one calmer view."],
            ["Service businesses", "Understand demand, capacity, delivery health and retention together."],
            ["Agencies", "Keep client context, work progress and outcomes aligned without fragmentation."],
            ["Growing companies", "Coordinate more complexity while maintaining visibility into why work matters."],
          ].map(([title, text]) => (
            <article key={title} className="usecase-card">
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
