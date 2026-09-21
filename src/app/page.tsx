import Link from "next/link";
import { PageShell } from "@/components/PageFrame";
import { plans } from "@/data/content";

export default function Home() {
  return (
    <PageShell>
      <section className="hero container">
        <div className="hero-copy">
          <p className="kicker">Business operating system</p>
          <h1>
            The operating layer that turns scattered signals into business clarity.
          </h1>
          <p className="hero-lede">
            BRANDOS creates a living model of the business so teams can understand what is changing, why it matters,
            and what deserves action next—without the noise of disconnected tools and fragmented dashboards.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/contact">Start building</Link>
            <Link className="button secondary" href="/how-it-works">Explore how it works</Link>
          </div>
          <div className="hero-metrics" aria-label="BRANDOS concept summary">
            <div>
              <strong>One</strong>
              <span>operating picture</span>
            </div>
            <div>
              <strong>Context</strong>
              <span>before action</span>
            </div>
            <div>
              <strong>Clear</strong>
              <span>next steps</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Signals to context to decisions to outcomes">
          <div className="signal signal-a">Signals</div>
          <div className="signal signal-b">Context</div>
          <div className="signal signal-c">Decisions</div>
          <div className="signal signal-d">Outcomes</div>
          <div className="brain-core">
            <span>Business</span>
            <strong>Brain</strong>
          </div>
        </div>
      </section>

      <div className="ticker">
        <div className="container ticker-inner">
          <span>One connected loop</span>
          <span>Understand</span>
          <span>Diagnose</span>
          <span>Prioritize</span>
          <span>Recommend</span>
          <span>Execute</span>
          <span>Learn</span>
        </div>
      </div>

      <section className="section container">
        <div className="section-header split">
          <div>
            <p className="kicker">The fragmentation problem</p>
            <h2>Most businesses aren’t short on information. They’re short on clarity.</h2>
          </div>
          <p>
            Marketing, sales, operations, finance, customer conversations, and website activity each tell a different story.
            The real challenge is not collecting more data—it is understanding what is changing, what it means, and what matters now.
          </p>
        </div>
        <div className="chips-grid">
          {[
            "Analytics",
            "Sales & CRM",
            "Marketing",
            "Customer data",
            "Operations",
            "Revenue",
            "Team decisions",
            "Documents",
          ].map((item) => (
            <span key={item} className="chip">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header centered narrow">
            <p className="kicker">The missing layer</p>
            <h2>BRANDOS connects the business into one coherent operating picture.</h2>
          </div>
          <div className="flow-grid">
            {[
              ["Data", "Signals and records from the business"],
              ["Context", "A structured model of how the business works"],
              ["Intelligence", "Patterns, problems and opportunity"],
              ["Decisions", "What matters now and why"],
              ["Execution", "Prepared, approved and trackable work"],
              ["Outcomes", "What changes after the action"],
            ].map(([title, copy]) => (
              <div key={title} className="flow-card">
                <span>{title}</span>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-header centered narrow">
          <p className="kicker">Business Brain</p>
          <h2>A contextual operating model, not just a database.</h2>
        </div>
        <div className="story-grid two-up">
          <div className="story-panel">
            <h3>What the Business Brain understands</h3>
            <ul className="bullet-list">
              <li>Products and services</li>
              <li>Customers and segments</li>
              <li>Goals, performance and constraints</li>
              <li>Operations, sales and team dynamics</li>
              <li>Past decisions and their outcomes</li>
            </ul>
          </div>
          <div className="story-panel emphasis">
            <h3>Why it matters</h3>
            <p>
              A sales dip is not just a number. It gains meaning when it connects to pricing, customer segments, marketing,
              product mix and historical decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header centered narrow">
            <p className="kicker">Intelligence</p>
            <h2>From raw information to action.</h2>
          </div>
          <div className="timeline">
            {[
              ["Data", "What happened."],
              ["Observation", "What changed or appears unusual."],
              ["Problem / opportunity", "Where attention may be needed."],
              ["Recommendation", "What could be done and why."],
              ["Action", "What gets executed and by whom."],
              ["Outcome", "What changed after the action."],
            ].map(([title, text]) => (
              <div key={title} className="timeline-item">
                <span>{title}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-header two-up">
          <div>
            <p className="kicker">What matters now</p>
            <h2>Design for focus, not overload.</h2>
          </div>
          <p>
            Instead of surfacing hundreds of metrics, BRANDOS is designed to highlight the few things that deserve attention now,
            with the reasoning behind them.
          </p>
        </div>
        <div className="signal-panel">
          <div className="signal-topline">
            <span>Illustrative workspace</span>
            <span>Today · 09:41</span>
          </div>
          <h3>Good morning.</h3>
          <p>Here’s what matters today.</p>
          <div className="signal-row">
            <strong>1</strong>
            <span>thing needs attention</span>
          </div>
          <div className="signal-row">
            <strong>3</strong>
            <span>high-impact actions</span>
          </div>
          <div className="signal-row muted">
            <strong>2</strong>
            <span>things the system handled</span>
          </div>
          <small>Illustrative experience. No real business data shown.</small>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header centered narrow">
            <p className="kicker">Agents and execution</p>
            <h2>Recommendations move into action with controls.</h2>
          </div>
          <div className="mini-flow">
            {[
              "Recommendation",
              "Task",
              "Preparation",
              "Approval",
              "Execution",
              "Verification",
              "Measurement",
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-header centered narrow">
          <p className="kicker">Autonomy</p>
          <h2>Human control stays visible.</h2>
        </div>
        <div className="autonomy-grid">
          {[
            ["Manual", "The system tells you what to do."],
            ["Assisted", "It prepares the work and awaits approval."],
            ["Auto", "Predefined actions can run within permissions."],
            ["Autopilot", "The system works toward goals inside boundaries."],
          ].map(([label, text], index) => (
            <div key={label} className={index === 1 ? "autonomy-card selected" : "autonomy-card"}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{label}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header centered narrow">
            <p className="kicker">Trust</p>
            <h2>Security is a product feature, not a checkbox.</h2>
          </div>
          <div className="trust-grid">
            {[
              "Tenant isolation",
              "Granular permissions",
              "Approval controls",
              "Audit trails",
              "Secure credentials",
              "Least privilege",
            ].map((item) => (
              <div key={item} className="trust-card">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-header centered narrow">
          <p className="kicker">Business contexts</p>
          <h2>Built to support different kinds of work.</h2>
        </div>
        <div className="usecase-grid">
          {[
            ["Startup", "Turn goals, assumptions and early traction into a clear operating rhythm."],
            ["Ecommerce", "Connect demand, margin, marketing and conversion into the next best move."],
            ["Local business", "Bring operations, customer context and daily decisions into one view."],
            ["Service business", "Understand capacity, delivery and retention together."],
            ["Agency", "Keep client context, delivery decisions and outcomes connected."],
            ["Growing company", "Coordinate complexity without losing the reasons behind the work."],
          ].map(([title, text]) => (
            <article key={title} className="usecase-card">
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-alt pricing-preview">
        <div className="container">
          <div className="section-header centered narrow">
            <p className="kicker">Pricing</p>
            <h2>Start with the context you need. Grow from there.</h2>
          </div>
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
        </div>
      </section>

      <section className="final-cta">
        <div className="container narrow centered">
          <p className="kicker">Open your business</p>
          <h2>Stop managing disconnected tools. Start operating from one system.</h2>
          <Link className="button button-light" href="/contact">Start building</Link>
        </div>
      </section>
    </PageShell>
  );
}
