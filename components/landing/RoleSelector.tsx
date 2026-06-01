// components/RoleSelector.tsx
"use client";
import Link from "next/link";

const roles = [
  {
    key: "rep",
    label: "Sales Rep",
    tagline: "Your daily command centre",
    description:
      "Capture leads, log calls, track your pipeline, and never miss a follow-up with smart reminders.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    features: [
      "Lead capture & pipeline board",
      "Call logging with quick outcomes",
      "AI lead scoring & insights",
      "Follow-up reminders & daily tasks",
    ],
    accentColor: "indigo",
    borderTop: "border-t-indigo-500",
    iconBg: "bg-indigo-50 text-indigo-600",
    taglineColor: "text-indigo-600",
    arrowHover: "group-hover:text-indigo-600",
    ctaText: "Enter as Sales Rep",
    ctaHref: "/rep",
  },
  {
    key: "manager",
    label: "Team Leader",
    tagline: "Your team, at a glance",
    description:
      "Monitor rep performance, handle escalations, assign leads intelligently, and track team targets.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    features: [
      "Team performance overview",
      "Lead assignment & reassignment",
      "Escalation management",
      "Conversion & call analytics",
    ],
    accentColor: "sky",
    borderTop: "border-t-sky-500",
    iconBg: "bg-sky-50 text-sky-600",
    taglineColor: "text-sky-600",
    arrowHover: "group-hover:text-sky-600",
    ctaText: "Enter as Team Leader",
    ctaHref: "/manager",
  },
  {
    key: "director",
    label: "Director",
    tagline: "Revenue intelligence",
    description:
      "Full revenue visibility, pipeline forecasts, team health metrics, and strategic cross-team insights.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
        <line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
    features: [
      "Revenue & forecast dashboard",
      "Cross-team analytics & rankings",
      "Pipeline health & hot leads",
      "Top-line KPIs & growth metrics",
    ],
    accentColor: "violet",
    borderTop: "border-t-violet-500",
    iconBg: "bg-violet-50 text-violet-600",
    taglineColor: "text-violet-600",
    arrowHover: "group-hover:text-violet-600",
    ctaText: "Enter as Director",
    ctaHref: "/director",
  },
];

export default function RoleSelector() {
  return (
    <section id="role-selector" className="max-w-6xl mx-auto px-6 pb-24">
      {/* Section header */}
      <div className="text-center mb-10">
        <p className="text-xs font-bold tracking-[0.18em] uppercase text-gray-400">
          Choose your role to enter
        </p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {roles.map((role) => (
          <Link
            key={role.key}
            href={role.ctaHref}
            className={`group flex flex-col rounded-2xl border border-gray-200 border-t-4 ${role.borderTop} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}
            style={{ background: "#F8F7F4" }}
          >
            {/* Card body */}
            <div className="flex-1 p-6">
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${role.iconBg}`}>
                {role.icon}
              </div>

              {/* Title + tagline */}
              <h3 className="text-[17px] font-bold text-gray-900 mb-1">{role.label}</h3>
              <p className={`text-[13px] font-semibold mb-3 ${role.taglineColor}`}>{role.tagline}</p>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{role.description}</p>

              {/* Feature list */}
              <ul className="flex flex-col gap-2">
                {role.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-gray-600">
                    <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <span className="text-[13px] font-medium text-gray-500">{role.ctaText}</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-colors ${role.arrowHover} group-hover:translate-x-0.5 transition-transform duration-150`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-center text-[12px] text-gray-400 mt-8">
        All data is for demonstration purposes only.
      </p>
    </section>
  );
}