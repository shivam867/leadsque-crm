"use client";
import { useState } from "react";
import { leads } from "@/data/dummy";
import { ScoreBadge, StatusBadge } from "@/components/ui/Badges";
import LeadDetailPanel from "@/components/ui/LeadDetailPanel";
import LeadDetailPage from "@/components/lead-detail/LeadDetailPage";
import type { Lead } from "@/data/dummy";
import { Calendar, Clock, CheckCheck, AlertCircle, ChevronRight } from "lucide-react";

const myLeads = leads.filter(l => l.assignedTo === "Aanya Sharma" && l.followUpDate);
const today   = "2025-05-28";
const overdue  = myLeads.filter(l => l.followUpDate! < today);
const dueToday = myLeads.filter(l => l.followUpDate === today);
const upcoming = myLeads.filter(l => l.followUpDate! > today);

type View = "list" | "full";

const SECTION_CONFIG = {
  overdue:  { title: "Overdue",   sub: "Call immediately",    color: "var(--danger)",       icon: <AlertCircle size={13} /> },
  dueToday: { title: "Due Today", sub: "Scheduled for today", color: "var(--text-primary)", icon: <Clock size={13} /> },
  upcoming: { title: "Upcoming",  sub: "Scheduled ahead",     color: "#059669",             icon: <Calendar size={13} /> },
} as const;

function FollowUpCard({ lead, type, isSelected, onSelect, onOpen }: {
  lead: Lead;
  type: keyof typeof SECTION_CONFIG;
  isSelected: boolean;
  onSelect: (l: Lead) => void;
  onOpen: (l: Lead) => void;
}) {
  const cfg = SECTION_CONFIG[type];
  return (
    <div
      onClick={() => onSelect(lead)}
      className="card"
      style={{
        padding: "14px 16px",
        borderLeft: `3px solid ${isSelected ? cfg.color : "transparent"}`,
        background: isSelected ? "var(--surface-2)" : "var(--surface)",
        cursor: "pointer",
        transition: "all 0.12s",
      }}
      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; }}
      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}
    >
      {/* Row 1: avatar + name + badges */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, color: "var(--text-secondary)" }}>
          {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.name}</p>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0 }}>{lead.service} · {lead.city}</p>
        </div>
        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
          <ScoreBadge score={lead.score} />
          <StatusBadge status={lead.status} />
        </div>
      </div>

      {/* Row 2: date + phone + chevron */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: cfg.color, background: cfg.color === "var(--text-primary)" ? "var(--surface-2)" : cfg.color + "15", padding: "2px 7px", borderRadius: 4, fontFamily: "monospace" }}>
            <Calendar size={9} />{lead.followUpDate}
          </span>
          {lead.phone && (
            <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>{lead.phone}</span>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onOpen(lead); }}
          style={{ display: "flex", alignItems: "center", padding: "4px 6px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", color: "var(--text-secondary)" }}
        >
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Remarks */}
      {lead.followUps?.[0]?.remarks && (
        <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: "8px 0 0", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          "{lead.followUps[0].remarks}"
        </p>
      )}
    </div>
  );
}

function Column({ type, items, selectedId, onSelect, onOpen }: {
  type: keyof typeof SECTION_CONFIG;
  items: Lead[];
  selectedId?: string;
  onSelect: (l: Lead) => void;
  onOpen: (l: Lead) => void;
}) {
  const cfg = SECTION_CONFIG[type];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Column header */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, paddingBottom: 12, borderBottom: `2px solid ${items.length > 0 ? cfg.color : "var(--border)"}`, marginBottom: 12, flexShrink: 0 }}>
        <span style={{ color: cfg.color }}>{cfg.icon}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{cfg.title}</span>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "var(--surface-3)", color: "var(--text-secondary)" }}>
          {items.length}
        </span>
        <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>— {cfg.sub}</span>
      </div>

      {/* Scrollable cards */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 7 }}>
        {items.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center" }}>
            <CheckCheck size={20} style={{ color: "var(--border-strong)", margin: "0 auto 8px", display: "block" }} />
            <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>Nothing here</p>
          </div>
        ) : (
          items.map(lead => (
            <FollowUpCard
              key={lead.id}
              lead={lead}
              type={type}
              isSelected={selectedId === lead.id}
              onSelect={onSelect}
              onOpen={onOpen}
            />
          ))
        )}
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
    return <LeadDetailPage lead={selected} onBack={() => { setSelected(null); setView("list"); }} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)", overflow: "hidden" }}>

      {/* ── Header ── */}
      <div className="animate-fade-up" style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)", background: "var(--surface)", flexShrink: 0 }}>
        <h1 className="page-title" style={{ fontSize: 18, marginBottom: 2 }}>Follow-ups</h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
          <span style={{ color: "var(--danger)", fontWeight: 700 }}>{overdue.length} overdue</span>
          {" · "}
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{dueToday.length} due today</span>
          {" · "}
          <span style={{ color: "var(--text-secondary)" }}>{upcoming.length} upcoming</span>
        </p>
      </div>

      {/* ── Summary Strip ── */}
      <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: "14px 24px", borderBottom: "1px solid var(--border)", background: "var(--surface)", flexShrink: 0, animationDelay: "40ms" }}>
        {[
          { icon: <AlertCircle size={15} />, label: "Overdue",   value: overdue.length,  accentColor: "var(--danger)" },
          { icon: <Clock size={15} />,       label: "Due Today", value: dueToday.length, accentColor: "var(--text-primary)" },
          { icon: <CheckCheck size={15} />,  label: "Upcoming",  value: upcoming.length, accentColor: "#059669" },
        ].map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 7, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: s.accentColor, flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", margin: 0, lineHeight: 1, letterSpacing: "-0.03em" }}>{s.value}</p>
              <p style={{ fontSize: 10, color: "var(--text-secondary)", margin: "1px 0 0" }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Body: 3 columns + side panel ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Columns — horizontal scroll; padding-right makes last column reachable under the fixed panel */}
        <div style={{ flex: 1, overflowX: "auto", overflowY: "hidden", display: "flex", paddingRight: selected && view === "list" ? 360 : 0, transition: "padding-right 0.2s ease", boxSizing: "border-box" }}>
          <div style={{ display: "flex", minWidth: "max-content", width: "100%", height: "100%" }}>
            {(["overdue", "dueToday", "upcoming"] as const).map((type, idx) => {
              const items = { overdue, dueToday, upcoming }[type];
              return (
                <div
                  key={type}
                  className="animate-fade-up"
                  style={{
                    width: 380,
                    minWidth: 320,
                    flex: "1 0 320px",
                    padding: "20px",
                    borderRight: idx < 2 ? "1px solid var(--border)" : "none",
                    height: "100%",
                    animationDelay: `${idx * 40 + 80}ms`,
                  }}
                >
                  <Column
                    type={type}
                    items={items}
                    selectedId={selected?.id}
                    onSelect={handleSelect}
                    onOpen={handleOpenFull}
                  />
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Side panel — fixed overlay, full viewport height, right edge ── */}
      {/* Shadow lives on the aside inside LeadDetailPanel, not here */}
      {selected && view === "list" && (
        <div style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          zIndex: 50,
        }}>
          <LeadDetailPanel
            lead={selected}
            onClose={() => { setSelected(null); setView("list"); }}
            onOpenFullPage={handleOpenFull}
            avatarIndex={0}
          />
        </div>
      )}
    </div>
  );
}