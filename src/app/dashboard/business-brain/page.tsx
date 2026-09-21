import Link from "next/link";
import { EmptyState, ProductHeader, ProductShell } from "@/components/ProductShell";
import { getBusinessBrain } from "@/lib/business-brain";

export const dynamic = "force-dynamic";

export default async function BrainPage() {
  const brain = await getBusinessBrain().catch(() => null);

  return <ProductShell>
    <ProductHeader eyebrow="Business Brain" title="What BRANDOS knows about your business." description="This is the understanding layer: facts, decisions, assumptions, and open questions kept distinct." />
    <div className="brain-tabs" role="tablist">{["Business", "Customers", "Products", "Market", "Goals"].map((item) => <button key={item} type="button">{item}</button>)}</div>
    {brain ? <section className="brain-overview">
      <div className="product-feature"><span className="kicker">Known from your setup</span><h2>{brain.name}</h2><p>{brain.profile?.description ?? "No business description has been provided yet."}</p><span className="status-badge status-neutral">{brain.profile ? "User-provided context" : "Unknown"}</span></div>
      <div className="product-feature"><span className="kicker">Primary goal</span><h2>{brain.goals.find((goal) => goal.isPrimary)?.title ?? "Not set"}</h2><p>{brain.goals.find((goal) => goal.isPrimary)?.timeframe ? `Timeframe: ${brain.goals.find((goal) => goal.isPrimary)?.timeframe}` : "Choose a goal when you are ready."}</p><span className="status-badge status-neutral">{brain.goals.some((goal) => goal.isPrimary) ? "User-decided" : "Unknown"}</span></div>
      <div className="product-feature"><span className="kicker">Business memory</span><h2>{brain.products.length + brain.services.length} offers</h2><p>{brain.observations.length} observations, {brain.tasks.length} tasks, and {brain.metrics.length} metrics are stored.</p><span className="status-badge status-neutral">No generated intelligence</span></div>
    </section> : <EmptyState title="Your Business Brain is just getting started." action={<Link className="button" href="/onboarding">Add business context</Link>}>There are no verified business records yet. Start with the guided setup so BRANDOS can learn without guessing.</EmptyState>}
  </ProductShell>;
}
