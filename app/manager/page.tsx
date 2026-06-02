"use client";
import { salesReps, managerDashboard, leads, escalations } from "@/data/dummy";
import Link from "next/link";
import {
  Users, Phone, CheckCircle, AlertTriangle,
  ArrowRight, TrendingUp, Calendar,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ReactNode;
  color?: string;
  bg?: string;
  trend?: "up" | "down";
}

// ─── Stat Card ────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, color = "#111827", bg = "#F9FAFB", trend }: StatCardProps) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #E5E7EB",
      borderRadius: 14, padding: "18px 20px",
      display: "flex", alignItems: "flex-start", gap: 14,
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 12, background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, color,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "0 0 2px", letterSpacing: "-0.03em", lineHeight: 1 }}>
          {value}
        </p>
        <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>{label}</p>
        {sub && (
          <p style={{ fontSize: 11, color: trend === "up" ? "#059669" : "#D97706", margin: "3px 0 0", fontWeight: 600 }}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : ""} {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Rep Row ──────────────────────────────────────────────────────
function RepRow({ rep, index }: { rep: typeof salesReps[number]; index: number }) {
  const PALETTES = [
    { bg: "#EFF6FF", text: "#1D4ED8" },
    { bg: "#F0FDF4", text: "#15803D" },
    { bg: "#FFFBEB", text: "#B45309" },
    { bg: "#FAF5FF", text: "#7E22CE" },
    { bg: "#FDF2F8", text: "#9D174D" },
    { bg: "#ECFDF5", text: "#065F46" },
    { bg: "#FFF7ED", text: "#C2410C" },
  ];
  const palette = PALETTES[index % PALETTES.length];

  const convColor = rep.conversionRate >= 35 ? "#059669"
    : rep.conversionRate >= 28 ? "#D97706"
    : "#DC2626";

  return (
    <tr
      style={{ borderBottom: "1px solid #F9FAFB", transition: "background 0.1s" }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#F9FAFB"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ""}
    >
      <td style={{ padding: "12px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: palette.bg, color: palette.text,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, flexShrink: 0,
          }}>
            {rep.avatar}
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>{rep.name}</p>
            <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>Team {rep.team}</p>
          </div>
        </div>
      </td>
      <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#111827" }}>{rep.leadsAssigned}</td>
      <td style={{ padding: "12px 20px", fontSize: 13, color: "#374151" }}>{rep.callsToday}</td>
      <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#059669" }}>{rep.wonThisMonth}</td>
      <td style={{ padding: "12px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 60, height: 6, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${rep.conversionRate}%`,
              background: convColor, borderRadius: 99,
            }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: convColor }}>{rep.conversionRate}%</span>
        </div>
      </td>
    </tr>
  );
}

// ─── Escalation Card ──────────────────────────────────────────────
function EscalationCard({ e }: { e: typeof escalations[number] }) {
  const cfg = {
    High:   { bg: "#FFF1F2", color: "#DC2626", border: "#FECDD3" },
    Medium: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
    Low:    { bg: "#F0F9FF", color: "#0369A1", border: "#BAE6FD" },
  }[e.severity as "High" | "Medium" | "Low"] ?? { bg: "#F9FAFB", color: "#374151", border: "#E5E7EB" };

  return (
    <div style={{
      padding: "12px 14px", borderRadius: 10,
      background: "#F9FAFB", border: "1px solid #E5E7EB",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "monospace", color: "#6B7280" }}>{e.id}</span>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99,
          background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
        }}>
          {e.severity}
        </span>
      </div>
      <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: "0 0 2px" }}>{e.lead}</p>
      <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 4px" }}>{e.reason}</p>
      <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>Rep: {e.rep}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function ManagerDashboard() {
  const totalLeads    = managerDashboard.totalLeads;
  const callsToday    = managerDashboard.callsToday;
  const wonThisMonth  = managerDashboard.wonThisMonth;
  const overdueCount  = managerDashboard.overdue;

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1080, background: "#F9FAFB", minHeight: "100%" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Team Alpha · Manager View
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 4px", letterSpacing: "-0.03em" }}>
            Good morning, Vikram 👋
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
            <span style={{ color: "#DC2626", fontWeight: 700 }}>{managerDashboard.escalations} escalations</span> need your attention today.
          </p>
        </div>
        <Link href="/manager/escalations">
          <button style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
            borderRadius: 10, background: "#DC2626", color: "#fff",
            fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
          }}>
            <AlertTriangle size={14} strokeWidth={2.5} />
            View Escalations ({managerDashboard.escalations})
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <StatCard
          label="Total Leads"
          value={totalLeads}
          icon={<Users size={18} />}
          color="#1D4ED8" bg="#EFF6FF"
        />
        <StatCard
          label="Calls Today"
          value={callsToday}
          icon={<Phone size={18} />}
          color="#0369A1" bg="#F0F9FF"
        />
        <StatCard
          label="Won This Month"
          value={wonThisMonth}
          sub={`${managerDashboard.teamConversionRate}% conversion`}
          icon={<CheckCircle size={18} />}
          color="#065F46" bg="#ECFDF5"
          trend="up"
        />
        <StatCard
          label="Overdue Tasks"
          value={overdueCount}
          sub={`${managerDashboard.escalations} escalations`}
          icon={<AlertTriangle size={18} />}
          color="#B91C1C" bg="#FEF2F2"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18 }}>

        {/* Team table */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", borderBottom: "1px solid #F3F4F6",
            }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>
                Rep Performance — Team Alpha
              </h2>
              <Link href="/manager/team" style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                Full report <ArrowRight size={12} />
              </Link>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                  {["Rep", "Leads", "Calls", "Won", "Conv. Rate"].map(h => (
                    <th key={h} style={{
                      textAlign: "left", padding: "11px 20px",
                      fontSize: 11, fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.05em", color: "#6B7280",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {salesReps.map((rep, i) => (
                  <RepRow key={rep.id} rep={rep} index={i} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pipeline snapshot by team */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Team Pipeline</h2>
              <Link href="/manager/leads" style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                All leads <ArrowRight size={12} />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "New",           color: "#1D4ED8" },
                { label: "Contacted",     color: "#374151" },
                { label: "Qualified",     color: "#0369A1" },
                { label: "Proposal Sent", color: "#7C3AED" },
                { label: "Negotiation",   color: "#B45309" },
              ].map(stage => {
                const count = leads.filter(l => l.status === stage.label).length;
                const pct   = leads.length ? Math.round((count / leads.length) * 100) : 0;
                return (
                  <div key={stage.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#374151", minWidth: 100 }}>{stage.label}</span>
                    <div style={{ flex: 1, height: 8, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${Math.max(pct, 3)}%`,
                        background: stage.color, borderRadius: 99, opacity: 0.85,
                      }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", minWidth: 16, textAlign: "right" }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Quick stats */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 20px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>Quick Stats</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Hot Leads",      value: leads.filter(l => l.score === "Hot").length,           color: "#BE123C", bg: "#FFF1F2" },
                { label: "Enrolled",       value: leads.filter(l => l.status === "Enrolled").length,     color: "#065F46", bg: "#ECFDF5" },
                { label: "Overdue",        value: overdueCount,                                           color: "#B91C1C", bg: "#FEF2F2" },
                { label: "Escalations",    value: managerDashboard.escalations,                           color: "#B45309", bg: "#FFFBEB" },
              ].map(s => (
                <div key={s.label} style={{
                  padding: "12px 14px", background: s.bg, borderRadius: 10, textAlign: "center",
                }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: s.color, margin: "0 0 2px" }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: s.color, margin: 0, opacity: 0.8 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Open Escalations */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Open Escalations</h2>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
                background: "#FEF2F2", color: "#DC2626",
              }}>
                {escalations.length}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {escalations.map(e => <EscalationCard key={e.id} e={e} />)}
            </div>
            <Link href="/manager/escalations" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 12, fontSize: 12, fontWeight: 600, color: "#2563EB", textDecoration: "none" }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {/* Top performer */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 20px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9CA3AF", margin: "0 0 12px" }}>
              Top Performer — May
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "#FFFBEB", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 22,
              }}>
                🏆
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: 0 }}>{managerDashboard.topPerformer}</p>
                <p style={{ fontSize: 11, color: "#6B7280", margin: "2px 0 0" }}>41% conversion · 8 deals won</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}