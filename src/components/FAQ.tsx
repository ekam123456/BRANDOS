"use client";
import { useState } from "react";
import { faqs } from "@/data/content";
export default function FAQ() { const [active, setActive] = useState<number | null>(null); return <div className="faq-list">{faqs.map(([q, a], i) => <div className="faq-item" key={q}><button onClick={() => setActive(active === i ? null : i)} aria-expanded={active === i}><span>{q}</span><span className="faq-plus">{active === i ? "−" : "+"}</span></button>{active === i && <p>{a}</p>}</div>)}</div>; }
