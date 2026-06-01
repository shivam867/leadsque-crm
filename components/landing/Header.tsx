"use client";
import Link from "next/link";
import { useState } from "react";
import { Activity } from "lucide-react";

const navLinks = [
  { label: "Roles", href: "#role-selector" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#plans" },
];

function scrollToSection(href: string) {
  if (!href.startsWith("#")) return;
  const id = href.slice(1);
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b border-gray-200" style={{ background: "rgba(248,247,244,0.9)" }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Activity size={15} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">LeadQueue</span>
        </Link>

        {/* Center nav — desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, href }) => (
            <button
              key={label}
              onClick={() => scrollToSection(href)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* <Link
            href="/sign-in"
            className="hidden md:inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Sign In
          </Link> */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Demo Mode
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            ) : (
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-6 py-3 flex flex-col gap-1" style={{ background: "#F8F7F4" }}>
          {navLinks.map(({ label, href }) => (
            <button
              key={label}
              onClick={() => { scrollToSection(href); setMenuOpen(false); }}
              className="text-left px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}