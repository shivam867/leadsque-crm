"use client";
import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  CheckCircle, Users, AlertTriangle, TrendingDown,
  Zap, Trophy, ChevronRight, X, Circle, Phone, Target, DollarSign
} from "lucide-react";
import { directorKPIs, teamSummaries, monthlyTargets, directorAlerts, repLeaderboard } from "@/data/directordummy";
import { salesReps } from "@/data/dummy";

// ── Tooltip ───────────────────────────────────────────────────────
const EnrollmentTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#18181B", border: "1px solid #3F3F46", borderRadius: 10, padding: "10px 14px", minWidth: 140 }}>
      <p style={{ fontSize: 11, color: "#6B7280", marginBottom: 6, fontWeight: 600 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ── KPI Card ──────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color = "#1a56db", bg = "#EFF6FF", icon, delay = "0ms" }: {
  label: string; value: string | number; sub?: string;
  color?: string; bg?: string; icon: React.ReactNode; delay?: string;
}) {
  return (
    <div className="card animate-fade-up" style={{ padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 14, animationDelay: delay }}>
      <div style={{ width: 40, height: 40, borderRadius: 11, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 2px", letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>{label}</p>
        {sub && <p style={{ fontSize: 10, color, margin: "3px 0 0", fontWeight: 600 }}>{sub}</p>}
      </div>
    </div>
  );
}

// ── Alert Card ────────────────────────────────────────────────────
const ALERT_CONFIG = {
  escalation:  { icon: AlertTriangle, color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  performance: { icon: TrendingDown,  color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  revenue:     { icon: DollarSign,    color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
  opportunity: { icon: Zap,           color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
};

function AlertCard({ alert, onDismiss }: { alert: typeof directorAlerts[0]; onDismiss: () => void }) {
  const cfg = ALERT_CONFIG[alert.type as keyof typeof ALERT_CONFIG] ?? ALERT_CONFIG.escalation;
  const IconComp = cfg.icon;
  const sevColor = alert.severity === "High" ? "#DC2626" : alert.severity === "Medium" ? "#D97706" : "#0369A1";
  const sevBg    = alert.severity === "High" ? "#FEF2F2" : alert.severity === "Medium" ? "#FFFBEB" : "#EFF6FF";
  return (
    <div style={{
      borderRadius: 12,
      border: `1px solid ${cfg.border}`,
      background: "#fff",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      {/* Coloured top bar */}
      <div style={{ height: 3, background: cfg.color, width: "100%" }} />

      <div style={{ padding: "14px 16px 0" }}>
        {/* Row 1: icon + title + dismiss */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <IconComp size={14} color={cfg.color} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827", flex: 1, lineHeight: 1.35 }}>{alert.title}</span>
          <button onClick={onDismiss} style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: "2px", display: "flex", alignItems: "center", borderRadius: 4 }}>
            <X size={13} />
          </button>
        </div>

        {/* Row 2: severity + team badges */}
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: sevBg, color: sevColor, border: `1px solid ${sevColor}22` }}>
            {alert.severity}
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB" }}>
            Team {alert.team}
          </span>
        </div>

        {/* Row 3: detail text */}
        <p style={{ fontSize: 12, color: "#374151", margin: "0", lineHeight: 1.6 }}>{alert.detail}</p>
      </div>

      {/* Action footer */}
      <div style={{ margin: "12px 16px 14px", padding: "8px 12px", borderRadius: 8, background: cfg.bg, border: `1px solid ${cfg.border}`, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
        <ChevronRight size={13} color={cfg.color} />
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
          <p style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>
            Lead Intelligence · Director View
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1 }}>
              Director Dashboard
            </h1>
          </div>
          <p style={{ fontSize: 13, color: "#374151", marginTop: 4 }}>
            Team health <strong style={{ color: "#059669" }}>{directorKPIs.teamHealth}/100</strong> ·
            {directorKPIs.activeReps} active reps ·
            <strong style={{ color: "#DC2626" }}> {directorKPIs.openEscalations} open escalations</strong>
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 99, background: "#EFF6FF", color: "#1a56db", border: "1px solid #BFDBFE" }}>
          <Circle size={7} fill="#1a56db" color="#1a56db" style={{ animation: "pulse 2s infinite" }} />
          May 2025 · Live
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <KpiCard label="Total Leads"         value={directorKPIs.totalLeads ?? "218"}      sub="Across all 3 teams"                            color="#1a56db" bg="#EFF6FF" delay="0ms"   icon={<Users size={18} />} />
        <KpiCard label="Enrolled This Month" value={directorKPIs.totalWon}                 sub={`${directorKPIs.conversionRate}% conversion`}  color="#059669" bg="#ECFDF5" delay="40ms"  icon={<CheckCircle size={18} />} />
        <KpiCard label="Calls Today"         value={directorKPIs.callsToday}               sub={`${directorKPIs.activeReps} active reps`}      color="#7e3af2" bg="#F5F3FF" delay="80ms"  icon={<Phone size={18} />} />
        <KpiCard label="Target Achieved"     value={`${directorKPIs.targetAchieved}%`}     sub="May 2025"                                      color="#D97706" bg="#FFFBEB" delay="120ms" icon={<Target size={18} />} />
      </div>

      {/* Revenue chart + Alerts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, marginBottom: 16 }}>

        {/* Revenue chart */}
        <div className="animate-fade-up card" style={{ padding: 20, animationDelay: "80ms" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Enrollments vs Target — May 2025</h2>
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "#EFF6FF", color: "#1a56db", fontWeight: 600 }}>Leads</span>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={monthlyTargets} margin={{ top: 5, right: 0, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1a56db" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#1a56db" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip content={<EnrollmentTooltip />} />
              <Area type="monotone" dataKey="actual" stroke="#1a56db" strokeWidth={2} fill="url(#actGrad)" name="Actual" dot={{ fill: "#1a56db", r: 3 }} />
              <Area type="monotone" dataKey="target" stroke="#D1D5DB" strokeWidth={1.5} fill="none" strokeDasharray="5 3" name="Target" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {[{ color: "#1a56db", label: "Actual" }, { color: "#D1D5DB", label: "Target", dashed: true }].map(l => (
              <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#6B7280" }}>
                <span style={{ width: 20, height: 2, background: l.dashed ? "none" : l.color, display: "inline-block", borderRadius: 2, ...(l.dashed ? { borderTop: `2px dashed #D1D5DB` } : {}) }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>

        {/* Action Alerts — scrollable */}
        <div className="animate-fade-up card" style={{ padding: 16, animationDelay: "120ms", display: "flex", flexDirection: "column", maxHeight: 380, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexShrink: 0 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Action Required</h2>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#FEF2F2", color: "#DC2626" }}>
              {alerts.filter(a => a.severity === "High").length} high
            </span>
          </div>
          {/* Scrollable alert list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", flex: 1, paddingRight: 2 }}>
            {alerts.length === 0
              ? <p style={{ fontSize: 12, color: "#6B7280", textAlign: "center", padding: "24px 0" }}>All clear ✓</p>
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
              <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Team {team.team}</span>
              <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: team.color }}>{team.trend}</span>
            </div>
            {/* Manager */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12, padding: "8px 10px", background: "var(--surface-2)", borderRadius: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: team.bg, color: team.color, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {team.managerAvatar}
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#111827", margin: 0 }}>{team.manager}</p>
                <p style={{ fontSize: 10, color: "#6B7280", margin: 0 }}>Manager · {team.reps.length} reps</p>
              </div>
            </div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              {[
                { label: "Leads",    value: team.leads,            color: undefined },
                { label: "Enrolled", value: team.won,              color: "#059669" },
                { label: "Calls",    value: team.calls,            color: undefined },
                { label: "Conv.",    value: `${team.conversion}%`, color: team.color },
              ].map(s => (
                <div key={s.label} style={{ background: "var(--surface-2)", borderRadius: 8, padding: "8px 10px" }}>
                  <p style={{ fontSize: 10, color: "#6B7280", margin: "0 0 1px" }}>{s.label}</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: s.color ?? "#111827", margin: 0 }}>{s.value}</p>
                </div>
              ))}
            </div>
            {/* Target bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 4 }}>
                <span style={{ color: "#6B7280" }}>Target achieved</span>
                <span style={{ fontWeight: 700, color: team.color }}>{team.targetAchieved}%</span>
              </div>
              <div style={{ height: 5, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${team.targetAchieved}%`, background: team.color, borderRadius: 99, transition: "width 0.6s ease" }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
              <span style={{ fontSize: 11, color: "#6B7280" }}>Leads Won</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>{team.won} enrolled</span>
            </div>
          </div>
        ))}

        {/* Top Rep */}
        <div className="animate-fade-up card" style={{ padding: "16px 18px", animationDelay: "200ms" }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#6B7280", marginBottom: 10 }}>
            Top Performer — May
          </p>
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "#FFFBEB", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
              <Trophy size={24} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 800, color: "#111827", margin: "0 0 2px" }}>{topRep.name}</p>
            <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>Team {topRep.team}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {[
              { label: "Conversion", value: `${topRep.conversionRate}%`, color: "#059669" },
              { label: "Enrolled",   value: topRep.wonThisMonth,         color: "#1a56db" },
              { label: "Calls",      value: topRep.callsToday,           color: undefined },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#6B7280" }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: s.color ?? "#111827" }}>{s.value}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}>All reps ranking</p>
            {repLeaderboard.slice(0, 4).map(r => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", width: 12 }}>{r.rank}</span>
                <span style={{ fontSize: 11, color: "#111827", flex: 1 }}>{r.name.split(" ")[0]}</span>
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
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#6B7280", marginBottom: 2 }}>Today across all teams</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>{directorKPIs.callsToday} calls made</p>
          </div>
          <div style={{ flex: 1, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {salesReps.map(rep => (
              <div key={rep.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: "#EFF6FF", color: "#1a56db", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {rep.avatar}
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "#6B7280", margin: 0 }}>{rep.name.split(" ")[0]}</p>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#111827", margin: 0 }}>{rep.callsToday}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}