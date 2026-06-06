"use client";

import {
  Activity,
  Lock,
  ShieldCheck,
} from "lucide-react";

import Link from "next/link";

// Reuse the same scroll logic from header
function scrollToSection(href: string) {
  if (!href.startsWith("#")) return;
  const id = href.slice(1);
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

const footerLinks = [
  { label: "Roles", href: "#role-selector" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#plans" },
];

export default function Footer() {
  return (
    <footer
      className="border-t border-gray-200"
      style={{ background: "rgba(248,247,244,0.9)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Logo & Brand - matches header exactly */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
            <Activity size={15} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">
            LeadsQueue
          </span>
        </Link>

        {/* Footer Navigation Links - consistent with header nav */}
        <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          {footerLinks.map(({ label, href }) => (
            <button
              key={label}
              onClick={() => scrollToSection(href)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Security badges & copyright row */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Lock size={12} className="text-gray-400" />
            Secure role-based access
          </span>
          <span className="text-gray-300 hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-gray-400" />
            All data encrypted in transit
          </span>
          <span className="text-gray-400 ml-0 sm:ml-2">
            © {new Date().getFullYear()} LeadsQueue
          </span>
        </div>
      </div>
    </footer>
  );
}