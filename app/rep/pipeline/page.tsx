"use client";
import { useState } from "react";
import { leads } from "@/data/dummy";
import LeadDetailPanel from "@/components/ui/LeadDetailPanel";
import LeadFullPage from "@/components/ui/LeadFullPage";
import CallIntelligencePage from "@/components/ui/CallIntelligencePage";
import type { Lead, LeadStatus } from "@/data/dummy";
import { TrendingUp, Phone, Calendar, MapPin } from "lucide-react";

const myLeads = leads.filter(l => l.assignedTo === "Aanya Sharma");

const KANBAN_STAGES: { status: LeadStatus; label: string; color: string; bg: string; border: string }[] = [
  { status: "New",        label: "New",        color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" },
  { status: "Contacted",  label: "Contacted",  color: "#475569", bg: "#F8FAFC", border: "#CBD5E1" },
  { status: "Interested", label: "Interested", color: "#15803D", bg: "#F0FDF4", border: "#BBF7D0" },
  { status: "Follow-up",  label: "Follow-up",  color: "#B45309", bg: "#FFFBEB", border: "#FDE68A" },
  { status: "Qualified",  label: "Qualified",  color: "#7E22CE", bg: "#FAF5FF", border: "#DDD6FE" },
];

const SCORE_COLORS: Record<string, { bg: string; text: string }> = {
  Hot:    { bg: "#FFF1F2", text: "#BE123C" },
  Medium: { bg: "#FFFBEB", text: "#B45309" },
  Cold:   { bg: "#EFF6FF", text: "#1D4ED8" },
};

const PRIO_COLORS: Record<string, string> = { High: "#E24B4A", Medium: "#EF9F27", Low: "#94A3B8" };

const AVATAR_PALETTE = [
  { bg: "#EFF6FF", text: "#1D4ED8" },
  { bg: "#F0FDF4", text: "#15803D" },
  { bg: "#FFFBEB", text: "#B45309" },
  { bg: "#FAF5FF", text: "#7E22CE" },
];

type View = "list" | "full" | "intel";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2);
}

function KanbanCard({
  lead, isSelected, onSelect, avatarIndex,
}: {
  lead: Lead; isSelected: boolean; onSelect: (l: Lead) => void; avatarIndex: number;
}) {
  const palette = AVATAR_PALETTE[avatarIndex % 4];
  const sc = SCORE_COLORS[lead.score] ?? SCORE_COLORS.Cold;

  return (
    <div
      onClick={() => onSelect(lead)}
      className="rounded-xl p-3 cursor-pointer transition-all"
      style={{
        background: isSelected ? "#EFF6FF" : "var(--surface)",
        border: `0.5px solid ${isSelected ? "#BFDBFE" : "var(--border)"}`,
        boxShadow: isSelected ? "0 0 0 2px #BFDBFE" : undefined,
      }}
      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; }}
      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: PRIO_COLORS[lead.priority] ?? "#94A3B8" }} />
        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-medium flex-shrink-0"
          style={{ background: palette.bg, color: palette.text }}>
          {getInitials(lead.name)}
        </div>
        <p className="text-xs font-medium truncate flex-1"
          style={{ color: isSelected ? "#1D4ED8" : "var(--text-primary)" }}>
          {lead.name}
        </p>
        <span className="text-xs font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
          style={{ background: sc.bg, color: sc.text, fontSize: 10 }}>
          {lead.score}
        </span>
      </div>

      <p className="text-xs mb-2 truncate" style={{ color: "#374151" }}>{lead.service}</p>

      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 text-xs" style={{ color: "#374151" }}>
          <MapPin size={9} strokeWidth={2} />{lead.city}
        </span>
        {lead.followUpDate && (
          <span className="ml-auto flex items-center gap-1 text-xs"
            style={{ color: "#374151", fontFamily: "monospace", fontSize: 10 }}>
            <Calendar size={9} strokeWidth={2} />{lead.followUpDate}
          </span>
        )}
      </div>
    </div>
  );
}

function KanbanColumn({
  stage, columnLeads, onSelect, selectedId, globalOffset,
}: {
  stage: typeof KANBAN_STAGES[number];
  columnLeads: Lead[];
  onSelect: (l: Lead) => void;
  selectedId?: string;
  globalOffset: number;
}) {
  return (
    <div className="flex flex-col rounded-xl flex-shrink-0"
      style={{ width: 220, background: "var(--surface-2)", border: "0.5px solid var(--border)" }}>
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-t-xl"
        style={{ borderBottom: `2px solid ${stage.border}` }}>
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: stage.color }} />
        <span className="text-xs font-medium flex-1" style={{ color: stage.color }}>{stage.label}</span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: stage.bg, color: stage.color, border: `0.5px solid ${stage.border}` }}>
          {columnLeads.length}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-2 overflow-y-auto flex-1" style={{ maxHeight: "calc(100vh - 220px)" }}>
        {columnLeads.length === 0 ? (
          <div className="text-center text-xs py-8 rounded-lg"
            style={{ color: "#374151", border: "1px dashed var(--border-strong)" }}>
            Empty
          </div>
        ) : (
          columnLeads.map((lead, i) => (
            <KanbanCard
              key={lead.id}
              lead={lead}
              isSelected={selectedId === lead.id}
              onSelect={onSelect}
              avatarIndex={(globalOffset + i) % 4}
            />
          ))
        )}
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

  const handleOpenFullPage = (lead: Lead) => {
    setSelected(lead);
    setView("full");
  };

  const handleOpenCallIntelligence = (lead: Lead) => {
    setSelected(lead);
    setView("intel");
  };

  const hot       = myLeads.filter(l => l.score === "Hot"       && KANBAN_STAGES.some(s => s.status === l.status)).length;
  const qualified = myLeads.filter(l => l.status === "Qualified").length;
  const won       = myLeads.filter(l => l.status === "Won").length;
  const active    = myLeads.filter(l => KANBAN_STAGES.some(s => s.status === l.status)).length;

  if (view === "full" && selected) {
    return (
      <LeadFullPage
        lead={selected}
        onBack={() => setView("list")}
        onOpenCallIntelligence={handleOpenCallIntelligence}
        avatarIndex={avatarIndex}
      />
    );
  }

  if (view === "intel" && selected) {
    return (
      <CallIntelligencePage
        lead={selected}
        onBack={() => setView("full")}
      />
    );
  }

  return (
    <div className="flex h-full" style={{ background: "var(--surface-bg, var(--surface-2))" }}>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-lg font-medium mb-0.5" style={{ color: "var(--text-primary)" }}>Pipeline</h1>
              <p className="text-sm" style={{ color: "#374151" }}>{active} active lead{active !== 1 ? "s" : ""}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <TrendingUp size={13} strokeWidth={2} />, label: "Hot leads",      value: hot,       color: "#BE123C", bg: "#FFF1F2" },
              { icon: <Phone size={13} strokeWidth={2} />,      label: "Qualified",      value: qualified, color: "#7E22CE", bg: "#FAF5FF" },
              { icon: <Calendar size={13} strokeWidth={2} />,   label: "Won this month", value: won,       color: "#065F46", bg: "#ECFDF5" },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                style={{ background: "var(--surface)", border: "0.5px solid var(--border)" }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: stat.bg, color: stat.color }}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-base font-medium leading-none" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#374151" }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kanban board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden px-5 pb-5">
          <div className="flex gap-3 h-full" style={{ minWidth: "max-content" }}>
            {KANBAN_STAGES.map((stage, si) => {
              const columnLeads = myLeads.filter(l => l.status === stage.status);
              const offset = KANBAN_STAGES.slice(0, si).reduce(
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
          onOpenCallIntelligence={handleOpenCallIntelligence}
          avatarIndex={avatarIndex}
        />
      )}
    </div>
  );
}