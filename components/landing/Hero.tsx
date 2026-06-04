"use client";
import Link from "next/link";

const stats = [
  { num: "60–80%", label: "Leads lost monthly" },
  { num: "3×", label: "Conversion uplift" },
  { num: "18 AI", label: "Revenue features" },
];

const leads = [
  { initials: "VP", name: "Vinay Punganoor", child: "Saakshi", time: "Evenings 6–9 PM IST", score: 100, tags: ["HOT", "ACTIONABLE"], avatarBg: "bg-neutral-100 text-neutral-700" },
  { initials: "LR", name: "Leela Rao", child: "Tanvi Rao", time: "Evenings 6–9 PM IST", score: 100, tags: ["HOT"], avatarBg: "bg-sky-100 text-sky-700" },
  { initials: "RK", name: "Ramesh Kumar", child: "Rohan Kumar", time: "Evenings 6–9 PM IST", score: 85, tags: ["FOLLOWED UP"], avatarBg: "bg-violet-100 text-violet-700" },
  { initials: "MD", name: "Mohan Das", child: "Rohan Das", time: "Evenings 6–9 PM IST", score: 0, tags: [], avatarBg: "bg-gray-200 text-gray-600", dim: true },
];

const tagStyle: Record<string, string> = {
  HOT: "bg-red-50 text-red-700",
  ACTIONABLE: "bg-neutral-100 text-neutral-700",
  "FOLLOWED UP": "bg-green-50 text-green-700",
};

const scoreColor = (s: number) =>
  s >= 90 ? "text-emerald-600" : s >= 50 ? "text-amber-500" : "text-gray-500";

export default function Hero() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 pt-10 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      {/* Left */}
      <div>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 animate-pulse" />
          Sales Intelligence Platform
        </div>

        <h1 className="text-4xl sm:text-5xl xl:text-[53px] font-bold text-gray-900 leading-[1.1] tracking-tight mb-5">
          Every lead. Every call.
          <br />
          <span className="text-neutral-900">Every rupee, tracked.</span>
        </h1>

        <p className="text-base text-gray-500 leading-relaxed mb-8 max-w-lg">
          LeadsQueue gives your entire sales organisation a unified system to capture,
          track, and close with optional AI-powered insights built right in.
        </p>

        <div className="flex flex-wrap gap-3 mb-12">
          <Link
            href="#plans"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-700 transition-colors text-[15px]"
          >
            Explore Features
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-8 pt-8 border-t border-gray-100">
          {stats.map((s) => (
            <div key={s.num}>
              <div className="text-2xl font-bold text-gray-900">{s.num}</div>
              <div className="text-sm text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Dashboard mock */}
      <div className="rounded-2xl border border-gray-200 shadow-xl overflow-hidden" style={{ background: "#F8F7F4" }}>
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-sm text-gray-900">Leads Queue</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100">5 HOT</span>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { val: "37", label: "Total Leads", color: "text-neutral-900" },
              { val: "5", label: "Hot Leads", color: "text-red-500" },
              { val: "0", label: "Callbacks", color: "text-amber-500" },
              { val: "0", label: "Overdue", color: "text-emerald-500" },
            ].map((k) => (
              <div key={k.label} className="bg-gray-50 rounded-xl p-3">
                <div className={`text-xl font-bold ${k.color}`}>{k.val}</div>
                <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Lead rows */}
          <div className="flex flex-col gap-2">
            {leads.map((lead) => (
              <div
                key={lead.name}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${
                  lead.dim
                    ? "bg-gray-100 border-gray-200"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${lead.avatarBg}`}>
                  {lead.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[13px] font-semibold ${lead.dim ? "text-gray-500" : "text-gray-900"}`}>{lead.name}</span>
                    {lead.tags.map((t) => (
                      <span key={t} className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${tagStyle[t]}`}>{t}</span>
                    ))}
                  </div>
                  <div className={`text-[11px] truncate ${lead.dim ? "text-gray-400" : "text-gray-400"}`}>
                    Child: {lead.child} · {lead.time}
                  </div>
                </div>
                <span className={`font-bold text-sm flex-shrink-0 ${scoreColor(lead.score)}`}>{lead.score}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Queue is live-sorted by intent score. Auto-reprioritises on engagement.
          </div>
        </div>
      </div>
    </section>
  );
}