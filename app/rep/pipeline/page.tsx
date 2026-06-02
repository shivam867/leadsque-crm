"use client";
import { useState } from "react";
import { leads, PIPELINE_STAGES, SCORE_CONFIG } from "@/data/dummy";
import LeadDetailPanel from "@/components/ui/LeadDetailPanel";
import LeadFullPage from "@/components/ui/LeadFullPage";
import type { Lead, LeadStatus } from "@/data/dummy";
import { TrendingUp, Phone, DollarSign, MapPin, Calendar } from "lucide-react";

const myLeads = leads.filter(l => l.assignedTo === "Aanya Sharma");

const PRIO_COLORS: Record<string, string> = { High: "#EF4444", Medium: "#F59E0B", Low: "#9CA3AF" };

const AVATAR_PALETTE = [
  { bg: "#EFF6FF", text: "#1D4ED8" },
  { bg: "#F0FDF4", text: "#15803D" },
  { bg: "#FFFBEB", text: "#B45309" },
  { bg: "#FAF5FF", text: "#7E22CE" },
];

type View = "list" | "full";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2);
}

function KanbanCard({ lead, isSelected, onSelect, avatarIndex }: {
  lead: Lead; isSelected: boolean; onSelect: (l: Lead) => void; avatarIndex: number;
}) {
  const palette = AVATAR_PALETTE[avatarIndex % 4];
  const sc = SCORE_CONFIG[lead.score] ?? SCORE_CONFIG.Cold;

  return (
    <div
      onClick={() => onSelect(lead)}
      style={{
        padding: "12px", borderRadius: 10, cursor: "pointer",
        background: isSelected ? "#EFF6FF" : "#fff",
        border: `1.5px solid ${isSelected ? "#BFDBFE" : "#E5E7EB"}`,
        boxShadow: isSelected ? "0 0 0 2px #BFDBFE" : "0 1px 2px rgba(0,0,0,0.04)",
        transition: "all 0.15s",
      }}
      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#F9FAFB"; }}
      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#fff"; }}>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: PRIO_COLORS[lead.priority] ?? "#9CA3AF" }} />
        <div style={{ width: 24, height: 24, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, background: palette.bg, color: palette.text }}>
          {getInitials(lead.name)}
        </div>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#111827", flex: 1, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {lead.name}
        </p>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 99, background: sc.bg, color: sc.text, flexShrink: 0 }}>
          {lead.score}
        </span>
      </div>

      <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.service}</p>

      <div style={{ display: "flex", gap: 8 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#6B7280" }}>
          <MapPin size={9} strokeWidth={2} />{lead.city}
        </span>
        {lead.followUpDate && (
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#6B7280", marginLeft: "auto", fontFamily: "monospace" }}>
            <Calendar size={9} strokeWidth={2} />{lead.followUpDate}
          </span>
        )}
      </div>

      {typeof lead.leadScore === "number" && (
        <div style={{ marginTop: 8, height: 3, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${lead.leadScore}%`, borderRadius: 99,
            background: lead.leadScore >= 70 ? "#059669" : lead.leadScore >= 40 ? "#D97706" : "#9CA3AF",
          }} />
        </div>
      )}
    </div>
  );
}

function KanbanColumn({ stage, columnLeads, onSelect, selectedId, globalOffset }: {
  stage: typeof PIPELINE_STAGES[number];
  columnLeads: Lead[];
  onSelect: (l: Lead) => void;
  selectedId?: string;
  globalOffset: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", borderRadius: 14, flexShrink: 0, width: 218, background: "#F3F4F6", border: "1px solid #E5E7EB" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px 10px", borderBottom: `2px solid ${stage.color}` }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: stage.color }} />
        <span style={{ fontSize: 12, fontWeight: 700, flex: 1, color: "#374151" }}>{stage.label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: stage.bg, color: stage.color, border: `1px solid ${stage.border}` }}>
          {columnLeads.length}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 8, overflowY: "auto", flex: 1, maxHeight: "calc(100vh - 230px)" }}>
        {columnLeads.length === 0
          ? <div style={{ textAlign: "center", fontSize: 12, color: "#9CA3AF", padding: "24px 0", border: "1.5px dashed #E5E7EB", borderRadius: 9 }}>Empty</div>
          : columnLeads.map((lead, i) => (
              <KanbanCard
                key={lead.id}
                lead={lead}
                isSelected={selectedId === lead.id}
                onSelect={onSelect}
                avatarIndex={(globalOffset + i) % 4}
              />
            ))
        }
      </div>
    </div>
  );
}

export default function RepPipeline() {
  const [selected, setSelected] = useState<Lead | null>(null);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [view, setView] = useState<View>("list");

  const handleSelect = (lead: Lead) => {
    const index = myLeads.indexOf(lead);
    setSelected(prev => prev?.id === lead.id ? null : lead);
    setAvatarIndex(index % 4);
    setView("list");
  };

  const handleOpenFullPage = (lead: Lead) => { setSelected(lead); setView("full"); };

  const hot      = myLeads.filter(l => l.score === "Hot" && PIPELINE_STAGES.some(s => s.status === l.status)).length;
  const negotiation = myLeads.filter(l => l.status === "Negotiation").length;
  const enrolled = myLeads.filter(l => l.status === "Enrolled").length;
  const active   = myLeads.filter(l => PIPELINE_STAGES.some(s => s.status === l.status)).length;

  if (view === "full" && selected) {
    return <LeadFullPage lead={selected} onBack={() => setView("list")} avatarIndex={avatarIndex} />;
  }

  return (
    <div style={{ display: "flex", height: "100%", background: "#F9FAFB" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px 16px", flexShrink: 0, background: "#F9FAFB" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 2px", letterSpacing: "-0.02em" }}>Pipeline</h1>
              <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>{active} active lead{active !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { icon: <TrendingUp size={14} />, label: "Hot Leads",   value: hot,         color: "#BE123C", bg: "#FFF1F2" },
              { icon: <Phone size={14} />,      label: "Negotiation", value: negotiation,  color: "#7E22CE", bg: "#FAF5FF" },
              { icon: <DollarSign size={14} />, label: "Enrolled",    value: enrolled,     color: "#065F46", bg: "#ECFDF5" },
            ].map(stat => (
              <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB" }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: stat.bg, color: stat.color, flexShrink: 0 }}>
                  {stat.icon}
                </div>
                <div>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1 }}>{stat.value}</p>
                  <p style={{ fontSize: 11, color: "#6B7280", margin: "2px 0 0" }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kanban board */}
        <div style={{ flex: 1, overflowX: "auto", overflowY: "hidden", padding: "0 24px 24px" }}>
          <div style={{ display: "flex", gap: 12, height: "100%", minWidth: "max-content" }}>
            {PIPELINE_STAGES.map((stage, si) => {
              const columnLeads = myLeads.filter(l => l.status === stage.status);
              const offset = PIPELINE_STAGES.slice(0, si).reduce(
                (acc, s) => acc + myLeads.filter(l => l.status === s.status).length, 0
              );
              return (
                <KanbanColumn
                  key={stage.status}
                  stage={stage}
                  columnLeads={columnLeads}
                  onSelect={handleSelect}
                  selectedId={selected?.id}
                  globalOffset={offset}
                />
              );
            })}
          </div>
        </div>
      </div>

      {selected && (
        <LeadDetailPanel
          lead={selected}
          onClose={() => { setSelected(null); setView("list"); }}
          onOpenFullPage={handleOpenFullPage}
          avatarIndex={avatarIndex}
        />
      )}
    </div>
  );
}