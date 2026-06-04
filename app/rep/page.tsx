"use client";
import { leads, repDashboard } from "@/data/dummy";
import { StatusBadge, ScoreBadge, PriorityDot } from "@/components/ui/Badges";
import Link from "next/link";
import {
  Calendar, CheckCircle, AlertCircle,
  Users, Phone, Plus, ArrowRight, Clock,
} from "lucide-react";

const myLeads = leads.filter(l => l.assignedTo === "Aanya Sharma");
const today = "2025-05-28";
const overdue  = myLeads.filter(l => l.followUpDate && l.followUpDate < today);
const dueToday = myLeads.filter(l => l.followUpDate === today);
const upcoming = myLeads.filter(l => l.followUpDate && l.followUpDate > today);

const callOutcomes = [
  { label: "Connected",  color: "#0070F3", count: 7 },
  { label: "No Answer",  color: "#525252", count: 5 },
  { label: "Busy",       color: "#D97706", count: 3 },
  { label: "Call Later", color: "#0070F3", count: 2 },
  { label: "Wrong #",    color: "#EE0000", count: 1 },
];

const totalCalls = callOutcomes.reduce((a, b) => a + b.count, 0);

const PIPELINE_STAGES = [
  { label: "New",           color: "#0070F3" },
  { label: "Contacted",     color: "#525252" },
  { label: "Qualified",     color: "#0070F3" },
  { label: "Proposal Sent", color: "#0070F3" },
  { label: "Negotiation",   color: "#D97706" },
];

function FollowSection({ title, leads: items, accentColor, icon, viewAllHref }: {
  title: string; leads: any[]; accentColor: string; icon: React.ReactNode; viewAllHref: string;
}) {
  const preview = items.slice(0, 3);
  return (
    <div className="card" style={{ flex: 1, padding: "16px 18px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
        <span style={{ color: accentColor }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)" }}>{title}</span>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: items.length > 0 ? accentColor + "15" : "var(--surface-2)", color: items.length > 0 ? accentColor : "var(--text-muted)" }}>
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <div style={{ padding: "20px 0", textAlign: "center", flex: 1 }}>
          <CheckCircle size={18} style={{ color: "var(--text-muted)", margin: "0 auto 6px", display: "block" }} />
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>All clear</p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            {preview.map(lead => (
              <div key={lead.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "var(--surface-2)", borderRadius: 6 }}>
                <PriorityDot priority={lead.priority} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.name}</p>
                  <p style={{ fontSize: 10, color: "var(--text-secondary)", margin: 0 }}>{lead.service} · {lead.city}</p>
                </div>
                <ScoreBadge score={lead.score} />
              </div>
            ))}
          </div>
          {items.length > 3 && (
            <Link href={viewAllHref} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)", fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", textDecoration: "none" }}>
              View all {items.length} <ArrowRight size={11} />
            </Link>
          )}
        </>
      )}
    </div>
  );
}

export default function RepDashboard() {
  const hotLeads = myLeads.filter(l => l.score === "Hot").length;
  const enrolled = myLeads.filter(l => l.status === "Enrolled").length;

  return (
    <div style={{ padding: "24px 28px", background: "var(--bg)", minHeight: "100%" }}>

      {/* ── Header ── */}
      <div className="animate-fade-up" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
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

      {/* ── Top 4 Stat Cards ── */}
      <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16, animationDelay: "40ms" }}>
        {[
          { label: "Leads Today",      value: repDashboard.leadsToday,      icon: <Users size={15} /> },
          { label: "Calls Made",       value: repDashboard.callsMade,        icon: <Phone size={15} /> },
          { label: "Follow-ups Today", value: repDashboard.pendingFollowUps, icon: <Calendar size={15} /> },
          { label: "Enrolled / Month", value: repDashboard.wonThisMonth,     icon: <CheckCircle size={15} /> },
        ].map((s, i) => (
          <div key={s.label} className="card animate-fade-up" style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, animationDelay: `${i * 30}ms` }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--text-primary)" }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 1px", letterSpacing: "-0.04em", lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main 2-col grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 296px", gap: 12, marginBottom: 12 }}>

        {/* LEFT: My Leads table */}
        <div className="animate-fade-up card" style={{ overflow: "hidden", animationDelay: "80ms" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>My Leads</span>
            <Link href="/rep/leads" style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
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
              {myLeads.slice(0, 8).map(lead => (
                <tr key={lead.id} style={{ borderTop: "1px solid var(--surface-2)", transition: "background .1s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-2)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}>
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

        {/* RIGHT: Quick Stats + Today's Calls + Pipeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Quick Stats */}
          <div className="animate-fade-up card" style={{ padding: "14px 16px", animationDelay: "80ms" }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", margin: "0 0 10px" }}>Quick Stats</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Hot Leads", value: hotLeads,        color: "var(--text-primary)" },
                { label: "Enrolled",  value: enrolled,        color: "var(--text-primary)" },
                { label: "Overdue",   value: overdue.length,  color: "var(--text-primary)" },
                { label: "Due Today", value: dueToday.length, color: "var(--text-primary)" },
              ].map(s => (
                <div key={s.label} style={{ padding: "11px 12px", background: "var(--surface-2)", borderRadius: 6, textAlign: "center", border: "1px solid var(--border)" }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: s.color, margin: "0 0 1px", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: 10, color: "var(--text-secondary)", margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Calls */}
          <div className="animate-fade-up card" style={{ padding: "14px 16px", animationDelay: "120ms" }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", margin: "0 0 10px" }}>Today's Calls</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {callOutcomes.map(o => (
                <div key={o.label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: o.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", flex: 1 }}>{o.label}</span>
                  <div style={{ width: 52, height: 3, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
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

          {/* Pipeline */}
          <div className="animate-fade-up card" style={{ padding: "14px 16px", animationDelay: "160ms" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", margin: 0 }}>My Pipeline</p>
              <Link href="/rep/pipeline" style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 3, textDecoration: "none" }}>
                View <ArrowRight size={10} />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {PIPELINE_STAGES.map(stage => {
                const count = myLeads.filter(l => l.status === stage.label).length;
                const pct = myLeads.length ? Math.round((count / myLeads.length) * 100) : 0;
                return (
                  <div key={stage.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, color: "var(--text-secondary)", minWidth: 96 }}>{stage.label}</span>
                    <div style={{ flex: 1, height: 4, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.max(pct, 2)}%`, background: stage.color, borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)", minWidth: 16, textAlign: "right" }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom even row: Overdue | Due Today | Upcoming ── */}
      <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, animationDelay: "200ms" }}>
        <FollowSection title="Overdue"   leads={overdue}   accentColor="var(--danger)"  icon={<AlertCircle size={12} />} viewAllHref="/rep/followups" />
        <FollowSection title="Due Today" leads={dueToday}  accentColor="var(--text-primary)" icon={<Clock size={12} />} viewAllHref="/rep/followups" />
        <FollowSection title="Upcoming"  leads={upcoming}  accentColor="#16A34A"         icon={<Calendar size={12} />} viewAllHref="/rep/followups" />
      </div>

    </div>
  );
}