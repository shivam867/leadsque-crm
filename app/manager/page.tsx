"use client";
import StatCard from "@/components/ui/StatCard";
import { salesReps, managerDashboard, leads, escalations } from "@/data/dummy";
import Link from "next/link";

const SEV_CONFIG = {
  High:   { bg: "var(--danger-light)",  color: "var(--danger)",  border: "var(--danger-border)" },
  Medium: { bg: "var(--warning-light)", color: "var(--warning)", border: "var(--warning-border)" },
  Low:    { bg: "var(--surface-2)",     color: "var(--text-secondary)", border: "var(--border)" },
};

const convColor = (rate: number) =>
  rate >= 35 ? "var(--success)" : rate >= 28 ? "var(--warning)" : "var(--danger)";

export default function ManagerDashboard() {
  return (
    <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Header ── */}
      <div className="animate-fade-up" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
            Team Alpha · Manager View
          </p>
          <h1 className="page-title">Team Overview</h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0 0" }}>
            <span style={{ color: "var(--danger)", fontWeight: 700 }}>
              {managerDashboard.escalations} escalations
            </span>{" "}
            need your attention today.
          </p>
        </div>
        <Link href="/manager/escalations">
          <button className="btn-secondary">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            View Escalations ({managerDashboard.escalations})
          </button>
        </Link>
      </div>

      {/* ── 4 Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[
          { label: "Total Leads",    value: managerDashboard.totalLeads, delay: "0ms",   color: undefined },
          { label: "Calls Today",    value: managerDashboard.callsToday, delay: "40ms",  color: undefined },
          { label: "Won This Month", value: managerDashboard.callsToday, delay: "80ms",  color: "var(--success)", sub: `${managerDashboard.teamConversionRate}% conversion`, trend: "up" as const },
          { label: "Overdue Tasks",  value: managerDashboard.overdue,    delay: "120ms", color: "var(--danger)",  sub: `${managerDashboard.escalations} escalations` },
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
                i === 0 ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                : i === 1 ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.18 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 5.55 5.55l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>
                : i === 2 ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              }
            />
          </div>
        ))}
      </div>

      {/* ── Main 2-col grid ── */}
      <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 12, animationDelay: "80ms" }}>

        {/* LEFT: Rep performance table */}
        <div className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)" }}>
              Rep Performance — Team Alpha
            </span>
            <Link href="/manager/team" style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              Full report →
            </Link>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                <tr style={{ background: "var(--surface-2)" }}>
                  {["Rep", "Leads", "Calls", "Won", "Conv. Rate"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "9px 18px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {salesReps.map((rep, i) => (
                  <tr key={rep.id}
                    style={{ borderTop: "1px solid var(--surface-2)", cursor: "pointer", transition: "background .12s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ""}>
                    <td style={{ padding: "10px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, background: "var(--surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                          {rep.avatar}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 12, color: "var(--text-primary)", margin: 0 }}>{rep.name}</p>
                          <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0 }}>Team {rep.team}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "10px 18px", fontWeight: 600, fontSize: 12, color: "var(--text-primary)" }}>{rep.leadsAssigned}</td>
                    <td style={{ padding: "10px 18px", fontSize: 12, color: "var(--text-secondary)" }}>{rep.callsToday}</td>
                    <td style={{ padding: "10px 18px", fontSize: 12, fontWeight: 600, color: "var(--success)" }}>{rep.wonThisMonth}</td>
                    <td style={{ padding: "10px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 4, borderRadius: 99, background: "var(--surface-3)", maxWidth: 56, overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: 99, transition: "width 0.5s", width: `${rep.conversionRate}%`, background: convColor(rep.conversionRate) }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)" }}>{rep.conversionRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: Escalations + Top Performer stacked */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Escalations */}
          <div className="card" style={{ padding: "14px 16px", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexShrink: 0 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)" }}>Open Escalations</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: "var(--danger-light)", color: "var(--danger)", border: "1px solid var(--danger-border)" }}>
                {escalations.length}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, overflowY: "auto" }}>
              {escalations.map((e, i) => {
                const cfg = SEV_CONFIG[e.severity as keyof typeof SEV_CONFIG] ?? SEV_CONFIG.Low;
                return (
                  <div key={e.id} style={{ padding: "11px 12px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "monospace", color: "var(--text-secondary)" }}>{e.id}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 4, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                        {e.severity}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 600, margin: "0 0 2px", color: "var(--text-primary)" }}>{e.lead}</p>
                    <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0 }}>{e.reason}</p>
                    <p style={{ fontSize: 10, color: "var(--text-secondary)", margin: "3px 0 0" }}>Rep: {e.rep}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Performer */}
          <div className="card" style={{ padding: "14px 16px", flexShrink: 0 }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12, color: "var(--text-muted)", margin: "0 0 12px" }}>
              Top Performer — May
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                🏆
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", margin: "0 0 2px", letterSpacing: "-0.02em" }}>
                  {managerDashboard.topPerformer}
                </p>
                <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0 }}>
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