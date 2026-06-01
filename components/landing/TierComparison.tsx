"use client";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Feature = {
  label: string;
  basic: boolean | string;
  ai: boolean | string;
};

type Tier = {
  id: "basic" | "ai";
  name: string;
  tagline: string;
  badge?: string;
  badgeColor?: string;
  accent: string;
  iconBg: string;
  borderTop: string;
  description: string;
  price: string;
  priceNote: string;
  highlights: string[];
  icon: React.ReactNode;
};

// ─── Data ────────────────────────────────────────────────────────────────────

const tiers: Tier[] = [
  {
    id: "basic",
    name: "LeadFlow Basic",
    tagline: "Structured sales ops",
    accent: "#0EA5E9",
    iconBg: "bg-sky-50",
    borderTop: "border-t-sky-500",
    description:
      "Everything a growing coaching institute needs to stop losing leads to disorganisation — pipeline stages, follow-up tracking, team assignment, and clean reporting.",
    price: "Foundation",
    priceNote: "For teams getting organised",
    highlights: [
      "Lead capture — manual & CSV upload",
      "Pipeline stages: New → Won / Lost",
      "Manual & round-robin assignment",
      "Activity timeline per lead",
      "Call outcome buttons (No answer, Interested…)",
      "Follow-up reminders & daily task list",
      "Overdue follow-up alerts",
      "Search & filter by status, rep, source",
      "Dashboard: conversion, calls, pipeline",
      "4 lead sources: website, call, walk-in, social",
    ],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    id: "ai",
    name: "LeadFlow AI",
    tagline: "Intelligent conversation layer",
    badge: "Most Popular",
    badgeColor: "bg-indigo-100 text-indigo-700",
    accent: "#4F46E5",
    iconBg: "bg-indigo-50",
    borderTop: "border-t-indigo-600",
    description:
      "Everything in Basic, plus AI that listens to every counselor call, summarises it, scores the lead, and tells the rep exactly what to do next — all automatically.",
    price: "Intelligence",
    priceNote: "For teams that want AI coaching",
    highlights: [
      "Everything in Basic",
      "AI call summary after every call",
      "Customer intent detection from transcript",
      "Next-action suggestions post-call",
      "AI lead scoring: Hot / Medium / Cold",
      "Best time to call — per lead",
      "Counselor talk-ratio analysis",
      "Auto-generated follow-up messages",
      "Objection detection & tagging",
      "Student + parent profile per lead",
    ],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M12 6v6l4 2" />
        <circle cx="19" cy="5" r="3" />
      </svg>
    ),
  },
];

const comparisonFeatures: Feature[] = [
  { label: "Lead capture & pipeline", basic: true, ai: true },
  { label: "Follow-up reminders", basic: true, ai: true },
  { label: "Team assignment & reassignment", basic: true, ai: true },
  { label: "Activity timeline per lead", basic: true, ai: true },
  { label: "Dashboard & analytics", basic: true, ai: true },
  { label: "AI call summaries", basic: false, ai: true },
  { label: "AI lead scoring (Hot/Medium/Cold)", basic: false, ai: true },
  { label: "Best time to call — per lead", basic: false, ai: true },
  { label: "Counselor talk-ratio analysis", basic: false, ai: true },
  { label: "Auto-generated follow-up messages", basic: false, ai: true },
  { label: "Objection detection & tagging", basic: false, ai: true },
  { label: "Student + parent profile per lead", basic: false, ai: true },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill={color} fillOpacity="0.12" />
      <path d="M5 8l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill="#94A3B8" fillOpacity="0.1" />
      <path d="M10 6l-4 4M6 6l4 4" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function TierComparison() {
  const [activeTab, setActiveTab] = useState<"cards" | "table">("cards");
  const [selectedTier, setSelectedTier] = useState<"basic" | "ai">("ai");

  return (
    <section id="plans" className="py-24">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-600">Two Modes</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Start simple. Scale to intelligence.
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            One platform, two power levels. Every institute starts with a solid foundation — and unlocks AI features as they grow.
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
            {(["cards", "table"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === t
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "cards" ? "Feature Cards" : "Compare All"}
              </button>
            ))}
          </div>
        </div>

        {/* Cards View */}
        {activeTab === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`relative flex flex-col rounded-2xl border border-t-4 ${tier.borderTop} transition-all duration-200 cursor-pointer overflow-hidden ${
                  selectedTier === tier.id
                    ? "shadow-xl border-gray-200 scale-[1.01]"
                    : "border-gray-200 shadow-sm hover:shadow-md"
                }`}
                style={{ background: selectedTier === tier.id ? "#FAFBFF" : "#F8F7F4" }}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute top-4 right-4">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${tier.badgeColor}`}>
                      {tier.badge}
                    </span>
                  </div>
                )}

                {/* Card body */}
                <div className="flex-1 p-6">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${tier.iconBg}`} style={{ color: tier.accent }}>
                    {tier.icon}
                  </div>

                  <div className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: tier.accent }}>
                    {tier.price}
                  </div>
                  <h3 className="text-[18px] font-extrabold text-gray-900 mb-1">{tier.name}</h3>
                  <p className="text-[13px] font-semibold text-gray-400 mb-4">{tier.priceNote}</p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">{tier.description}</p>

                  {/* Features */}
                  <ul className="space-y-2.5">
                    {tier.highlights.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[13px] text-gray-700">
                        <span className="mt-[2px] flex-shrink-0">
                          <CheckIcon color={tier.accent} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div
                  className="px-6 py-4 border-t border-gray-100 flex items-center justify-between"
                  style={{ background: selectedTier === tier.id ? `${tier.accent}08` : "transparent" }}
                >
                  <span className="text-[13px] font-semibold" style={{ color: tier.accent }}>
                    {selectedTier === tier.id ? "✓ Selected" : "View details"}
                  </span>
                  <svg className="w-4 h-4" style={{ color: tier.accent }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comparison Table */}
        {activeTab === "table" && (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm max-w-3xl mx-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-5 text-sm font-bold text-gray-500 w-1/2">Feature</th>
                  {tiers.map((t) => (
                    <th key={t.id} className="px-4 py-5 text-center">
                      <div className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: t.accent }}>
                        {t.id === "basic" ? "Basic" : "AI"}
                      </div>
                      <div className="text-sm font-bold text-gray-900">{t.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((f, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-50/50" : "bg-white"}>
                    <td className="px-6 py-3.5 text-sm text-gray-700 font-medium">{f.label}</td>
                    {(["basic", "ai"] as const).map((tid) => {
                      const tier = tiers.find((t) => t.id === tid)!;
                      const val = f[tid];
                      return (
                        <td key={tid} className="px-4 py-3.5 text-center">
                          {val === true ? (
                            <span className="inline-flex justify-center">
                              <CheckIcon color={tier.accent} />
                            </span>
                          ) : val === false ? (
                            <span className="inline-flex justify-center"><XIcon /></span>
                          ) : (
                            <span className="text-xs font-medium text-gray-600">{val}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}