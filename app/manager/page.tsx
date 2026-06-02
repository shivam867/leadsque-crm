"use client";
import StatCard from "@/components/ui/StatCard";
import { salesReps, managerDashboard, leads, escalations } from "@/data/dummy";
import Link from "next/link";

export default function ManagerDashboard() {
  return (
    <div className="p-7 max-w-6xl flex flex-col gap-7">

      {/* Header */}
      <div className="animate-fade-up flex items-start justify-between">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            Team Alpha · Manager View
          </p>
          <h1 className="page-title">Team Overview</h1>
          <p className="page-subtitle">
            <span style={{ color: "#DC2626", fontWeight: 600 }}>
              {managerDashboard.escalations} escalations
            </span>{" "}
            need your attention today.
          </p>
        </div>
        <Link href="/manager/escalations">
          <button className="btn-primary" style={{ background: "#DC2626", boxShadow: "0 1px 3px rgba(220,38,38,.3)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            View Escalations ({managerDashboard.escalations})
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Leads",      value: managerDashboard.totalLeads,  delay: "0ms",   color: undefined },
          { label: "Calls Today",      value: managerDashboard.callsToday,  delay: "40ms",  color: "#0369A1" },
          { label: "Won This Month",   value: managerDashboard.callsToday,  delay: "80ms",  color: "#059669", sub: `${managerDashboard.teamConversionRate}% conversion`, trend: "up" as const },
          { label: "Overdue Tasks",    value: managerDashboard.overdue,     delay: "120ms", color: "#DC2626", sub: `${managerDashboard.escalations} escalations` },
        ].map((s, i) => (
          <div key={s.label} className="animate-fade-up" style={{ animationDelay: s.delay }}>
            <StatCard
              label={s.label}
              value={s.value}
              sub={s.sub}
              accentColor={s.color}
              trend={s.trend}
              trendValue={s.trend ? "8%" : undefined}
              icon={
                i === 0 ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                : i === 1 ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.18 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 5.55 5.55l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>
                : i === 2 ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              }
            />
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div
        className="animate-fade-up"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gridTemplateRows: "1fr",
          gap: 20,
          height: 460,
          animationDelay: "80ms",
        }}
      >
        {/* Rep performance table */}
        <div className="card p-0 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{ borderBottom: "1px solid var(--border)" }}>
            <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>
              Rep Performance — Team Alpha
            </h2>
            <Link href="/manager/team" className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
              Full report →
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
                  {["Rep", "Leads", "Calls", "Won", "Conv. Rate"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "var(--text-secondary)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {salesReps.map((rep, i) => (
                  <tr key={rep.id}
                    className="animate-fade-up transition-colors cursor-pointer"
                    style={{ borderBottom: "1px solid var(--border)", animationDelay: `${Math.min(i, 8) * 30}ms` }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ""}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: "#E0F2FE", color: "#0369A1" }}>
                          {rep.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{rep.name}</div>
                          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Team {rep.team}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{rep.leadsAssigned}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>{rep.callsToday}</td>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: "#059669" }}>{rep.wonThisMonth}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--surface-2)", maxWidth: 60 }}>
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${rep.conversionRate}%`,
                              background: rep.conversionRate >= 35 ? "#059669" : rep.conversionRate >= 28 ? "#D97706" : "#DC2626",
                            }} />
                        </div>
                        <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                          {rep.conversionRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4" style={{ height: "100%" }}>

          {/* Escalations */}
          <div className="card p-5 flex flex-col flex-1 min-h-0">
            <div className="flex items-center gap-2 mb-3 flex-shrink-0">
              <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>Open Escalations</h2>
              <span className="badge" style={{ background: "#FFF1F2", color: "#DC2626", border: "1px solid #FECDD3" }}>
                {escalations.length}
              </span>
            </div>
            <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto">
              {escalations.map((e, i) => (
                <div key={e.id} className="p-3.5 rounded-xl animate-fade-up"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    animationDelay: `${Math.min(i, 5) * 40}ms`,
                  }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold font-mono" style={{ color: "var(--text-secondary)" }}>{e.id}</span>
                    <span
                      className="badge text-xs"
                      style={{
                        background: e.severity === "High" ? "#FFF1F2" : e.severity === "Medium" ? "#FFFBEB" : "#F0F9FF",
                        color: e.severity === "High" ? "#DC2626" : e.severity === "Medium" ? "#D97706" : "#0369A1",
                        border: `1px solid ${e.severity === "High" ? "#FECDD3" : e.severity === "Medium" ? "#FDE68A" : "#BAE6FD"}`,
                      }}
                    >
                      {e.severity}
                    </span>
                  </div>
                  <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{e.lead}</p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{e.reason}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Rep: {e.rep}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top performer */}
          <div className="card p-5 flex-shrink-0 animate-fade-up" style={{ animationDelay: "120ms" }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-3"
              style={{ color: "var(--text-secondary)" }}>
              Top Performer — May
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0"
                style={{ background: "#FFFBEB", color: "#D97706" }}>
                🏆
              </div>
              <div>
                <p className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                  {managerDashboard.topPerformer}
                </p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  41% conversion · 8 deals won
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}