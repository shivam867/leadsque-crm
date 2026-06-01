"use client";
import { useState } from "react";
import { leads } from "@/data/dummy";
import { StatusBadge, ScoreBadge } from "@/components/ui/Badges";
import LeadDetailPanel from "@/components/ui/LeadDetailPanel";
import LeadFullPage from "@/components/ui/LeadFullPage";
import CallIntelligencePage from "@/components/ui/CallIntelligencePage";
import type { Lead } from "@/data/dummy";
import {
  Phone, Calendar, Clock, CheckCheck,
  AlertCircle, ChevronRight,
} from "lucide-react";

const myLeads = leads.filter(l => l.assignedTo === "Aanya Sharma" && l.followUpDate);
const today = "2025-05-28";
const overdue  = myLeads.filter(l => l.followUpDate < today);
const dueToday = myLeads.filter(l => l.followUpDate === today);
const upcoming = myLeads.filter(l => l.followUpDate > today);

type View = "list" | "full" | "intel";

interface SectionProps {
  title: string;
  subtitle: string;
  items: Lead[];
  color: string;
  icon: React.ReactNode;
  onSelect: (l: Lead, index: number) => void;
  selectedId?: string;
  globalOffset: number;
}

function FollowUpSection({ title, subtitle, items, color, icon, onSelect, selectedId, globalOffset }: SectionProps) {
  if (items.length === 0) return null;
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color }}>{icon}</span>
        <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: "#374151" }}>
          {title}
        </h2>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
          {items.length}
        </span>
        <span className="text-xs" style={{ color: "#374151" }}>{subtitle}</span>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((lead, i) => (
          <FollowUpCard
            key={lead.id}
            lead={lead}
            color={color}
            isSelected={selectedId === lead.id}
            onSelect={l => onSelect(l, globalOffset + i)}
            animDelay={i * 30}
          />
        ))}
      </div>
    </div>
  );
}

function FollowUpCard({
  lead, color, isSelected, onSelect, animDelay,
}: {
  lead: Lead; color: string; isSelected: boolean; onSelect: (l: Lead) => void; animDelay: number;
}) {
  return (
    <div
      onClick={() => onSelect(lead)}
      className="card p-4 cursor-pointer transition-all animate-fade-up"
      style={{
        animationDelay: `${animDelay}ms`,
        background: isSelected ? "var(--accent-light)" : "var(--surface)",
        border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`,
      }}
      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; }}
      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{ background: "var(--surface-2)", color: "var(--text-primary)" }}>
          {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{lead.name}</span>
            <ScoreBadge score={lead.score} />
            <StatusBadge status={lead.status} />
          </div>
          <p className="text-xs mb-1" style={{ color: "#374151" }}>
            {lead.service} · {lead.phone} · {lead.city}
          </p>
          {lead.notes && (
            <p className="text-xs italic truncate max-w-sm" style={{ color: "var(--text-secondary)" }}>
              {lead.notes}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 text-xs font-medium" style={{ color }}>
            <Calendar size={11} />
            {lead.followUpDate}
          </div>
          <button
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: color + "15", color, border: `1px solid ${color}30` }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = color + "25"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = color + "15"}>
            <Phone size={11} /> Call
          </button>
          <button
            onClick={e => { e.stopPropagation(); onSelect(lead); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: "var(--surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
            <ChevronRight size={11} /> View
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RepFollowUps() {
  const [selected, setSelected] = useState<Lead | null>(null);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [view, setView] = useState<View>("list");

  const handleSelect = (lead: Lead, index: number) => {
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

  // Running offset so avatar colors don't reset per section
  const overdueOffset  = 0;
  const dueTodayOffset = overdue.length;
  const upcomingOffset = overdue.length + dueToday.length;

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 overflow-y-auto min-w-0 max-w-4xl">
        <div className="mb-6 animate-fade-up">
          <h1 className="text-xl font-bold tracking-tight mb-0.5" style={{ color: "var(--text-primary)" }}>
            Follow-ups
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {overdue.length} overdue · {dueToday.length} due today · {upcoming.length} upcoming
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-up delay-50">
          {[
            { icon: <AlertCircle size={14} />, label: "Overdue",    value: overdue.length,   color: "#DC2626" },
            { icon: <Clock size={14} />,       label: "Due Today",  value: dueToday.length,  color: "#D97706" },
            { icon: <CheckCheck size={14} />,  label: "Upcoming",   value: upcoming.length,  color: "#059669" },
          ].map(s => (
            <div key={s.label} className="card p-3 flex items-center gap-3">
              <span style={{ color: s.color }}>{s.icon}</span>
              <div>
                <p className="text-xl font-bold leading-none" style={{ color: "var(--text-primary)" }}>{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: "#374151" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="animate-fade-up delay-100">
          <FollowUpSection
            title="Overdue" subtitle="— call immediately"
            items={overdue} color="#DC2626" icon={<AlertCircle size={14} />}
            onSelect={handleSelect} selectedId={selected?.id} globalOffset={overdueOffset}
          />
          <FollowUpSection
            title="Due Today" subtitle="— scheduled for today"
            items={dueToday} color="#D97706" icon={<Clock size={14} />}
            onSelect={handleSelect} selectedId={selected?.id} globalOffset={dueTodayOffset}
          />
          <FollowUpSection
            title="Upcoming" subtitle="— scheduled ahead"
            items={upcoming} color="#059669" icon={<Calendar size={14} />}
            onSelect={handleSelect} selectedId={selected?.id} globalOffset={upcomingOffset}
          />

          {myLeads.length === 0 && (
            <div className="py-20 text-center">
              <CheckCheck size={36} style={{ color: "#374151", margin: "0 auto 12px" }} />
              <p className="text-sm font-medium" style={{ color: "#374151" }}>No follow-ups scheduled.</p>
            </div>
          )}
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