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
  Medium: "var(--warning)",
  Low:    "var(--text-muted)",
};

type View = "list" | "full";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2);
}

function KanbanCard({ lead, isSelected, onSelect, colorIndex }: {
  lead: Lead; isSelected: boolean; onSelect: (l: Lead) => void; colorIndex: number;
}) {
  const AVATAR_COLORS = [
    { bg: "var(--info-light)",    text: "var(--info)" },
    { bg: "var(--success-light)", text: "var(--success)" },
    { bg: "var(--warning-light)", text: "var(--warning)" },
    { bg: "var(--accent-light)",  text: "var(--accent)" },
  ];
  const av = AVATAR_COLORS[colorIndex % 4];
  const sc = SCORE_CONFIG[lead.score] ?? SCORE_CONFIG.Cold;

  return (
    <div
      onClick={() => onSelect(lead)}
      style={{
        padding: "11px 12px", borderRadius: 9, cursor: "pointer",
        background: isSelected ? "var(--accent-light)" : "var(--surface)",
        border: `1px solid ${isSelected ? "var(--accent-border)" : "var(--border)"}`,
        boxShadow: isSelected ? "0 0 0 2px var(--accent-border)" : "0 1px 2px rgba(0,0,0,0.04)",
        transition: "all 0.12s",
      }}
      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; }}
      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", flexShrink: 0, background: PRIO_COLORS[lead.priority] ?? "var(--text-muted)" }} />
        <div style={{ width: 22, height: 22, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, flexShrink: 0, background: av.bg, color: av.text }}>
          {getInitials(lead.name)}
        </div>
        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", flex: 1, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {lead.name}
        </p>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 5px", borderRadius: 99, background: sc.bg, color: sc.text, flexShrink: 0, whiteSpace: "nowrap" }}>
          {lead.score}
        </span>
      </div>

      <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: "0 0 7px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {lead.service}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "var(--text-muted)" }}>
          <MapPin size={8} strokeWidth={2} />{lead.city}
        </span>
        {lead.followUpDate && (
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "var(--text-muted)", marginLeft: "auto", fontFamily: "monospace" }}>
            <Calendar size={8} strokeWidth={2} />{lead.followUpDate}
          </span>
        )}
      </div>

      {typeof lead.leadScore === "number" && (
        <div style={{ marginTop: 8, height: 2.5, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${lead.leadScore}%`, borderRadius: 99,
            background: lead.leadScore >= 70 ? "var(--success)" : lead.leadScore >= 40 ? "var(--warning)" : "var(--text-muted)",
          }} />
        </div>
      )}
    </div>
  );
}

export default function RepPipeline() {
  const [selected, setSelected] = useState<Lead | null>(null);
  const [view, setView]         = useState<View>("list");

  const handleSelect = (lead: Lead) => {
    setSelected(prev => prev?.id === lead.id ? null : lead);
    setView("list");
  };
  const handleOpenFull = (lead: Lead) => { setSelected(lead); setView("full"); };
  const handleClose    = () => { setSelected(null); setView("list"); };

  const hot         = myLeads.filter(l => l.score === "Hot" && PIPELINE_STAGES.some(s => s.status === l.status)).length;
  const negotiation = myLeads.filter(l => l.status === "Negotiation").length;
  const enrolled    = myLeads.filter(l => l.status === "Enrolled").length;
  const active      = myLeads.filter(l => PIPELINE_STAGES.some(s => s.status === l.status)).length;

  if (view === "full" && selected) {
    return <LeadDetailPage lead={selected} onBack={() => setView("list")} />;
  }

  // Pre-compute global offsets for avatar color cycling
  const stageOffsets: number[] = [];
  PIPELINE_STAGES.reduce((acc, stage) => {
    stageOffsets.push(acc);
    return acc + myLeads.filter(l => l.status === stage.status).length;
  }, 0);

  return (
    <div style={{ display: "flex", height: "100%", background: "var(--bg)" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "20px 24px 14px", flexShrink: 0, background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
          <div className="animate-fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <h1 className="page-title" style={{ fontSize: 18, marginBottom: 2 }}>Pipeline</h1>
              <p className="page-subtitle">{active} active lead{active !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {/* Stat strip — all equal width */}
          <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, animationDelay: "40ms" }}>
            {[
              { icon: <TrendingUp size={14} />, label: "Hot Leads",   value: hot,        color: "var(--danger)",  bg: "var(--danger-light)" },
              { icon: <Phone size={14} />,      label: "Negotiation", value: negotiation, color: "var(--accent)",  bg: "var(--accent-light)" },
              { icon: <DollarSign size={14} />, label: "Enrolled",    value: enrolled,    color: "var(--success)", bg: "var(--success-light)" },
            ].map(stat => (
              <div key={stat.label} className="card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px" }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: stat.bg, color: stat.color, flexShrink: 0 }}>
                  {stat.icon}
                </div>
                <div>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: 0, lineHeight: 1, letterSpacing: "-0.02em" }}>{stat.value}</p>
                  <p style={{ fontSize: 10, color: "var(--text-secondary)", margin: "1px 0 0" }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kanban board — fills remaining height */}
        <div className="animate-fade-up" style={{ flex: 1, overflowX: "auto", overflowY: "hidden", padding: "16px 24px 20px", animationDelay: "80ms" }}>
          <div style={{ display: "flex", gap: 10, height: "100%", minWidth: "max-content" }}>
            {PIPELINE_STAGES.map((stage, si) => {
              const columnLeads = myLeads.filter(l => l.status === stage.status);
              const offset = stageOffsets[si];
              return (
                <div key={stage.status} style={{
                  display: "flex", flexDirection: "column", borderRadius: 12, flexShrink: 0,
                  width: 210,
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                }}>
                  {/* Column header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 12px 10px", borderBottom: `2px solid ${stage.color}` }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: stage.color }} />
                    <span style={{ fontSize: 11, fontWeight: 700, flex: 1, color: "var(--text-secondary)", letterSpacing: "-0.01em" }}>{stage.label}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 99, background: stage.bg, color: stage.color, border: `1px solid ${stage.border}` }}>
                      {columnLeads.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 7, padding: 8, overflowY: "auto", flex: 1 }}>
                    {columnLeads.length === 0 ? (
                      <div style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", padding: "20px 0", border: "1px dashed var(--border)", borderRadius: 8, margin: "4px 0" }}>
                        Empty
                      </div>
                    ) : columnLeads.map((lead, i) => (
                      <div key={lead.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 6) * 30}ms` }}>
                        <KanbanCard
                          lead={lead}
                          isSelected={selected?.id === lead.id}
                          onSelect={handleSelect}
                          colorIndex={offset + i}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selected && view === "list" && (
        <LeadDetailPanel
          lead={selected}
          onClose={handleClose}
          onOpenFullPage={handleOpenFull}
          avatarIndex={0}
        />
      )}
    </div>
  );
}