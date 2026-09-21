"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { brandConfiguration } from "@/config/brand";
import { navItems } from "@/data/content";
import HeadMark from "./HeadMark";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <Link className="brand" href="/" onClick={() => setOpen(false)}>
        <HeadMark />
        <span>{brandConfiguration.logo}</span>
      </Link>
      <nav className={open ? "nav open" : "nav"} aria-label="Main navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={pathname === item.href ? "active" : ""}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <Link className="text-link desktop-only" href="/contact">Talk to us <span>↗</span></Link>
        <Link className="button button-small" href="/contact">Start building <span>↗</span></Link>
      </div>
      <button className="menu-button" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? "×" : "☰"}
      </button>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div>
          <Link className="brand footer-brand" href="/">
            <HeadMark />
            <span>{brandConfiguration.logo}</span>
          </Link>
          <p>A calmer way to understand what matters next.</p>
        </div>
        <div className="footer-links">
          <div>
            <b>Product</b>
            <Link href="/product">Product</Link>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/business-brain">Business Brain</Link>
          </div>
          <div>
            <b>Company</b>
            <Link href="/about">About</Link>
            <Link href="/security">Security</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
          <div>
            <b>Resources</b>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/autonomy">Autonomy</Link>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 {brandConfiguration.name}. Product concept in development.</span>
        <span>
          <Link href="/security">Privacy</Link> · <Link href="/security">Terms</Link> · <Link href="/security">Security</Link> · <Link href="/contact">Status</Link>
        </span>
      </div>
    </footer>
  );
}
