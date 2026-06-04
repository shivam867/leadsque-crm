"use client";
import { leads, repDashboard } from "@/data/dummy";
import { StatusBadge, ScoreBadge, PriorityDot } from "@/components/ui/Badges";
import Link from "next/link";
import {
  Phone, Calendar, TrendingUp, CheckCircle, AlertCircle,
  Users, Target, Plus, ArrowRight, Clock,
} from "lucide-react";

const myLeads = leads.filter(l => l.assignedTo === "Aanya Sharma");
const today = "2025-05-28";
const overdue  = myLeads.filter(l => l.followUpDate && l.followUpDate < today);
const dueToday = myLeads.filter(l => l.followUpDate === today);

const callOutcomes = [
  { label: "Connected",  color: "var(--accent)",  bg: "var(--accent-light)",  count: 7 },
  { label: "No Answer",  color: "var(--text-secondary)", bg: "var(--surface-2)", count: 5 },
  { label: "Busy",       color: "var(--warning)",  bg: "var(--warning-light)", count: 3 },
  { label: "Call Later", color: "var(--info)",     bg: "var(--info-light)",    count: 2 },
  { label: "Wrong #",    color: "var(--danger)",   bg: "var(--danger-light)",  count: 1 },
];

const totalCalls = callOutcomes.reduce((a, b) => a + b.count, 0);

const PIPELINE_STAGES = [
  { label: "New",           color: "var(--info)" },
  { label: "Contacted",     color: "var(--text-secondary)" },
  { label: "Qualified",     color: "var(--info)" },
  { label: "Proposal Sent", color: "var(--accent)" },
  { label: "Negotiation",   color: "var(--warning)" },
];

export default function RepDashboard() {
  const hotLeads = myLeads.filter(l => l.score === "Hot").length;
  const enrolled = myLeads.filter(l => l.status === "Enrolled").length;
  const urgentItems = [...overdue.slice(0, 2), ...dueToday.slice(0, 2)];

  return (
    <div style={{ padding: "24px 28px", background: "var(--bg)", minHeight: "100%" }}>

      {/* ── Header ── */}
      <div className="animate-fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.07em" }}>
            Wednesday, 28 May 2025
          </p>
          <h1 className="page-title" style={{ margin: "0 0 4px" }}>Good morning, Aanya 👋</h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
            {repDashboard.pendingFollowUps} follow-ups due today
            {repDashboard.overdueFollowUps > 0 && (
              <> · <span style={{ color: "var(--danger)", fontWeight: 700 }}>{repDashboard.overdueFollowUps} overdue</span></>
            )}
          </p>
        </div>
        <Link href="/rep/add-lead">
          <button className="btn-primary" style={{ gap: 7 }}>
            <Plus size={13} strokeWidth={2.5} /> Add Lead
          </button>
        </Link>
      </div>

      {/* ── Top Stats Row ── */}
      <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20, animationDelay: "40ms" }}>
        {[
          { label: "Leads Today",      value: repDashboard.leadsToday,      icon: <Users size={16} />,       color: "var(--accent)",  bg: "var(--accent-light)" },
          { label: "Calls Made",       value: repDashboard.callsMade,        icon: <Phone size={16} />,       color: "var(--info)",    bg: "var(--info-light)" },
          { label: "Follow-ups Today", value: repDashboard.pendingFollowUps, icon: <Calendar size={16} />,    color: "var(--warning)", bg: "var(--warning-light)" },
          { label: "Enrolled / Month", value: repDashboard.wonThisMonth,     icon: <CheckCircle size={16} />, color: "var(--success)", bg: "var(--success-light)" },
        ].map((s, i) => (
          <div key={s.label} className="card animate-fade-up" style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, animationDelay: `${i * 30}ms` }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 1px", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>

        {/* ── Col 1: My Leads table (spans 2 cols) ── */}
        <div className="animate-fade-up card" style={{ gridColumn: "1 / 3", overflow: "hidden", animationDelay: "80ms" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>My Leads</span>
            <Link href="/rep/leads" style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-2)" }}>
                {["Lead", "Program", "Score", "Status", "Follow-up"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "9px 18px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myLeads.slice(0, 8).map((lead, i) => (
                <tr key={lead.id} style={{ borderTop: "1px solid var(--surface-2)", transition: "background .1s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ""}>
                  <td style={{ padding: "10px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <PriorityDot priority={lead.priority} />
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{lead.name}</p>
                        <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0 }}>{lead.city}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "10px 18px", fontSize: 11, color: "var(--text-secondary)" }}>{lead.service}</td>
                  <td style={{ padding: "10px 18px" }}><ScoreBadge score={lead.score} /></td>
                  <td style={{ padding: "10px 18px" }}><StatusBadge status={lead.status} /></td>
                  <td style={{ padding: "10px 18px", fontSize: 11, fontFamily: "monospace", color: lead.followUpDate ? "var(--text-secondary)" : "var(--text-muted)" }}>
                    {lead.followUpDate || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Col 3: Quick Stats + Calls ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Quick Stats */}
          <div className="animate-fade-up card" style={{ padding: "14px 16px", animationDelay: "80ms" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", margin: "0 0 12px" }}>Quick Stats</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Hot Leads", value: hotLeads,       color: "var(--danger)",  bg: "var(--danger-light)" },
                { label: "Enrolled",  value: enrolled,        color: "var(--success)", bg: "var(--success-light)" },
                { label: "Overdue",   value: overdue.length,  color: "var(--danger)",  bg: "var(--danger-light)" },
                { label: "Due Today", value: dueToday.length, color: "var(--warning)", bg: "var(--warning-light)" },
              ].map(s => (
                <div key={s.label} style={{ padding: "12px 14px", background: s.bg, borderRadius: 8, textAlign: "center" }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: s.color, margin: "0 0 1px", letterSpacing: "-0.02em", lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: 10, color: s.color, margin: 0, opacity: 0.75 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Calls */}
          <div className="animate-fade-up card" style={{ padding: "14px 16px", animationDelay: "120ms" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", margin: "0 0 12px" }}>Today's Calls</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {callOutcomes.map(o => (
                <div key={o.label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: o.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", flex: 1 }}>{o.label}</span>
                  <div style={{ width: 52, height: 4, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(o.count / totalCalls) * 100}%`, background: o.color, borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", width: 16, textAlign: "right" }}>{o.count}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 9, borderTop: "1px solid var(--border)", marginTop: 2 }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Total calls</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>{totalCalls}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2 Col 1+2: Pipeline snapshot ── */}
        <div className="animate-fade-up card" style={{ gridColumn: "1 / 3", padding: "14px 18px", animationDelay: "120ms" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>My Pipeline</span>
            <Link href="/rep/pipeline" style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
              Kanban view <ArrowRight size={11} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {PIPELINE_STAGES.map(stage => {
              const count = myLeads.filter(l => l.status === stage.label).length;
              const pct = myLeads.length ? Math.round((count / myLeads.length) * 100) : 0;
              return (
                <div key={stage.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-secondary)", minWidth: 110 }}>{stage.label}</span>
                  <div style={{ flex: 1, height: 6, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.max(pct, 2)}%`, background: stage.color, borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", minWidth: 20, textAlign: "right" }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Row 2 Col 3: Due Today ── */}
        <div className="animate-fade-up card" style={{ padding: "14px 16px", animationDelay: "160ms" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)" }}>Due Today</span>
            {overdue.length > 0 && (
              <span className="badge" style={{ background: "var(--danger-light)", color: "var(--danger)", border: "1px solid var(--danger-border)", fontSize: 10 }}>
                {overdue.length} overdue
              </span>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {urgentItems.length === 0 ? (
              <div style={{ padding: "20px 0", textAlign: "center" }}>
                <CheckCircle size={20} style={{ color: "var(--border-strong)", margin: "0 auto 6px" }} />
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>All clear ✓</p>
              </div>
            ) : urgentItems.map(lead => (
              <div key={lead.id} style={{ display: "flex", gap: 10, padding: "9px 11px", background: "var(--surface-2)", borderRadius: 8, alignItems: "center" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: overdue.includes(lead) ? "var(--danger)" : "var(--warning)", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.name}</p>
                  <p style={{ fontSize: 10, color: "var(--text-secondary)", margin: 0 }}>{lead.followUpDate} · {lead.service}</p>
                </div>
                <ScoreBadge score={lead.score} />
              </div>
            ))}
          </div>
          <Link href="/rep/followups" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 12, fontSize: 11, fontWeight: 600, color: "var(--accent)", textDecoration: "none" }}>
            View all follow-ups <ArrowRight size={11} />
          </Link>
        </div>

      </div>
    </div>
  );
}