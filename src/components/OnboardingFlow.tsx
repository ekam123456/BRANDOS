"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { businessCategories, goalOptions, questionPacks, type BusinessCategory } from "@/data/product";

type Step = "intro" | "identity" | "quiz" | "map" | "connections" | "goal" | "building" | "journey" | "mission";
type Answers = { category?: BusinessCategory; name?: string; customer?: string; offer?: string; operations?: string; challenge?: string; idea?: string; problem?: string; assumption?: string; goal?: string; timeframe?: string };
type Draft = { step: Step; answers: Answers; questionIndex: number };

export default function OnboardingFlow() {
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<Answers>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [persisting, setPersisting] = useState(false);
  const [persistError, setPersistError] = useState<string>();

  useEffect(() => {
    void fetch("/api/private/onboarding")
      .then((response) => response.ok ? response.json() as Promise<{ progress?: { step: Step; draft: Answers } | null }> : null)
      .then((serverState) => {
        if (!serverState?.progress) return;
        setStep(serverState.progress.step);
        setAnswers(serverState.progress.draft);
      })
      .catch(() => undefined);
    const raw = window.localStorage.getItem("brandos-onboarding");
    if (!raw) return;
    try {
      const draft = JSON.parse(raw) as Partial<Draft>;
      if (draft.step) setStep(draft.step);
      if (draft.answers) setAnswers(draft.answers);
      if (typeof draft.questionIndex === "number") setQuestionIndex(draft.questionIndex);
    } catch {
      window.localStorage.removeItem("brandos-onboarding");
    }
  }, []);

  const questions = useMemo(() => answers.category ? questionPacks[answers.category] : [], [answers.category]);
  const currentQuestion = questions[questionIndex];

  function save(nextStep: Step, nextAnswers = answers, nextIndex = questionIndex) {
    const draft: Draft = { step: nextStep, answers: nextAnswers, questionIndex: nextIndex };
    setStep(nextStep);
    setAnswers(nextAnswers);
    setQuestionIndex(nextIndex);
    window.localStorage.setItem("brandos-onboarding", JSON.stringify(draft));
    void fetch("/api/private/onboarding", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ draft: { step: nextStep, answers: nextAnswers, questionIndex: nextIndex } }),
    }).catch(() => undefined);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  }

  function updateAnswer(id: string, value: string) {
    setAnswers((current) => ({ ...current, [id]: value }));
  }

  async function confirmMap() {
    setPersisting(true);
    setPersistError(undefined);
    try {
      const response = await fetch("/api/private/onboarding", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(body?.error ?? "Unable to save business context.");
      }
      save("connections");
    } catch (error) {
      setPersistError(error instanceof Error ? error.message : "Unable to save business context.");
    } finally {
      setPersisting(false);
    }
  }

  if (step === "intro") return <OnboardingFrame current={1} total={8} title="A clearer way to run the business" description="BRANDOS first learns what matters to you, then turns that understanding into a focused path of meaningful work." saved={saved}>
    <div className="intro-steps">{["Today — what matters now", "Business Brain — what BRANDOS knows", "Intelligence — what needs attention", "Journey — the path toward your goal", "Work — guided missions", "Connections — real business context"].map((item, index) => <div className="intro-step" key={item}><span>0{index + 1}</span><p>{item}</p></div>)}</div>
    <div className="product-actions"><button className="button" onClick={() => save("identity")}>Start with my business</button><button className="button secondary" onClick={() => save("identity")}>Explore first</button></div>
  </OnboardingFrame>;

  if (step === "identity") return <OnboardingFrame current={2} total={8} title="Let’s start with the basics" description="Just one choice first. Your answer helps BRANDOS ask more relevant questions." saved={saved}>
    <label className="field-label">What should we call the business? <span>Optional</span><input autoFocus value={answers.name ?? ""} onChange={(event) => updateAnswer("name", event.target.value)} placeholder="Business name" /></label>
    <fieldset className="quiz-fieldset"><legend className="field-label">Which description fits best?</legend><div className="choice-grid">{businessCategories.map((category) => <button type="button" className={answers.category === category.id ? "choice-card is-selected" : "choice-card"} key={category.id} onClick={() => setAnswers({ ...answers, category: category.id })}><strong>{category.label}</strong><span>{category.description}</span></button>)}</div></fieldset>
    <QuizActions back={() => save("intro")} next={() => save("quiz", answers, 0)} disabled={!answers.category} nextLabel="Continue to questions" />
  </OnboardingFrame>;

  if (step === "quiz" && currentQuestion) return <OnboardingFrame current={3} total={8} title={currentQuestion.prompt} description={`${currentQuestion.label}${answers.category === "idea" ? " — this stays a draft understanding, not validated business truth." : ""}`} saved={saved} detail={`${questionIndex + 1} of ${questions.length} questions for ${businessCategories.find((item) => item.id === answers.category)?.label ?? "your business"}`}>
    <label className="field-label"><textarea autoFocus value={answers[currentQuestion.id as keyof Answers] ?? ""} onChange={(event) => updateAnswer(currentQuestion.id, event.target.value)} placeholder={currentQuestion.placeholder} rows={5} /></label>
    <p className="skip-note">{currentQuestion.optional ? "Optional — you can continue without answering." : "You can write “I don’t know” or “Not applicable.”"}</p>
    <QuizActions back={() => questionIndex === 0 ? save("identity") : save("quiz", answers, questionIndex - 1)} next={() => questionIndex === questions.length - 1 ? save("map") : save("quiz", answers, questionIndex + 1)} disabled={!currentQuestion.optional && !answers[currentQuestion.id as keyof Answers]} nextLabel={questionIndex === questions.length - 1 ? "Review understanding" : "Continue"} />
  </OnboardingFrame>;

  if (step === "map") return <OnboardingFrame current={4} total={8} title="Here’s what we understand so far" description="This is a draft, not a verdict. Correct anything that does not sound right." saved={saved}>
    <div className="map-summary">{mapRows(answers).map(([label, value]) => <div className="summary-row" key={label}><span>{label}</span><strong>{value || "Not provided yet"}</strong></div>)}</div>
    {persistError ? <p className="form-error" role="alert">{persistError}</p> : null}
    <QuizActions back={() => save("quiz", answers, Math.max(questions.length - 1, 0))} next={confirmMap} disabled={persisting} nextLabel={persisting ? "Saving…" : "Looks right — continue"} />
  </OnboardingFrame>;

  if (step === "connections") return <OnboardingFrame current={5} total={8} title="Now let’s connect your business" description="Connections can give BRANDOS real context later. Nothing is connected until you verify it yourself.">
    <div className="connection-setup"><div><strong>No sources connected</strong><p>There are no implemented connections in this foundation yet. You can continue and add them later.</p></div><span className="status-badge status-neutral">Not connected</span></div>
    <QuizActions back={() => save("map")} next={() => save("goal")} nextLabel="Skip for now" />
  </OnboardingFrame>;

  if (step === "goal") return <OnboardingFrame current={6} total={8} title="What would make the next period a success?" description="Choose one primary goal. It will organize the first journey. You can change it later." saved={saved}>
    <div className="choice-grid">{goalOptions.map((goal) => <button type="button" className={answers.goal === goal ? "choice-card is-selected" : "choice-card"} key={goal} onClick={() => updateAnswer("goal", goal)}>{goal}</button>)}</div>
    <label className="field-label">Timeframe <span>Optional</span><input value={answers.timeframe ?? ""} onChange={(event) => updateAnswer("timeframe", event.target.value)} placeholder="For example, the next 90 days" /></label>
    <QuizActions back={() => save("connections")} next={() => save("building")} disabled={!answers.goal} nextLabel="Set primary goal" />
  </OnboardingFrame>;

  if (step === "building") return <OnboardingFrame current={7} total={8} title="Your foundation is ready to review" description="BRANDOS cannot analyze connected data or generate a personalized plan until real sources are available. No analysis has been simulated." saved={saved}>
    <div className="build-list"><div>✓ Business context captured</div><div>— Connections waiting for setup</div><div>— Journey waiting for verified information</div></div>
    <div className="product-actions"><button className="button" onClick={() => save("journey")}>Review what comes next</button></div>
  </OnboardingFrame>;

  if (step === "journey") return <OnboardingFrame current={8} total={8} title="Your journey will start with understanding" description={`Primary goal: ${answers.goal ?? "Not set"}. The first milestone will be created when BRANDOS has enough verified business context.`} saved={saved}>
    <div className="journey-preview"><div className="journey-node is-current"><span>01</span><div><strong>Clarify the current state</strong><p>Waiting for enough real information to define the first meaningful action.</p></div><span className="status-badge status-pending">Waiting for context</span></div><div className="journey-line" /><div className="journey-node"><span>02</span><div><strong>Choose the next priority</strong><p>Will appear after the first milestone is understood.</p></div><span className="status-badge status-neutral">Locked</span></div></div>
    <div className="product-actions"><button className="button" onClick={() => save("mission")}>See first mission</button></div>
  </OnboardingFrame>;

  return <OnboardingFrame current={8} total={8} title="Your first mission is waiting for context" description="A mission should be based on real evidence. BRANDOS will not invent work or outcomes while your setup is incomplete." saved={saved}>
    <div className="mission-panel"><span className="kicker">Mission 01</span><h2>Understand where you are starting</h2><p>Waiting for verified business information before a meaningful mission can be created.</p><span className="status-badge status-pending">Waiting for connection</span></div>
    <div className="product-actions"><Link className="button" href="/dashboard/today">Go to Today</Link><button className="button secondary" onClick={() => save("connections")}>Connect a source</button></div>
  </OnboardingFrame>;
}

function mapRows(answers: Answers): Array<[string, string | undefined]> {
  const isIdea = answers.category === "idea";
  return [
    [isIdea ? "Business idea" : "What you do", answers.offer || answers.idea],
    ["Who you serve", answers.customer],
    [isIdea ? "Problem to solve" : "How you operate", answers.problem || answers.operations],
    ["Current challenges", answers.challenge],
    [isIdea ? "Open questions" : "Current state", answers.assumption || (answers.category ? "Early understanding — more context is still needed" : undefined)],
  ];
}

function QuizActions({ back, next, disabled, nextLabel = "Continue" }: { back: () => void; next: () => void; disabled?: boolean; nextLabel?: string }) {
  return <div className="product-actions"><button className="button secondary" onClick={back}>Back</button><button className="button" disabled={disabled} onClick={next}>{nextLabel}</button></div>;
}

function OnboardingFrame({ current, total, title, description, children, saved, detail }: { current: number; total: number; title: string; description: string; children: React.ReactNode; saved?: boolean; detail?: string }) {
  return <main className="onboarding-product"><header className="onboarding-top"><Link className="product-brand" href="/"><span className="mark">B<span>·</span></span><span>BRANDOS</span></Link>{saved ? <span className="draft-saved" role="status">Draft saved</span> : <Link className="text-link" href="/dashboard/today">Pause setup</Link>}</header><div className="onboarding-progress"><span>SETUP</span><strong>0{current}</strong><div><i style={{ width: `${Math.round((current / total) * 100)}%` }} /></div></div><section className="onboarding-card"><p className="kicker">Step {current} of {total}</p><h1>{title}</h1><p className="product-lede">{description}</p>{detail ? <p className="onboarding-detail">{detail}</p> : null}{children}</section></main>;
}
