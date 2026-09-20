"use client";
import { useState } from "react";
import { brandConfiguration } from "@/config/brand";
import { navItems } from "@/data/content";
import HeadMark from "./HeadMark";

export default function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><a className="brand" href="#top"><HeadMark /><span>{brandConfiguration.logo}</span></a><nav className={open ? "nav open" : "nav"} aria-label="Main navigation">{navItems.map(item => <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} onClick={() => setOpen(false)}>{item}</a>)}<a href="#faq" onClick={() => setOpen(false)}>FAQ</a></nav><div className="header-actions"><a className="text-link desktop-only" href="#how-it-works">See how it works <span>↗</span></a><a className="button button-small" href="#start">Start building <span>↗</span></a></div><button className="menu-button" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "×" : "☰"}</button></header>;
}
