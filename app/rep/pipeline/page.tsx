"use client";
import { useState } from "react";
import { leads, PIPELINE_STAGES, SCORE_CONFIG } from "@/data/dummy";
import LeadDetailPanel from "@/components/ui/LeadDetailPanel";
import LeadDetailPage from "@/components/lead-detail/LeadDetailPage";
import type { Lead } from "@/data/dummy";
import { TrendingUp, Phone, DollarSign, MapPin, Calendar } from "lucide-react";

const myLeads = leads.filter(l => l.assignedTo === "Aanya Sharma");

const PRIO_COLORS: Record<string, string> = {
  High:   "var(--danger)",
  Medium: "var(--text-muted)",
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
      style={{
        padding: "11px 12px", borderRadius: 8, cursor: "pointer",
        background: isSelected ? "var(--surface-3)" : "var(--surface-2)",
        border: `1px solid ${isSelected ? "var(--border-strong)" : "var(--border)"}`,
        borderLeft: `3px solid ${isSelected ? "var(--text-primary)" : "transparent"}`,
        transition: "all 0.12s",
      }}
      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface-3)"; }}
      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; }}
    >
      {/* Row 1: priority dot + initials + name + score */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", flexShrink: 0, background: PRIO_COLORS[lead.priority] ?? "var(--text-muted)" }} />
        <div style={{ width: 22, height: 22, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, background: "var(--surface-3)", color: "var(--text-secondary)", border: "1px solid var(--border-strong)" }}>
          {getInitials(lead.name)}
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", flex: 1, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {lead.name}
        </p>
        <span style={{ fontSize: 11, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: sc.bg, color: sc.text, flexShrink: 0, whiteSpace: "nowrap" }}>
          {lead.score}
        </span>
      </div>

      {/* Row 2: service */}
      <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 7px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {lead.service}
      </p>

      {/* Row 3: city + date */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "var(--text-secondary)" }}>
          <MapPin size={9} strokeWidth={2} />{lead.city}
        </span>
        {lead.followUpDate && (
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "var(--text-secondary)", marginLeft: "auto", fontFamily: "monospace" }}>
            <Calendar size={9} strokeWidth={2} />{lead.followUpDate}
          </span>
        )}
      </div>

      {/* Score bar */}
      {typeof lead.leadScore === "number" && (
        <div style={{ marginTop: 8, height: 2, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${lead.leadScore}%`, borderRadius: 99, background: lead.leadScore >= 70 ? "var(--success)" : lead.leadScore >= 40 ? "var(--warning)" : "var(--border-strong)" }} />
        </div>
      )}
    </div>
  );
}

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

      {/* Header */}
      <div style={{ padding: "20px 24px 14px", flexShrink: 0, background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        <div className="animate-fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <h1 className="page-title" style={{ fontSize: 18, marginBottom: 2 }}>Pipeline</h1>
            <p className="page-subtitle">{active} active lead{active !== 1 ? "s" : ""}</p>
          </div>
        </div>

        <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, animationDelay: "40ms" }}>
          {[
            { icon: <TrendingUp size={14} />, label: "Hot Leads",   value: hot,        accentColor: "var(--danger)" },
            { icon: <Phone size={14} />,      label: "Negotiation", value: negotiation, accentColor: "var(--text-primary)" },
            { icon: <DollarSign size={14} />, label: "Enrolled",    value: enrolled,    accentColor: "var(--success)" },
          ].map(stat => (
            <div key={stat.label} className="card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px" }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-2)", color: "var(--text-secondary)", flexShrink: 0 }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: 0, lineHeight: 1, letterSpacing: "-0.02em" }}>{stat.value}</p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "1px 0 0" }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban board */}
      <div className="animate-fade-up" style={{ flex: 1, overflowX: "auto", overflowY: "hidden", padding: "16px 24px 20px", animationDelay: "80ms", paddingRight: selected && view === "list" ? `calc(24px + 360px)` : "24px", transition: "padding-right 0.2s ease", boxSizing: "border-box" }}>
        <div style={{ display: "flex", gap: 10, height: "100%", minWidth: "max-content" }}>
          {PIPELINE_STAGES.map((stage) => {
            const columnLeads = myLeads.filter(l => l.status === stage.status);
            return (
              <div key={stage.status} style={{ display: "flex", flexDirection: "column", borderRadius: 8, flexShrink: 0, width: 210, background: "transparent", border: "1px solid var(--border)", overflow: "hidden" }}>
                {/* Column header */}
                <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 12px 9px", borderBottom: `2px solid ${stage.color}`, flexShrink: 0 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: stage.color }} />
                  <span style={{ fontSize: 12, fontWeight: 700, flex: 1, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{stage.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "1px 6px", borderRadius: 99, background: "var(--surface-3)", color: "var(--text-secondary)" }}>
                    {columnLeads.length}
                  </span>
                </div>

                {/* Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: 8, overflowY: "auto", flex: 1 }}>
                  {columnLeads.length === 0 ? (
                    <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", padding: "20px 0", border: "1px dashed var(--border)", borderRadius: 6 }}>
                      Empty
                    </div>
                  ) : columnLeads.map((lead, i) => (
                    <div key={lead.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 6) * 30}ms` }}>
                      <KanbanCard lead={lead} isSelected={selected?.id === lead.id} onSelect={handleSelect} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selected && view === "list" && (
        <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", zIndex: 50 }}>
          <LeadDetailPanel lead={selected} onClose={handleClose} onOpenFullPage={handleOpenFull} avatarIndex={0} />
        </div>
      )}
    </div>
  );
}