import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/PageFrame";
import { plans } from "@/data/content";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="Pricing" title="Simple packages for different stages of maturity.">
        <p>Pricing is intentionally configurable while the product is being shaped. The goal is clarity about scope and capability—not locking customers into a final commercial model before it is ready.</p>
      </PageIntro>

      <section className="container page-section">
        <div className="plans-grid">
          {plans.map((plan) => (
            <article key={plan.name} className="plan-card">
              <span>{plan.name}</span>
              <h3>{plan.price}</h3>
              <p>{plan.description}</p>
              <ul>
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
