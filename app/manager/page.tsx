"use client";
import StatCard from "@/components/ui/StatCard";
import { salesReps, managerDashboard, leads, escalations } from "@/data/dummy";
import Link from "next/link";

export default function ManagerDashboard() {
  const alphaReps = salesReps.filter((r) => r.team === "Alpha");

  return (
    <div className="p-7 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-fade-up">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: "#374151" }}>Team Alpha · Manager View</p>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text-primary)", fontFamily: "'Syne', sans-serif" }}>
            Team Overview
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            <span style={{ color: "#DC2626", fontWeight: 600 }}>{managerDashboard.escalations} escalations</span> need your attention today.
          </p>
        </div>
        <Link href="/manager/escalations">
          <button className="btn-primary" style={{ background: "#DC2626" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            View Escalations ({managerDashboard.escalations})
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Total Leads" value={managerDashboard.totalLeads} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>} delay="0ms" />
        <StatCard label="Calls Today" value={managerDashboard.callsToday} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.18 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 5.55 5.55l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>} delay="60ms" accentColor="#0369A1" />
        <StatCard label="Won This Month" value={managerDashboard.wonThisMonth} sub={`${managerDashboard.teamConversionRate}% conversion`} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>} delay="120ms" accentColor="#059669" trend="up" trendValue="8%" />
        <StatCard label="Overdue Tasks" value={managerDashboard.overdue} sub={`${managerDashboard.escalations} escalations`} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>} delay="180ms" accentColor="#DC2626" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Team performance table */}
        <div className="lg:col-span-2 card overflow-hidden animate-fade-up delay-200">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>Rep Performance — Team Alpha</h2>
            <Link href="/manager/team" className="text-xs font-medium" style={{ color: "#0369A1" }}>Full report →</Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
                {["Rep", "Leads", "Calls", "Won", "Conv. Rate"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#374151" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {salesReps.map((rep, i) => (
                <tr key={rep.id} style={{ borderBottom: "1px solid var(--border)", animationDelay: `${200 + i * 50}ms` }} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: "#E0F2FE", color: "#0369A1" }}>
                        {rep.avatar}
                      </div>
                      <div>
                        <div className="font-medium" style={{ color: "var(--text-primary)" }}>{rep.name}</div>
                        <div className="text-xs" style={{ color: "#374151" }}>Team {rep.team}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{ color: "var(--text-primary)" }}>{rep.leadsAssigned}</td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{rep.callsToday}</td>
                  <td className="px-4 py-3" style={{ color: "#059669", fontWeight: 600 }}>{rep.wonThisMonth}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--surface-2)", maxWidth: 60 }}>
                        <div className="h-full rounded-full" style={{ width: `${rep.conversionRate}%`, background: rep.conversionRate >= 35 ? "#059669" : rep.conversionRate >= 28 ? "#D97706" : "#DC2626" }} />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{rep.conversionRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Escalations */}
          <div className="card p-5 animate-fade-up delay-250">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>Open Escalations</h2>
              <span className="badge" style={{ background: "#FFF1F2", color: "#DC2626", border: "1px solid #FECDD3" }}>{escalations.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              {escalations.map((e) => (
                <div key={e.id} className="p-3.5 rounded-xl" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold" style={{ color: "#374151" }}>{e.id}</span>
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
                  <p className="text-sm font-medium mb-0.5" style={{ color: "var(--text-primary)" }}>{e.lead}</p>
                  <p className="text-xs" style={{ color: "#374151" }}>{e.reason}</p>
                  <p className="text-xs mt-1.5" style={{ color: "#374151" }}>Rep: {e.rep}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top performer */}
          <div className="card p-5 animate-fade-up delay-300">
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#374151" }}>Top Performer — May</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold" style={{ background: "#FFFBEB", color: "#D97706" }}>
                🏆
              </div>
              <div>
                <p className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{managerDashboard.topPerformer}</p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>41% conversion · 8 deals won</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
