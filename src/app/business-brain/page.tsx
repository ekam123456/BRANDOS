import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/PageFrame";

export const metadata: Metadata = { title: "Business Brain" };

export default function BusinessBrainPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="Business Brain" title="The contextual model of the company.">
        <p>
          The Business Brain is not just a storage layer. It is the structured understanding that helps the business reason about
          itself: what it sells, who it serves, how it grows, where it is constrained, and what matters most right now.
        </p>
      </PageIntro>

      <section className="container page-section">
        <div className="story-grid two-up">
          <div className="story-panel">
            <h3>What it eventually understands</h3>
            <ul className="bullet-list">
              <li>Business model and offer</li>
              <li>Customers and segments</li>
              <li>Financial performance and constraints</li>
              <li>Marketing, sales and operations</li>
              <li>Goals, decisions and outcomes</li>
            </ul>
          </div>
          <div className="story-panel emphasis">
            <h3>Why context matters</h3>
            <p>A sales decline can be explained by traffic, pricing, customer mix, product performance, competition and historical decisions. Without context, it is merely a number.</p>
          </div>
        </div>
      </section>

      <section className="container page-section">
        <div className="section-header centered narrow">
          <p className="kicker">Business relationships</p>
          <h2>Context is made of relationships.</h2>
        </div>
        <div className="relationship-grid">
          {[
            "Business",
            "Products",
            "Customers",
            "Revenue",
            "Marketing",
            "Operations",
            "Team",
            "Decisions",
          ].map((item) => (
            <div key={item} className="relationship-node">{item}</div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
