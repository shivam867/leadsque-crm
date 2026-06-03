"use client";
import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  CheckCircle, Users, AlertTriangle, TrendingDown,
  Zap, Trophy, ChevronRight, X, Circle, Phone, Target, DollarSign,
} from "lucide-react";
import { directorKPIs, teamSummaries, monthlyTargets, directorAlerts, repLeaderboard } from "@/data/directordummy";
import { salesReps } from "@/data/dummy";

// Data-driven team palette
const TEAM_CHART_COLOR = "#1a56db";

const EnrollmentTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--text-primary)", border: "1px solid #3F3F46", borderRadius: 10, padding: "10px 14px", minWidth: 140 }}>
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

function KpiCard({ label, value, sub, color, bg, icon, delay = "0ms" }: {
  label: string; value: string | number; sub?: string;
  color: string; bg: string; icon: React.ReactNode; delay?: string;
}) {
  return (
    <div className="card animate-fade-up" style={{ padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 14, animationDelay: delay }}>
      <div style={{ width: 40, height: 40, borderRadius: 11, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 2px", letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0 }}>{label}</p>
        {sub && <p style={{ fontSize: 10, color, margin: "3px 0 0", fontWeight: 600 }}>{sub}</p>}
      </div>
    </div>
  );
}

// Per-alert-type colors — intentional semantic palette
const ALERT_CONFIG = {
  escalation:  { icon: AlertTriangle, color: "var(--danger)",  bg: "var(--danger-light)",  border: "var(--danger-border)" },
  performance: { icon: TrendingDown,  color: "var(--warning)", bg: "var(--warning-light)", border: "var(--warning-border)" },
  revenue:     { icon: DollarSign,    color: "var(--accent)",  bg: "var(--accent-light)",  border: "var(--accent-border)" },
  opportunity: { icon: Zap,           color: "var(--success)", bg: "var(--success-light)", border: "var(--success-border)" },
};

function AlertCard({ alert, onDismiss }: { alert: typeof directorAlerts[0]; onDismiss: () => void }) {
  const cfg      = ALERT_CONFIG[alert.type as keyof typeof ALERT_CONFIG] ?? ALERT_CONFIG.escalation;
  const IconComp = cfg.icon;
  const sevColor = alert.severity === "High" ? "var(--danger)" : alert.severity === "Medium" ? "var(--warning)" : "var(--info)";
  const sevBg    = alert.severity === "High" ? "var(--danger-light)" : alert.severity === "Medium" ? "var(--warning-light)" : "var(--info-light)";

  return (
    <div style={{ borderRadius: 12, border: `1px solid ${cfg.border}`, background: "var(--surface)", overflow: "hidden", flexShrink: 0 }}>
      <div style={{ height: 3, background: cfg.color, width: "100%" }} />
      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <IconComp size={14} style={{ color: cfg.color }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", flex: 1, lineHeight: 1.35 }}>{alert.title}</span>
          <button onClick={onDismiss} style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "2px", display: "flex", alignItems: "center", borderRadius: 4 }}>
            <X size={13} />
          </button>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: sevBg, color: sevColor }}>
            {alert.severity}
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: "var(--surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
            Team {alert.team}
          </span>
        </div>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>{alert.detail}</p>
      </div>
      <div style={{ margin: "12px 16px 14px", padding: "8px 12px", borderRadius: 8, background: cfg.bg, border: `1px solid ${cfg.border}`, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
        <ChevronRight size={13} style={{ color: cfg.color }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>{alert.action}</span>
      </div>
    </div>
  );
}

export default function DirectorDashboard() {
  const [alerts, setAlerts] = React.useState(directorAlerts);
  const topRep = repLeaderboard[0];

  const dismissAlert = (id: string) => setAlerts(prev => prev.filter(a => a.id !== id));

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, background: "var(--bg)", minHeight: "100%" }}>

      {/* Header */}
      <div className="animate-fade-up" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>
            Lead Intelligence · Director View
          </p>
          <h1 className="page-title" style={{ fontSize: 30 }}>Director Dashboard</h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
            Team health <strong style={{ color: "var(--success)" }}>{directorKPIs.teamHealth}/100</strong> ·
            {directorKPIs.activeReps} active reps ·
            <strong style={{ color: "var(--danger)" }}> {directorKPIs.openEscalations} open escalations</strong>
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 99, background: "var(--info-light)", color: "var(--info)", border: "1px solid var(--info-border)" }}>
          <Circle size={7} fill="var(--info)" color="var(--info)" />
          May 2025 · Live
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <KpiCard label="Total Leads"         value={directorKPIs.totalLeads ?? "218"}    sub="Across all 3 teams"                           color="var(--info)"    bg="var(--info-light)"    delay="0ms"   icon={<Users size={18} />} />
        <KpiCard label="Enrolled This Month" value={directorKPIs.totalWon}               sub={`${directorKPIs.conversionRate}% conversion`} color="var(--success)" bg="var(--success-light)" delay="40ms"  icon={<CheckCircle size={18} />} />
        <KpiCard label="Calls Today"         value={directorKPIs.callsToday}             sub={`${directorKPIs.activeReps} active reps`}     color="var(--accent)"  bg="var(--accent-light)"  delay="80ms"  icon={<Phone size={18} />} />
        <KpiCard label="Target Achieved"     value={`${directorKPIs.targetAchieved}%`}   sub="May 2025"                                     color="var(--warning)" bg="var(--warning-light)" delay="120ms" icon={<Target size={18} />} />
      </div>

      {/* Revenue chart + Alerts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, marginBottom: 16 }}>
        <div className="animate-fade-up card" style={{ padding: 20, animationDelay: "80ms" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Enrollments vs Target — May 2025</h2>
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "var(--info-light)", color: "var(--info)", fontWeight: 600 }}>Leads</span>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={monthlyTargets} margin={{ top: 5, right: 0, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={TEAM_CHART_COLOR} stopOpacity={0.12} />
                  <stop offset="95%" stopColor={TEAM_CHART_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<EnrollmentTooltip />} />
              <Area type="monotone" dataKey="actual" stroke={TEAM_CHART_COLOR} strokeWidth={2} fill="url(#actGrad)" name="Actual" dot={{ fill: TEAM_CHART_COLOR, r: 3 }} />
              <Area type="monotone" dataKey="target" stroke="var(--border-strong)" strokeWidth={1.5} fill="none" strokeDasharray="5 3" name="Target" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {[{ color: TEAM_CHART_COLOR, label: "Actual" }, { color: "var(--border-strong)", label: "Target", dashed: true }].map(l => (
              <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-muted)" }}>
                <span style={{ width: 20, height: 2, background: l.dashed ? "none" : l.color, display: "inline-block", borderRadius: 2, ...(l.dashed ? { borderTop: `2px dashed var(--border-strong)` } : {}) }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>

        <div className="animate-fade-up card" style={{ padding: 16, animationDelay: "120ms", display: "flex", flexDirection: "column", maxHeight: 380, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexShrink: 0 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Action Required</h2>
            <span className="badge" style={{ background: "var(--danger-light)", color: "var(--danger)", border: "1px solid var(--danger-border)" }}>
              {alerts.filter(a => a.severity === "High").length} high
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", flex: 1, paddingRight: 2 }}>
            {alerts.length === 0
              ? <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", padding: "24px 0" }}>All clear ✓</p>
              : alerts.map(a => <AlertCard key={a.id} alert={a} onDismiss={() => dismissAlert(a.id)} />)
            }
          </div>
        </div>
      </div>

      {/* Team cards + Top rep */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 260px", gap: 12, marginBottom: 16 }}>
        {teamSummaries.map((team, i) => (
          <div key={team.team} className="animate-fade-up card" style={{ padding: "16px 18px", animationDelay: `${i * 40 + 80}ms` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: team.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Team {team.team}</span>
              <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "var(--success)" }}>{team.trend}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12, padding: "8px 10px", background: "var(--surface-2)", borderRadius: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: team.bg, color: team.color, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {team.managerAvatar}
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{team.manager}</p>
                <p style={{ fontSize: 10, color: "var(--text-secondary)", margin: 0 }}>Manager · {team.reps.length} reps</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              {[
                { label: "Leads",    value: team.leads },
                { label: "Enrolled", value: team.won,              color: "var(--success)" },
                { label: "Calls",    value: team.calls },
                { label: "Conv.",    value: `${team.conversion}%`, color: team.color },
              ].map(s => (
                <div key={s.label} style={{ background: "var(--surface-2)", borderRadius: 8, padding: "8px 10px" }}>
                  <p style={{ fontSize: 10, color: "var(--text-muted)", margin: "0 0 1px" }}>{s.label}</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: s.color ?? "var(--text-primary)", margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 4 }}>
                <span style={{ color: "var(--text-muted)" }}>Target achieved</span>
                <span style={{ fontWeight: 700, color: team.color }}>{team.targetAchieved}%</span>
              </div>
              <div style={{ height: 5, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${team.targetAchieved}%`, background: team.color, borderRadius: 99, transition: "width 0.6s ease" }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Leads Won</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--success)" }}>{team.won} enrolled</span>
            </div>
          </div>
        ))}

        {/* Top Rep */}
        <div className="animate-fade-up card" style={{ padding: "16px 18px", animationDelay: "200ms" }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: 10 }}>
            Top Performer — May
          </p>
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--warning-light)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
              <Trophy size={24} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 2px" }}>{topRep.name}</p>
            <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0 }}>Team {topRep.team}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {[
              { label: "Conversion", value: `${topRep.conversionRate}%`, color: "var(--success)" },
              { label: "Enrolled",   value: topRep.wonThisMonth,         color: "var(--info)" },
              { label: "Calls",      value: topRep.callsToday,           color: undefined },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: s.color ?? "var(--text-primary)" }}>{s.value}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 4 }}>All reps ranking</p>
            {repLeaderboard.slice(0, 4).map(r => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", width: 12 }}>{r.rank}</span>
                <span style={{ fontSize: 11, color: "var(--text-primary)", flex: 1 }}>{r.name.split(" ")[0]}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: r.badgeColor }}>{r.conversionRate}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calls summary */}
      <div className="animate-fade-up card" style={{ padding: "14px 20px", animationDelay: "160ms" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: 2 }}>Today across all teams</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{directorKPIs.callsToday} calls made</p>
          </div>
          <div style={{ flex: 1, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {salesReps.map(rep => (
              <div key={rep.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: "var(--info-light)", color: "var(--info)", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {rep.avatar}
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "var(--text-muted)", margin: 0 }}>{rep.name.split(" ")[0]}</p>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{rep.callsToday}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}