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
  overdue:  { title: "Overdue",   sub: "Call immediately",    color: "var(--danger)",   bg: "var(--danger-light)",   icon: <AlertCircle size={13} /> },
  dueToday: { title: "Due Today", sub: "Scheduled for today", color: "var(--text-primary)", bg: "var(--surface-3)", icon: <Clock size={13} /> },
  upcoming: { title: "Upcoming",  sub: "Scheduled ahead",     color: "var(--success)",  bg: "var(--success-light)",  icon: <Calendar size={13} /> },
} as const;

function FollowUpCard({ lead, type, isSelected, onSelect, onOpen }: {
  lead: Lead; type: keyof typeof SECTION_CONFIG;
  isSelected: boolean; onSelect: (l: Lead) => void; onOpen: (l: Lead) => void;
}) {
  const cfg = SECTION_CONFIG[type];
  return (
    <div
      onClick={() => onSelect(lead)}
      className="card card-hover"
      style={{
        padding: "12px 14px",
        borderLeft: `3px solid ${isSelected ? cfg.color : "var(--border)"}`,
        background: isSelected ? "var(--surface-2)" : "var(--surface)",
        cursor: "pointer",
        transition: "all 0.12s",
        borderRadius: "var(--radius-md)",
      }}
    >
      {/* Row 1: avatar + name + badges */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 9 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "var(--radius-md)",
          background: "var(--surface-3)", border: "1px solid var(--border-strong)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, flexShrink: 0, color: "var(--text-secondary)",
          letterSpacing: "0.02em",
        }}>
          {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 13, fontWeight: 600, color: "var(--text-primary)",
            margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis",
            whiteSpace: "nowrap", letterSpacing: "-0.02em",
          }}>
            {lead.name}
          </p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0, letterSpacing: "-0.01em" }}>
            {lead.service} · {lead.city}
          </p>
        </div>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <ScoreBadge score={lead.score} />
          <StatusBadge status={lead.status} />
        </div>
      </div>

      {/* Row 2: date chip + phone */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{
            display: "flex", alignItems: "center", gap: 4,
            fontSize: 11, fontWeight: 600, color: cfg.color,
            background: cfg.bg,
            padding: "2px 8px", borderRadius: "var(--radius-sm)",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.01em",
          }}>
            <Calendar size={10} />{lead.followUpDate}
          </span>
          {lead.phone && (
            <span style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "-0.01em" }}>
              {lead.phone}
            </span>
          )}
        </div>
      </div>

      {/* Remarks */}
      {lead.followUps?.[0]?.remarks && (
        <p style={{
          fontSize: 11, color: "var(--text-muted)",
          margin: "8px 0 0", fontStyle: "italic",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          borderTop: "1px solid var(--border)", paddingTop: 7,
          letterSpacing: "-0.01em",
        }}>
          "{lead.followUps[0].remarks}"
        </p>
      )}
    </div>
  );
}

function Column({ type, items, selectedId, onSelect, onOpen }: {
  type: keyof typeof SECTION_CONFIG; items: Lead[];
  selectedId?: string; onSelect: (l: Lead) => void; onOpen: (l: Lead) => void;
}) {
  const cfg = SECTION_CONFIG[type];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Column header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 7,
        paddingBottom: 11,
        borderBottom: `2px solid ${items.length > 0 ? cfg.color : "var(--border)"}`,
        marginBottom: 12, flexShrink: 0,
      }}>
        <span style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 26, height: 26, borderRadius: "var(--radius-md)",
          background: cfg.bg, color: cfg.color, flexShrink: 0,
        }}>
          {cfg.icon}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          {cfg.title}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: "1px 7px",
          borderRadius: "var(--radius-full)",
          background: items.length > 0 ? cfg.bg : "var(--surface-3)",
          color: items.length > 0 ? cfg.color : "var(--text-muted)",
          border: `1px solid ${items.length > 0 ? cfg.color + "30" : "var(--border)"}`,
        }}>
          {items.length}
        </span>
        <span style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "-0.01em" }}>
          — {cfg.sub}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
        {items.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center" }}>
            <CheckCheck size={20} style={{ color: "var(--border-strong)", margin: "0 auto 8px", display: "block" }} />
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, letterSpacing: "-0.01em" }}>Nothing here</p>
          </div>
        ) : (
          items.map(lead => (
            <FollowUpCard key={lead.id} lead={lead} type={type} isSelected={selectedId === lead.id} onSelect={onSelect} onOpen={onOpen} />
          ))
        )}
      </div>
    </div>
  );
}

export default function RepFollowUps() {
  const [selected, setSelected] = useState<Lead | null>(null);
  const [view, setView]         = useState<View>("list");

  const handleSelect   = (lead: Lead) => { setSelected(prev => prev?.id === lead.id ? null : lead); setView("list"); };
  const handleOpenFull = (lead: Lead) => { setSelected(lead); setView("full"); };

  if (view === "full" && selected) {
    return <LeadDetailPage lead={selected} onBack={() => { setSelected(null); setView("list"); }} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)", overflow: "hidden" }}>

      {/* ── Header ── */}
      <div className="animate-fade-up" style={{
        padding: "20px 24px 16px",
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
        flexShrink: 0,
      }}>
        <h1 className="page-title" style={{ marginBottom: 4 }}>Follow-ups</h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, letterSpacing: "-0.01em" }}>
          <span style={{ color: "var(--danger)", fontWeight: 700 }}>{overdue.length} overdue</span>
          <span style={{ color: "var(--border-strong)", margin: "0 5px" }}>·</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{dueToday.length} due today</span>
          <span style={{ color: "var(--border-strong)", margin: "0 5px" }}>·</span>
          <span style={{ color: "var(--text-muted)" }}>{upcoming.length} upcoming</span>
        </p>
      </div>

      {/* ── Summary strip ── */}
      <div
        className="animate-fade-up"
        style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8, padding: "12px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
          flexShrink: 0, animationDelay: "40ms",
        }}
      >
        {[
          { icon: <AlertCircle size={14} />, label: "Overdue",   value: overdue.length,  color: "var(--danger)",  bg: "var(--danger-light)" },
          { icon: <Clock size={14} />,       label: "Due Today", value: dueToday.length, color: "var(--text-primary)", bg: "var(--surface-3)" },
          { icon: <CheckCheck size={14} />,  label: "Upcoming",  value: upcoming.length, color: "var(--success)", bg: "var(--success-light)" },
        ].map(s => (
          <div key={s.label} className="card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" }}>
            <div style={{
              width: 32, height: 32, borderRadius: "var(--radius-md)",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: s.bg, color: s.color, flexShrink: 0,
            }}>
              {s.icon}
            </div>
            <div>
              <p style={{
                fontSize: 20, fontWeight: 800, color: "var(--text-primary)",
                margin: 0, lineHeight: 1, letterSpacing: "-0.03em",
              }}>
                {s.value}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "2px 0 0", letterSpacing: "-0.01em" }}>
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Body: 3 columns + side panel ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{
          flex: 1, overflowX: "auto", overflowY: "hidden", display: "flex",
          paddingRight: selected && view === "list" ? 360 : 0,
          transition: "padding-right 0.2s ease", boxSizing: "border-box",
        }}>
          <div style={{ display: "flex", minWidth: "max-content", width: "100%", height: "100%" }}>
            {(["overdue", "dueToday", "upcoming"] as const).map((type, idx) => {
              const items = { overdue, dueToday, upcoming }[type];
              return (
                <div
                  key={type}
                  className="animate-fade-up"
                  style={{
                    width: 380, minWidth: 320, flex: "1 0 320px",
                    padding: "18px 20px",
                    borderRight: idx < 2 ? "1px solid var(--border)" : "none",
                    height: "100%",
                    animationDelay: `${idx * 40 + 80}ms`,
                  }}
                >
                  <Column type={type} items={items} selectedId={selected?.id} onSelect={handleSelect} onOpen={handleOpenFull} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selected && view === "list" && (
        <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", zIndex: 50 }}>
          <LeadDetailPanel lead={selected} onClose={() => { setSelected(null); setView("list"); }} onOpenFullPage={handleOpenFull} avatarIndex={0} />
        </div>
      )}
    </div>
  );
}