"use client";

import { useEffect, useRef, useState } from "react";
import {
  TrendingDown,
  Search,
  Phone,
  MessageSquareWarning,
  Flame,
} from "lucide-react";

const leakPoints = [
  {
    pct: 100,
    label: "Leads Captured",
    sublabel: "Total inbound this month",
    value: "",
    color: "#4F46E5",
    leak: null,
  },
  {
    pct: 68,
    label: "Actually Contacted",
    sublabel: "Counselors reached out",
    value: "",
    color: "#0EA5E9",
    leak: "32% never called",
  },
  {
    pct: 41,
    label: "Responded at Least Once",
    sublabel: "Parent picked up the phone",
    value: "",
    color: "#10B981",
    leak: "27% unreachable — wrong timing",
  },
  {
    pct: 18,
    label: "Followed Up Properly",
    sublabel: "More than 1 structured touchpoint",
    value: "",
    color: "#F59E0B",
    leak: "23% dropped after first call",
  },
  {
    pct: 6,
    label: "Reached Proposal Stage",
    sublabel: "Pricing or batch discussed",
    value: "",
    color: "#EF4444",
    leak: "12% lost to no context, wrong pitch",
  },
  {
    pct: 2,
    label: "Enrolled",
    sublabel: "Revenue actually collected",
    value: "",
    color: "#8B5CF6",
    leak: "4% closed — 98% of budget wasted",
  },
];

const stats = [
  {
    value: "60–80%",
    label: "of leads lost every month",
    icon: TrendingDown,
  },
  {
    value: "₹0",
    label: "visibility into why they left",
    icon: Search,
  },
  {
    value: "3×",
    label: "more calls needed without AI timing",
    icon: Phone,
  },
  {
    value: "74%",
    label: "counselors talk too much on calls",
    icon: MessageSquareWarning,
  },
];

export default function Statement() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="py-24 relative overflow-hidden"
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, black 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase text-black-600">
              The Real Problem
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            You're not losing leads.
            <br />
            <span className="text-black-500">
              You're hemorrhaging revenue.
            </span>
          </h2>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Indian coaching institutes spend lakhs acquiring leads — then
            watch 98% of them silently disappear. Here's exactly where the
            money goes.
          </p>
        </div>

        {/* Funnel */}
        <div className="mb-16" role="img" aria-label="Lead funnel chart showing conversion from 1200 leads captured down to 24 enrolled (2%)">
          <div className="max-w-2xl mx-auto space-y-3">
            {leakPoints.map((step, i) => (
              <div key={i} className="relative">
                {/* Leak label */}
                {step.leak && (
                  <div
                    className="text-right mb-1 pr-2 transition-all duration-700"
                    style={{
                      opacity: visible ? 1 : 0,
                      transitionDelay: `${i * 150 + 400}ms`,
                      transform: visible
                        ? "translateX(0)"
                        : "translateX(20px)",
                    }}
                  >
                    <span className="text-xs text-red-500 font-medium">
                      ↗ {step.leak}
                    </span>
                  </div>
                )}

                {/* Bar row */}
                <div className="flex items-center gap-3">
                  {/* Label */}
                  <div className="w-28 sm:w-40 flex-shrink-0 text-right">
                    <div className="text-xs font-semibold text-gray-800 leading-tight">
                      {step.label}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {step.sublabel}
                    </div>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 h-10 bg-gray-100 rounded-xl overflow-hidden relative">
                    <div
                      className="h-full rounded-xl flex items-center justify-end pr-3 transition-all duration-1000 ease-out shadow-sm"
                      style={{
                        width: visible ? `${step.pct}%` : "0%",
                        backgroundColor: step.color,
                        transitionDelay: `${i * 150}ms`,
                      }}
                    >
                      <span className="text-xs font-bold text-white hidden sm:block">
                        {step.value}
                      </span>
                    </div>
                  </div>

                  {/* Percent */}
                  <div className="w-12 flex-shrink-0">
                    <span
                      className="text-sm font-bold transition-all duration-700"
                      style={{
                        color: step.color,
                        opacity: visible ? 1 : 0,
                        transitionDelay: `${i * 150 + 600}ms`,
                      }}
                    >
                      {step.pct}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom call-out */}
          <div className="max-w-2xl mx-auto mt-8 p-5 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-4 shadow-sm">
            <div className="p-2 rounded-xl bg-red-100">
              <Flame className="w-5 h-5 text-red-600" />
            </div>

            <div>
              <div className="text-sm font-bold text-red-700">
                Only 2% of your marketing budget creates revenue.
              </div>

              <div className="text-xs text-red-500 mt-1">
                The other 98% funds a leaky pipeline no one can see.
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;

            return (
              <div
                key={i}
                className="border border-gray-200 rounded-2xl p-5 text-center transition-all duration-700 shadow-sm hover:shadow-md"
                style={{
                  background: "#F8F7F4",
                  opacity: visible ? 1 : 0,
                  transform: visible
                    ? "translateY(0)"
                    : "translateY(24px)",
                  transitionDelay: `${i * 100 + 800}ms`,
                }}
              >
                <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-gray-700" />
                </div>

                <div className="text-2xl font-extrabold text-gray-900 mb-1">
                  {s.value}
                </div>

                <div className="text-xs text-gray-500 leading-snug">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}