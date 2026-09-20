import { lifecycle } from "@/data/content";
export function SectionLabel({ children }: { children: React.ReactNode }) { return <p className="eyebrow"><span className="dot" />{children}</p>; }
export function Arrow() { return <span className="arrow" aria-hidden="true">↗</span>; }
export function Lifecycle() { return <div className="lifecycle">{lifecycle.map(([n, title, text]) => <div className="lifecycle-item" key={n}><span className="step">{n}</span><h3>{title}</h3><p>{text}</p></div>)}</div>; }
export function FeatureCard({ number, title, children }: { number: string; title: string; children: React.ReactNode }) { return <article className="feature-card"><span className="card-number">{number}</span><h3>{title}</h3><p>{children}</p></article>; }
