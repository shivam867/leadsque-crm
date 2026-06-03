"use client";
import StatCard from "@/components/ui/StatCard";
import { salesReps, managerDashboard, leads, escalations } from "@/data/dummy";
import Link from "next/link";

const SEV_CONFIG = {
  High:   { bg: "var(--danger-light)",  color: "var(--danger)",  border: "var(--danger-border)" },
  Medium: { bg: "var(--warning-light)", color: "var(--warning)", border: "var(--warning-border)" },
  Low:    { bg: "var(--info-light)",    color: "var(--info)",    border: "var(--info-border)" },
};

const convColor = (rate: number) =>
  rate >= 35 ? "var(--success)" : rate >= 28 ? "var(--warning)" : "var(--danger)";

export default function ManagerDashboard() {
  return (
    <div style={{ padding: 28, maxWidth: 1080, display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Header */}
      <div className="animate-fade-up" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, color: "var(--text-secondary)" }}>
            Team Alpha · Manager View
          </p>
          <h1 className="page-title">Team Overview</h1>
          <p className="page-subtitle">
            <span style={{ color: "var(--danger)", fontWeight: 600 }}>
              {managerDashboard.escalations} escalations
            </span>{" "}
            need your attention today.
          </p>
        </div>
        <Link href="/manager/escalations">
          <button className="btn-primary" style={{ background: "var(--danger)", boxShadow: "0 1px 3px rgba(220,38,38,.3)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            View Escalations ({managerDashboard.escalations})
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { label: "Total Leads",     value: managerDashboard.totalLeads, delay: "0ms",   color: undefined },
          { label: "Calls Today",     value: managerDashboard.callsToday, delay: "40ms",  color: "var(--info)" },
          { label: "Won This Month",  value: managerDashboard.callsToday, delay: "80ms",  color: "var(--success)", sub: `${managerDashboard.teamConversionRate}% conversion`, trend: "up" as const },
          { label: "Overdue Tasks",   value: managerDashboard.overdue,    delay: "120ms", color: "var(--danger)", sub: `${managerDashboard.escalations} escalations` },
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
      <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, height: 460, animationDelay: "80ms" }}>

        {/* Rep performance table */}
        <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            <h2 style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)", margin: 0 }}>
              Rep Performance — Team Alpha
            </h2>
            <Link href="/manager/team" style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", textDecoration: "none" }}>
              Full report →
            </Link>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
              <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
                  {["Rep", "Leads", "Calls", "Won", "Conv. Rate"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {salesReps.map((rep, i) => (
                  <tr key={rep.id}
                    className="animate-fade-up"
                    style={{ borderBottom: "1px solid var(--border)", cursor: "pointer", transition: "background .12s", animationDelay: `${Math.min(i, 8) * 30}ms` }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ""}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, background: "var(--info-light)", color: "var(--info)" }}>
                          {rep.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 13, color: "var(--text-primary)" }}>{rep.name}</div>
                          <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Team {rep.team}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>{rep.leadsAssigned}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-secondary)" }}>{rep.callsToday}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "var(--success)" }}>{rep.wonThisMonth}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 6, borderRadius: 99, background: "var(--surface-3)", maxWidth: 60, overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: 99, transition: "width 0.5s", width: `${rep.conversionRate}%`, background: convColor(rep.conversionRate) }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>{rep.conversionRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%" }}>

          {/* Escalations */}
          <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexShrink: 0 }}>
              <h2 style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)", margin: 0 }}>Open Escalations</h2>
              <span className="badge" style={{ background: "var(--danger-light)", color: "var(--danger)", border: "1px solid var(--danger-border)" }}>
                {escalations.length}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, overflowY: "auto" }}>
              {escalations.map((e, i) => {
                const cfg = SEV_CONFIG[e.severity as keyof typeof SEV_CONFIG] ?? SEV_CONFIG.Low;
                return (
                  <div key={e.id} className="animate-fade-up" style={{ padding: 14, borderRadius: 11, background: "var(--surface-2)", border: "1px solid var(--border)", animationDelay: `${Math.min(i, 5) * 40}ms` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "monospace", color: "var(--text-secondary)" }}>{e.id}</span>
                      <span className="badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                        {e.severity}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, color: "var(--text-primary)" }}>{e.lead}</p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>{e.reason}</p>
                    <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4, marginBottom: 0 }}>Rep: {e.rep}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top performer */}
          <div className="card animate-fade-up" style={{ padding: 20, flexShrink: 0, animationDelay: "120ms" }}>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12, color: "var(--text-secondary)" }}>
              Top Performer — May
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, background: "var(--warning-light)", color: "var(--warning)" }}>
                🏆
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 17, color: "var(--text-primary)", margin: "0 0 2px" }}>
                  {managerDashboard.topPerformer}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>
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