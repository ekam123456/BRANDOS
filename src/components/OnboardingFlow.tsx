"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Step = "intro" | "quiz" | "map" | "connections" | "goal" | "building" | "journey" | "mission";
type Answers = { category?: string; name?: string; customer?: string; challenge?: string; goal?: string; timeframe?: string };
const categories = ["Established business", "SaaS", "E-commerce", "Local service business", "Restaurant", "New business / business idea"];
const goals = ["Get more customers", "Increase revenue", "Launch the business", "Improve profitability", "Grow audience", "Improve operations"];

export default function OnboardingFlow() {
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<Answers>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem("brandos-onboarding");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { step?: Step; answers?: Answers };
        setStep(parsed.step ?? "intro");
        setAnswers(parsed.answers ?? {});
      } catch { /* Ignore malformed local draft and start clean. */ }
    }
  }, []);

  function save(nextStep: Step, nextAnswers = answers) {
    setStep(nextStep);
    setAnswers(nextAnswers);
    window.localStorage.setItem("brandos-onboarding", JSON.stringify({ step: nextStep, answers: nextAnswers }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  }

  if (step === "intro") return <OnboardingFrame current={1} title="A clearer way to run the business" description="BRANDOS first learns what matters to you, then turns that understanding into a focused path of meaningful work." saved={saved}>
    <div className="intro-steps">{["Today — what matters now", "Business Brain — what BRANDOS knows", "Intelligence — what needs attention", "Journey — the path toward your goal", "Work — guided missions", "Connections — real business context"].map((item, index) => <div className="intro-step" key={item}><span>0{index + 1}</span><p>{item}</p></div>)}</div>
    <div className="product-actions"><button className="button" onClick={() => save("quiz")}>Start with my business</button><button className="button secondary" onClick={() => save("quiz")}>Explore first</button></div>
  </OnboardingFrame>;

  if (step === "quiz") return <OnboardingFrame current={2} title="Let’s understand your business" description="A few focused questions. You can skip anything you do not know yet." saved={saved}>
    <div className="quiz-stack">
      <label className="field-label">What should we call the business?<input value={answers.name ?? ""} onChange={(event) => setAnswers({ ...answers, name: event.target.value })} placeholder="Business name" /></label>
      <fieldset><legend className="field-label">Which description fits best?</legend><div className="choice-grid">{categories.map((category) => <button type="button" className={answers.category === category ? "choice-card is-selected" : "choice-card"} key={category} onClick={() => setAnswers({ ...answers, category })}>{category}</button>)}</div></fieldset>
      <label className="field-label">Who do you serve? <span>Optional</span><textarea value={answers.customer ?? ""} onChange={(event) => setAnswers({ ...answers, customer: event.target.value })} placeholder="Describe the people or businesses you serve" rows={3} /></label>
    </div>
    <div className="product-actions"><button className="button secondary" onClick={() => save("intro")}>Back</button><button className="button" disabled={!answers.category} onClick={() => save("map")}>Continue</button></div>
  </OnboardingFrame>;

  if (step === "map") return <OnboardingFrame current={3} title="Here’s what we understand so far" description="This is a draft, not a verdict. Correct anything that does not sound right." saved={saved}>
    <div className="map-summary">{[["Business", answers.name || "Not provided yet"], ["Type", answers.category || "Not provided yet"], ["Customer", answers.customer || "We do not know this yet"], ["Known challenges", answers.challenge || "We have not asked this yet"]].map(([label, value]) => <div className="summary-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
    <div className="product-actions"><button className="button secondary" onClick={() => save("quiz")}>Edit</button><button className="button" onClick={() => save("connections")}>Looks right — continue</button></div>
  </OnboardingFrame>;

  if (step === "connections") return <OnboardingFrame current={4} title="Now let’s connect your business" description="Connections can give BRANDOS real context later. Nothing is connected until you verify it yourself.">
    <div className="connection-setup"><div><strong>No sources connected</strong><p>There are no implemented connections in this foundation yet. You can continue and add them later.</p></div><span className="status-badge status-neutral">Not connected</span></div>
    <div className="product-actions"><button className="button secondary" onClick={() => save("map")}>Back</button><button className="button" onClick={() => save("goal")}>Skip for now</button></div>
  </OnboardingFrame>;

  if (step === "goal") return <OnboardingFrame current={5} title="What would make the next period a success?" description="Choose one primary goal. You can change it later." saved={saved}>
    <div className="choice-grid">{goals.map((goal) => <button type="button" className={answers.goal === goal ? "choice-card is-selected" : "choice-card"} key={goal} onClick={() => setAnswers({ ...answers, goal })}>{goal}</button>)}</div>
    <label className="field-label">Timeframe <span>Optional</span><input value={answers.timeframe ?? ""} onChange={(event) => setAnswers({ ...answers, timeframe: event.target.value })} placeholder="For example, the next 90 days" /></label>
    <div className="product-actions"><button className="button secondary" onClick={() => save("connections")}>Back</button><button className="button" disabled={!answers.goal} onClick={() => save("building")}>Set primary goal</button></div>
  </OnboardingFrame>;

  if (step === "building") return <OnboardingFrame current={6} title="Your foundation is ready to review" description="BRANDOS cannot analyze connected data or generate a personalized plan until real sources are available. No analysis has been simulated." saved={saved}>
    <div className="build-list"><div>✓ Business context captured</div><div>— Connections waiting for setup</div><div>— Journey waiting for verified information</div></div>
    <div className="product-actions"><button className="button" onClick={() => save("journey")}>Review what comes next</button></div>
  </OnboardingFrame>;

  if (step === "journey") return <OnboardingFrame current={7} title="Your journey will start with understanding" description={`Primary goal: ${answers.goal ?? "Not set"}. The first milestone will be created when BRANDOS has enough verified business context.`} saved={saved}>
    <div className="journey-preview"><div className="journey-node is-current"><span>01</span><div><strong>Clarify the current state</strong><p>Waiting for enough real information to define the first meaningful action.</p></div><span className="status-badge status-pending">Waiting for context</span></div><div className="journey-line" /><div className="journey-node"><span>02</span><div><strong>Choose the next priority</strong><p>Will appear after the first milestone is understood.</p></div><span className="status-badge status-neutral">Locked</span></div></div>
    <div className="product-actions"><button className="button" onClick={() => save("mission")}>See first mission</button></div>
  </OnboardingFrame>;

  return <OnboardingFrame current={8} title="Your first mission is waiting for context" description="A mission should be based on real evidence. BRANDOS will not invent work or outcomes while your setup is incomplete." saved={saved}>
    <div className="mission-panel"><span className="kicker">Mission 01</span><h2>Understand where you are starting</h2><p>Waiting for verified business information before a meaningful mission can be created.</p><span className="status-badge status-pending">Waiting for connection</span></div>
    <div className="product-actions"><Link className="button" href="/dashboard/today">Go to Today</Link><button className="button secondary" onClick={() => save("connections")}>Connect a source</button></div>
  </OnboardingFrame>;
}

function OnboardingFrame({ current, title, description, children, saved }: { current: number; title: string; description: string; children: React.ReactNode; saved?: boolean }) {
  return <main className="onboarding-product"><header className="onboarding-top"><Link className="product-brand" href="/"><span className="mark">B<span>·</span></span><span>BRANDOS</span></Link>{saved ? <span className="draft-saved" role="status">Draft saved</span> : <Link className="text-link" href="/dashboard/today">Pause setup</Link>}</header><div className="onboarding-progress"><span>SETUP</span><strong>0{current}</strong><div><i style={{ width: `${Math.round((current / 8) * 100)}%` }} /></div></div><section className="onboarding-card"><p className="kicker">Step {current} of 8</p><h1>{title}</h1><p className="product-lede">{description}</p>{children}</section></main>;
}
