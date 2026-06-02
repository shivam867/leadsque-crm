"use client";
import { leads, repDashboard, leadSources } from "@/data/dummy";
import { StatusBadge, ScoreBadge, PriorityDot } from "@/components/ui/Badges";
import Link from "next/link";
import {
  Phone, Calendar, TrendingUp, CheckCircle, AlertCircle,
  Users, BarChart3, Target, Plus, ArrowRight,
} from "lucide-react";

const myLeads = leads.filter(l => l.assignedTo === "Aanya Sharma");
const today = "2025-05-28";
const overdue  = myLeads.filter(l => l.followUpDate && l.followUpDate < today);
const dueToday = myLeads.filter(l => l.followUpDate === today);

const callOutcomes = [
  { label: "Connected",  color: "#059669", bg: "#ECFDF5", count: 7 },
  { label: "No Answer",  color: "#374151", bg: "#F9FAFB", count: 5 },
  { label: "Busy",       color: "#B45309", bg: "#FFFBEB", count: 3 },
  { label: "Call Later", color: "#1D4ED8", bg: "#EFF6FF", count: 2 },
  { label: "Wrong #",    color: "#B91C1C", bg: "#FEF2F2", count: 1 },
];

function StatCard({ label, value, sub, icon, color = "#111827", bg = "#F9FAFB", trend }: {
  label: string; value: number | string; sub?: string;
  icon: React.ReactNode; color?: string; bg?: string; trend?: "up" | "down";
}) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 14 }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "0 0 2px", letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</p>
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

export default function RepDashboard() {
  const hotLeads = myLeads.filter(l => l.score === "Hot").length;
  const enrolled = myLeads.filter(l => l.status === "Enrolled").length;

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1080, background: "#F9FAFB", minHeight: "100%" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Wednesday, 28 May 2025
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 4px", letterSpacing: "-0.03em" }}>
            Good morning, Aanya 👋
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
            You have <strong style={{ color: "#111827" }}>{repDashboard.pendingFollowUps}</strong> follow-ups due today
            {repDashboard.overdueFollowUps > 0 && <> · <span style={{ color: "#B91C1C", fontWeight: 700 }}>{repDashboard.overdueFollowUps} overdue</span></>}
          </p>
        </div>
        <Link href="/rep/add-lead">
          <button style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
            borderRadius: 10, background: "#111827", color: "#fff",
            fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
          }}>
            <Plus size={14} strokeWidth={2.5} /> Add Lead
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <StatCard label="Leads Today"       value={repDashboard.leadsToday}      icon={<Users size={18} />}        color="#1D4ED8" bg="#EFF6FF" />
        <StatCard label="Calls Made"        value={repDashboard.callsMade}        icon={<Phone size={18} />}        color="#0369A1" bg="#F0F9FF" />
        <StatCard label="Follow-ups Today"  value={repDashboard.pendingFollowUps} icon={<Calendar size={18} />}     color="#B45309" bg="#FFFBEB"
          sub={repDashboard.overdueFollowUps > 0 ? `${repDashboard.overdueFollowUps} overdue` : undefined} />
        <StatCard label="Enrolled This Month" value={repDashboard.wonThisMonth}   icon={<CheckCircle size={18} />}  color="#065F46" bg="#ECFDF5"
          sub={`${repDashboard.conversionRate}% conversion`} trend="up" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18 }}>

        {/* My Leads table */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #F3F4F6" }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>My Leads</h2>
              <Link href="/rep/leads" style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div>
              {myLeads.slice(0, 6).map((lead, i) => (
                <div key={lead.id} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "12px 20px",
                  borderBottom: i < 5 ? "1px solid #F9FAFB" : "none",
                  transition: "background 0.1s",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#F9FAFB"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ""}>
                  <PriorityDot priority={lead.priority} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{lead.name}</span>
                      <ScoreBadge score={lead.score} />
                    </div>
                    <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>{lead.service} · {lead.city}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                  {lead.followUpDate && (
                    <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "monospace", flexShrink: 0 }}>{lead.followUpDate}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline snapshot */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>My Pipeline</h2>
              <Link href="/rep/pipeline" style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                Kanban view <ArrowRight size={12} />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "New",           color: "#1D4ED8", bg: "#EFF6FF" },
                { label: "Contacted",     color: "#374151", bg: "#F9FAFB" },
                { label: "Qualified",     color: "#0369A1", bg: "#F0F9FF" },
                { label: "Proposal Sent", color: "#7C3AED", bg: "#FAF5FF" },
                { label: "Negotiation",   color: "#B45309", bg: "#FFFBEB" },
              ].map(stage => {
                const count = myLeads.filter(l => l.status === stage.label).length;
                const pct = myLeads.length ? Math.round((count / myLeads.length) * 100) : 0;
                return (
                  <div key={stage.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#374151", minWidth: 100 }}>{stage.label}</span>
                    <div style={{ flex: 1, height: 8, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.max(pct, 3)}%`, background: stage.color, borderRadius: 99, opacity: 0.85 }} />
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
                { label: "Hot Leads",  value: hotLeads,   color: "#BE123C", bg: "#FFF1F2" },
                { label: "Enrolled",   value: enrolled,   color: "#065F46", bg: "#ECFDF5" },
                { label: "Overdue",    value: overdue.length,  color: "#B91C1C", bg: "#FEF2F2" },
                { label: "Due Today",  value: dueToday.length, color: "#B45309", bg: "#FFFBEB" },
              ].map(s => (
                <div key={s.label} style={{ padding: "12px 14px", background: s.bg, borderRadius: 10, textAlign: "center" }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: s.color, margin: "0 0 2px" }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: s.color, margin: 0, opacity: 0.8 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Today's calls */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 20px" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>Today's Calls</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {callOutcomes.map(o => (
                <div key={o.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: o.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#374151", flex: 1 }}>{o.label}</span>
                  <div style={{ width: 60, height: 5, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(o.count / 18) * 100}%`, background: o.color, borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#111827", minWidth: 16, textAlign: "right" }}>{o.count}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #F3F4F6" }}>
                <span style={{ fontSize: 12, color: "#6B7280" }}>Total</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>{callOutcomes.reduce((a, b) => a + b.count, 0)}</span>
              </div>
            </div>
          </div>

          {/* Due today */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Due Today</h2>
              {overdue.length > 0 && (
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#FEF2F2", color: "#B91C1C" }}>
                  {overdue.length} overdue
                </span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[...overdue.slice(0, 2), ...dueToday.slice(0, 2)].map(lead => (
                <div key={lead.id} style={{ display: "flex", gap: 10, padding: "10px 12px", background: "#F9FAFB", borderRadius: 9, alignItems: "center" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: overdue.includes(lead) ? "#EF4444" : "#D97706", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#111827", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.name}</p>
                    <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>{lead.followUpDate} · {lead.service}</p>
                  </div>
                  <ScoreBadge score={lead.score} />
                </div>
              ))}
              {overdue.length === 0 && dueToday.length === 0 && (
                <p style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center", padding: "12px 0" }}>All clear ✓</p>
              )}
            </div>
            <Link href="/rep/followups" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 10, fontSize: 12, fontWeight: 600, color: "#2563EB", textDecoration: "none" }}>
              View all follow-ups <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}