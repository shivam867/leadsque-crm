"use client";

import Link from "next/link";
import { TrendingUp, Clock, ShieldCheck } from "lucide-react";

const trustPoints = [
  { icon: TrendingUp, text: "3× average conversion uplift" },
  { icon: Clock, text: "Live in under 48 hours" },
  { icon: ShieldCheck, text: "No lock-in, cancel anytime" },
];

const roleButtons = [
  {
    href: "/rep",
    title: "Sales Rep",
    className:
      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100",
  },
  {
    href: "/manager",
    title: "Team Leader",
    className:
      "bg-green-50 hover:bg-green-100 text-green-800 border border-green-200",
  },
  {
    href: "/director",
    title: "Director",
    className:
      "bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200",
  },
];

export default function CTA() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Soft glow */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(99,102,241,0.12), transparent 70%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse inline-block" />
          <span className="text-xs font-bold tracking-widest uppercase text-indigo-700">
            Stop the leakage today
          </span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-5">
          98% of your leads are leaving.
          <br />
          <span className="text-indigo-600">LeadFlow brings them back.</span>
        </h2>

        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10">
          Set up in one day. No CRM migration required. See every lead, every
          call, and every rupee — with optional AI that compounds over time.
        </p>

        {/* Trust points */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
          {trustPoints.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-gray-500">
              <Icon size={15} className="text-indigo-600 flex-shrink-0" />
              {text}
            </div>
          ))}
        </div>

        {/* Role label */}
        <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-3.5">
          Choose your role to get started
        </p>

        {/* Role buttons */}
        {/* Role buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {roleButtons.map(({ href, title, className }) => (
            <Link
              key={href}
              href={href}
              className={`inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-[15px] transition-all duration-200 ${className}`}
            >
              <span>{title}</span>

              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-[1px]"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        <p className="text-xs text-gray-400">
          No credit card required · Free demo access · Works with LeadSquared,
          Meritto & Zoho
        </p>
      </div>
    </section>
  );
}