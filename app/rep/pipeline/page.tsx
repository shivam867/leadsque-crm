"use client";
import { useState } from "react";
import { leads, PIPELINE_STAGES, SCORE_CONFIG } from "@/data/dummy";
import LeadDetailPanel from "@/components/ui/LeadDetailPanel";
import LeadDetailPage from "@/components/lead-detail/LeadDetailPage";
import type { Lead } from "@/data/dummy";
import { TrendingUp, Phone, DollarSign, MapPin, Calendar, Flame } from "lucide-react";

const myLeads = leads.filter(l => l.assignedTo === "Aanya Sharma");

const PRIO_COLORS: Record<string, string> = {
  High:   "var(--danger)",
  Medium: "var(--warning)",
  Low:    "var(--border-strong)",
};

type View = "list" | "full";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2);
}

function KanbanCard({ lead, isSelected, onSelect }: {
  lead: Lead; isSelected: boolean; onSelect: (l: Lead) => void;
}) {
  const sc = SCORE_CONFIG[lead.score] ?? SCORE_CONFIG.Cold;

  return (
    <div
      onClick={() => onSelect(lead)}
      className="card card-hover"
      style={{
        padding: "10px 12px",
        cursor: "pointer",
        background: isSelected ? "var(--surface-2)" : "var(--surface)",
        borderColor: isSelected ? "var(--border-strong)" : "var(--border)",
        borderLeft: `3px solid ${isSelected ? "var(--text-primary)" : PRIO_COLORS[lead.priority] ?? "var(--border)"}`,
        borderRadius: "var(--radius-md)",
        transition: "all 0.12s",
      }}
    >
      {/* Row 1: initials + name + score badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
        <div style={{
          width: 24, height: 24, borderRadius: "var(--radius-sm)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, fontWeight: 700, flexShrink: 0,
          background: "var(--surface-3)", color: "var(--text-secondary)",
          border: "1px solid var(--border-strong)",
          letterSpacing: "0.02em",
        }}>
          {getInitials(lead.name)}
        </div>
        <p style={{
          fontSize: 13, fontWeight: 600, color: "var(--text-primary)",
          flex: 1, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          letterSpacing: "-0.02em",
        }}>
          {lead.name}
        </p>
        <span
          className="badge"
          style={{ background: sc.bg, color: sc.text, fontSize: 10 }}
        >
          {lead.score}
        </span>
      </div>

      {/* Row 2: service */}
      <p style={{
        fontSize: 11, color: "var(--text-muted)",
        margin: "0 0 8px", overflow: "hidden",
        textOverflow: "ellipsis", whiteSpace: "nowrap",
        letterSpacing: "-0.01em",
      }}>
        {lead.service}
      </p>

      {/* Row 3: city + date */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "var(--text-muted)" }}>
          <MapPin size={10} strokeWidth={2} style={{ flexShrink: 0 }} />
          {lead.city}
        </span>
        {lead.followUpDate && (
          <span style={{
            display: "flex", alignItems: "center", gap: 3,
            fontSize: 11, color: "var(--text-muted)",
            marginLeft: "auto", fontFamily: "'JetBrains Mono', monospace",
          }}>
            <Calendar size={10} strokeWidth={2} style={{ flexShrink: 0 }} />
            {lead.followUpDate}
          </span>
        )}
      </div>

      {/* Score progress bar */}
      {typeof lead.leadScore === "number" && (
        <div style={{ marginTop: 9, height: 3, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${lead.leadScore}%`,
            borderRadius: 99,
            background: lead.leadScore >= 70
              ? "var(--success)"
              : lead.leadScore >= 40
              ? "var(--warning)"
              : "var(--border-strong)",
            transition: "width 0.3s ease",
          }} />
        </div>
      )}
    </div>
  );
}

const STAT_ITEMS = (hot: number, negotiation: number, enrolled: number) => [
  {
    icon: <Flame size={14} strokeWidth={2} />,
    label: "Hot Leads",
    value: hot,
    iconBg: "var(--danger-light)",
    iconColor: "var(--danger)",
  },
  {
    icon: <Phone size={14} strokeWidth={2} />,
    label: "Negotiation",
    value: negotiation,
    iconBg: "var(--surface-3)",
    iconColor: "var(--text-secondary)",
  },
  {
    icon: <DollarSign size={14} strokeWidth={2} />,
    label: "Enrolled",
    value: enrolled,
    iconBg: "var(--success-light)",
    iconColor: "var(--success)",
  },
];

export default function RepPipeline() {
  const [selected, setSelected] = useState<Lead | null>(null);
  const [view, setView]         = useState<View>("list");

  const handleSelect   = (lead: Lead) => { setSelected(prev => prev?.id === lead.id ? null : lead); setView("list"); };
  const handleOpenFull = (lead: Lead) => { setSelected(lead); setView("full"); };
  const handleClose    = () => { setSelected(null); setView("list"); };

  const hot         = myLeads.filter(l => l.score === "Hot" && PIPELINE_STAGES.some(s => s.status === l.status)).length;
  const negotiation = myLeads.filter(l => l.status === "Negotiation").length;
  const enrolled    = myLeads.filter(l => l.status === "Enrolled").length;
  const active      = myLeads.filter(l => PIPELINE_STAGES.some(s => s.status === l.status)).length;

  if (view === "full" && selected) {
    return <LeadDetailPage lead={selected} onBack={() => setView("list")} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)", overflow: "hidden" }}>

      {/* ── Header ── */}
      <div style={{
        padding: "20px 24px 16px",
        flexShrink: 0,
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div className="animate-fade-up" style={{ marginBottom: 14 }}>
          <h1 className="page-title">Pipeline</h1>
          <p className="page-subtitle">{active} active lead{active !== 1 ? "s" : ""}</p>
        </div>

        {/* ── Stat cards ── */}
        <div
          className="animate-fade-up"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, animationDelay: "40ms" }}
        >
          {STAT_ITEMS(hot, negotiation, enrolled).map(stat => (
            <div key={stat.label} className="card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "var(--radius-md)",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: stat.iconBg, color: stat.iconColor, flexShrink: 0,
              }}>
                {stat.icon}
              </div>
              <div>
                <p style={{
                  fontSize: 20, fontWeight: 800, color: "var(--text-primary)",
                  margin: 0, lineHeight: 1, letterSpacing: "-0.03em",
                }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "2px 0 0", letterSpacing: "-0.01em" }}>
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Kanban board ── */}
      <div
        className="animate-fade-up"
        style={{
          flex: 1,
          overflowX: "auto",
          overflowY: "hidden",
          padding: "16px 24px 20px",
          animationDelay: "80ms",
          paddingRight: selected && view === "list" ? "calc(24px + 360px)" : "24px",
          transition: "padding-right 0.2s ease",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", gap: 8, height: "100%", minWidth: "max-content" }}>
          {PIPELINE_STAGES.map((stage) => {
            const columnLeads = myLeads.filter(l => l.status === stage.status);
            return (
              <div
                key={stage.status}
                style={{
                  display: "flex", flexDirection: "column",
                  flexShrink: 0, width: 214,
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                }}
              >
                {/* Column header */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "9px 12px 8px",
                  borderBottom: `2px solid ${stage.color}`,
                  background: "var(--surface)",
                  flexShrink: 0,
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: stage.color }} />
                  <span style={{
                    fontSize: 12, fontWeight: 700, flex: 1,
                    color: "var(--text-primary)", letterSpacing: "-0.02em",
                  }}>
                    {stage.label}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    padding: "1px 7px", borderRadius: "var(--radius-full)",
                    background: columnLeads.length ? "var(--surface-3)" : "transparent",
                    color: columnLeads.length ? "var(--text-secondary)" : "var(--text-muted)",
                    border: "1px solid var(--border)",
                    letterSpacing: "-0.01em",
                  }}>
                    {columnLeads.length}
                  </span>
                </div>

                {/* Cards list */}
                <div style={{
                  display: "flex", flexDirection: "column", gap: 6,
                  padding: 8, overflowY: "auto", flex: 1,
                }}>
                  {columnLeads.length === 0 ? (
                    <div style={{
                      textAlign: "center", fontSize: 12,
                      color: "var(--text-muted)", padding: "24px 0",
                      border: "1px dashed var(--border-strong)",
                      borderRadius: "var(--radius-md)",
                      letterSpacing: "-0.01em",
                    }}>
                      No leads
                    </div>
                  ) : columnLeads.map((lead, i) => (
                    <div
                      key={lead.id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${Math.min(i, 6) * 30}ms` }}
                    >
                      <KanbanCard lead={lead} isSelected={selected?.id === lead.id} onSelect={handleSelect} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Slide-in detail panel ── */}
      {selected && view === "list" && (
        <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", zIndex: 50 }}>
          <LeadDetailPanel lead={selected} onClose={handleClose} onOpenFullPage={handleOpenFull} avatarIndex={0} />
        </div>
      )}
    </div>
  );
}