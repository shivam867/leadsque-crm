"use client";
import { useState } from "react";
import { leads } from "@/data/dummy";
import { ScoreBadge, StatusBadge } from "@/components/ui/Badges";
import LeadDetailPanel from "@/components/ui/LeadDetailPanel";
import LeadDetailPage from "@/components/lead-detail/LeadDetailPage";
import type { Lead } from "@/data/dummy";
import { Phone, Calendar, Clock, CheckCheck, AlertCircle, ChevronRight } from "lucide-react";

const myLeads = leads.filter(l => l.assignedTo === "Aanya Sharma" && l.followUpDate);
const today   = "2025-05-28";
const overdue  = myLeads.filter(l => l.followUpDate! < today);
const dueToday = myLeads.filter(l => l.followUpDate === today);
const upcoming = myLeads.filter(l => l.followUpDate! > today);

type View = "list" | "full";

const SECTION_CONFIG = {
  overdue:  { title: "Overdue",    sub: "Call immediately",    color: "var(--danger)",  bg: "var(--danger-light)",  icon: <AlertCircle size={13} /> },
  dueToday: { title: "Due Today",  sub: "Scheduled for today", color: "var(--warning)", bg: "var(--warning-light)", icon: <Clock size={13} /> },
  upcoming: { title: "Upcoming",   sub: "Scheduled ahead",     color: "var(--success)", bg: "var(--success-light)", icon: <Calendar size={13} /> },
} as const;

function SectionHeader({ type, count }: { type: keyof typeof SECTION_CONFIG; count: number }) {
  const cfg = SECTION_CONFIG[type];
  if (count === 0) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <span style={{ color: cfg.color }}>{cfg.icon}</span>
      <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{cfg.title}</span>
      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: cfg.bg, color: cfg.color }}>{count}</span>
      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>— {cfg.sub}</span>
    </div>
  );
}

function FollowUpCard({ lead, type, isSelected, onSelect, onOpen }: {
  lead: Lead; type: keyof typeof SECTION_CONFIG;
  isSelected: boolean; onSelect: (l: Lead) => void; onOpen: (l: Lead) => void;
}) {
  const cfg = SECTION_CONFIG[type];
  return (
    <div
      onClick={() => onSelect(lead)}
      className="card"
      style={{
        padding: "12px 16px",
        background: isSelected ? "var(--accent-light)" : "var(--surface)",
        border: `1px solid ${isSelected ? "var(--accent-border)" : "var(--border)"}`,
        cursor: "pointer", transition: "all 0.12s",
      }}
      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; }}
      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Avatar */}
        <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}20` }}>
          {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{lead.name}</span>
            <ScoreBadge score={lead.score} />
            <StatusBadge status={lead.status} />
          </div>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0 }}>
            {lead.service} · {lead.phone} · {lead.city}
          </p>
          {lead.followUps[0]?.remarks && (
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "3px 0 0", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {lead.followUps[0].remarks}
            </p>
          )}
        </div>

        {/* Right actions — fixed width, no overflow */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: "3px 8px", borderRadius: 6, fontFamily: "monospace" }}>
            <Calendar size={9} />{lead.followUpDate}
          </div>
          <button
            onClick={e => e.stopPropagation()}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "var(--surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border)", cursor: "pointer", transition: "all .12s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--surface-3)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; }}>
            <Phone size={10} /> Call
          </button>
          <button
            onClick={e => { e.stopPropagation(); onOpen(lead); }}
            className="btn-ghost"
            style={{ padding: "5px 7px", color: "var(--text-muted)" }}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RepFollowUps() {
  const [selected, setSelected] = useState<Lead | null>(null);
  const [view, setView]         = useState<View>("list");

  const handleSelect = (lead: Lead) => {
    setSelected(prev => prev?.id === lead.id ? null : lead);
    setView("list");
  };

  const handleOpenFull = (lead: Lead) => { setSelected(lead); setView("full"); };

  if (view === "full" && selected) {
    return <LeadDetailPage lead={selected} onBack={() => setView("list")} />;
  }

  return (
    <div style={{ display: "flex", height: "100%", background: "var(--bg)" }}>

      {/* ── Left: list ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

        {/* Header */}
        <div className="animate-fade-up" style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)", background: "var(--surface)", flexShrink: 0 }}>
          <h1 className="page-title" style={{ fontSize: 18, marginBottom: 2 }}>Follow-ups</h1>
          <p className="page-subtitle">
            {overdue.length} overdue · {dueToday.length} due today · {upcoming.length} upcoming
          </p>
        </div>

        {/* Summary strip */}
        <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: "16px 24px", borderBottom: "1px solid var(--border)", background: "var(--surface)", flexShrink: 0, animationDelay: "40ms" }}>
          {[
            { icon: <AlertCircle size={15} />, label: "Overdue",   value: overdue.length,  color: "var(--danger)",  bg: "var(--danger-light)",  border: "var(--danger-border)" },
            { icon: <Clock size={15} />,       label: "Due Today", value: dueToday.length, color: "var(--warning)", bg: "var(--warning-light)", border: "var(--warning-border)" },
            { icon: <CheckCheck size={15} />,  label: "Upcoming",  value: upcoming.length, color: "var(--success)", bg: "var(--success-light)", border: "var(--success-border)" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#ffffff40", display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <p style={{ fontSize: 22, fontWeight: 800, color: s.color, margin: 0, lineHeight: 1, letterSpacing: "-0.02em" }}>{s.value}</p>
                <p style={{ fontSize: 10, color: s.color, margin: "1px 0 0", opacity: 0.75 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="animate-fade-up" style={{ flex: 1, overflowY: "auto", padding: "20px 24px", animationDelay: "80ms" }}>
          {myLeads.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <CheckCheck size={28} style={{ color: "var(--border-strong)", margin: "0 auto 10px" }} />
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No follow-ups scheduled.</p>
            </div>
          ) : (
            <>
              {overdue.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <SectionHeader type="overdue" count={overdue.length} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {overdue.map(lead => (
                      <FollowUpCard key={lead.id} lead={lead} type="overdue" isSelected={selected?.id === lead.id} onSelect={handleSelect} onOpen={handleOpenFull} />
                    ))}
                  </div>
                </div>
              )}
              {dueToday.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <SectionHeader type="dueToday" count={dueToday.length} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {dueToday.map(lead => (
                      <FollowUpCard key={lead.id} lead={lead} type="dueToday" isSelected={selected?.id === lead.id} onSelect={handleSelect} onOpen={handleOpenFull} />
                    ))}
                  </div>
                </div>
              )}
              {upcoming.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <SectionHeader type="upcoming" count={upcoming.length} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {upcoming.map(lead => (
                      <FollowUpCard key={lead.id} lead={lead} type="upcoming" isSelected={selected?.id === lead.id} onSelect={handleSelect} onOpen={handleOpenFull} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Detail panel ── */}
      {selected && view === "list" && (
        <LeadDetailPanel
          lead={selected}
          onClose={() => { setSelected(null); setView("list"); }}
          onOpenFullPage={handleOpenFull}
          avatarIndex={0}
        />
      )}
    </div>
  );
}