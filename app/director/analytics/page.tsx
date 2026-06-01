"use client";
import { salesReps } from "@/data/dummy";

const teamSummary = [
  { team: "Alpha", leads: 55, won: 17, conversion: 31, calls: 40, color: "#1a56db" },
  { team: "Beta",  leads: 46, won: 14, conversion: 33, calls: 34, color: "#7e3af2" },
  { team: "Gamma", leads: 22, won: 8,  conversion: 36, calls: 16, color: "#0e9f6e" },
];

export default function DirectorAnalytics() {
  return (
    <div className="p-7 max-w-5xl">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-secondary)" }}>
          Cross-team performance overview
        </p>
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}
        >
          Team Analytics
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
          May 2025
        </p>
      </div>

      {/* Team breakdown cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
        {teamSummary.map((team, i) => (
          <div
            key={team.team}
            className="card p-5 animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Team header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: team.color }} />
              <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                Team {team.team}
              </h3>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "Leads",  value: team.leads,            color: undefined },
                { label: "Won",    value: team.won,              color: "#0e9f6e" },
                { label: "Calls",  value: team.calls,            color: undefined },
                { label: "Rate",   value: `${team.conversion}%`, color: team.color },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="p-2.5 rounded-xl"
                  style={{ background: "var(--surface-2)" }}
                >
                  <p className="text-xs mb-0.5" style={{ color: "var(--text-secondary)" }}>
                    {label}
                  </p>
                  <p
                    className="font-bold text-xl"
                    style={{ color: color ?? "var(--text-primary)" }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Conversion bar */}
            <div className="mt-4 pt-4" style={{ borderTop: "0.5px solid var(--border)" }}>
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color: "var(--text-secondary)" }}>Conversion rate</span>
                <span className="font-semibold" style={{ color: team.color }}>
                  {team.conversion}%
                </span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${team.conversion * 2.5}%`, background: team.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* All reps ranked */}
      <div className="card overflow-hidden animate-fade-up delay-200">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>
            All Reps — Ranked by Conversion
          </h2>
          <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>
            {salesReps.length} reps
          </span>
        </div>

        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {[...salesReps]
            .sort((a, b) => b.conversionRate - a.conversionRate)
            .map((rep, i) => (
              <div
                key={rep.id}
                className="px-5 py-3.5 flex items-center gap-4 hover:bg-stone-50 transition-colors"
              >
                {/* Rank */}
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}
                >
                  {i + 1}
                </span>

                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "#eff6ff", color: "#1a56db" }}
                >
                  {rep.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                      {rep.name}
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-md"
                      style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}
                    >
                      Team {rep.team}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div
                      className="h-1.5 rounded-full flex-1"
                      style={{ background: "var(--surface-2)", maxWidth: 100 }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${rep.conversionRate * 2}%`,
                          background: rep.conversionRate >= 35 ? "#0e9f6e" : "#e3a008",
                        }}
                      />
                    </div>
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      {rep.wonThisMonth} won · {rep.callsToday} calls
                    </span>
                  </div>
                </div>

                {/* Rate badge */}
                <span
                  className="text-lg font-bold"
                  style={{ color: rep.conversionRate >= 35 ? "#0e9f6e" : "#e3a008" }}
                >
                  {rep.conversionRate}%
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}