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
const overdue  = myLeads.filter(l => l.followUpDate < today);
const dueToday = myLeads.filter(l => l.followUpDate === today);
const upcoming = myLeads.filter(l => l.followUpDate > today);

type View = "list" | "full";

interface SectionProps {
  title: string; subtitle: string; items: Lead[];
  color: string; bg: string; icon: React.ReactNode;
  onSelect: (l: Lead, index: number) => void;
  selectedId?: string; globalOffset: number;
}

function FollowUpSection({ title, subtitle, items, color, bg, icon, onSelect, selectedId, globalOffset }: SectionProps) {
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ color }}>{icon}</span>
        <h2 style={{ fontSize: 13, fontWeight: 800, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{title}</h2>
        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: bg, color }}>
          {items.length}
        </span>
        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{subtitle}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((lead, i) => (
          <div key={lead.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
            <FollowUpCard
              lead={lead} color={color} bg={bg}
              isSelected={selectedId === lead.id}
              onSelect={l => onSelect(l, globalOffset + i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function FollowUpCard({ lead, color, bg, isSelected, onSelect }: {
  lead: Lead; color: string; bg: string; isSelected: boolean; onSelect: (l: Lead) => void;
}) {
  return (
    <div
      onClick={() => onSelect(lead)}
      className="card"
      style={{
        padding: "14px 16px",
        background: isSelected ? "var(--accent-light)" : "var(--surface)",
        border: `1.5px solid ${isSelected ? "var(--accent-border)" : "var(--border)"}`,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; }}
      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0, background: "var(--surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
          {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{lead.name}</span>
            <ScoreBadge score={lead.score} />
            <StatusBadge status={lead.status} />
          </div>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0 }}>
            {lead.service} · {lead.phone} · {lead.city}
          </p>
          {lead.followUps[0]?.remarks && (
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "4px 0 0", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 360 }}>
              {lead.followUps[0].remarks}
            </p>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color, background: bg, padding: "4px 8px", borderRadius: 7 }}>
            <Calendar size={10} />{lead.followUpDate}
          </div>
          <button
            onClick={e => e.stopPropagation()}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, background: color + "15", color, border: `1px solid ${color}30`, cursor: "pointer" }}>
            <Phone size={10} /> Call
          </button>
          <button
            onClick={e => { e.stopPropagation(); onSelect(lead); }}
            className="btn-secondary"
            style={{ padding: "6px 10px" }}>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RepFollowUps() {
  const [selected, setSelected]       = useState<Lead | null>(null);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [view, setView]               = useState<View>("list");

  const handleSelect = (lead: Lead, index: number) => {
    setSelected(prev => prev?.id === lead.id ? null : lead);
    setAvatarIndex(index % 4);
    setView("list");
  };

  const handleOpenFullPage = (lead: Lead) => { setSelected(lead); setView("full"); };

  if (view === "full" && selected) {
    return <LeadDetailPage lead={selected} onBack={() => setView("list")} />;
  }

  return (
    <div style={{ display: "flex", height: "100%", background: "var(--bg)" }}>
      <div style={{ flex: 1, padding: "24px 28px", overflowY: "auto", minWidth: 0, maxWidth: 860 }}>

        {/* Header */}
        <div className="animate-fade-up" style={{ marginBottom: 20 }}>
          <h1 className="page-title">Follow-ups</h1>
          <p className="page-subtitle">
            {overdue.length} overdue · {dueToday.length} due today · {upcoming.length} upcoming
          </p>
        </div>

        {/* Summary cards */}
        <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24, animationDelay: "40ms" }}>
          {[
            { icon: <AlertCircle size={16} />, label: "Overdue",   value: overdue.length,  color: "var(--danger)",  bg: "var(--danger-light)",  border: "var(--danger-border)" },
            { icon: <Clock size={16} />,       label: "Due Today", value: dueToday.length, color: "var(--warning)", bg: "var(--warning-light)", border: "var(--warning-border)" },
            { icon: <CheckCheck size={16} />,  label: "Upcoming",  value: upcoming.length, color: "var(--success)", bg: "var(--success-light)", border: "var(--success-border)" },
          ].map(s => (
            <div key={s.label} style={{ padding: "14px 16px", background: "var(--surface)", border: `1px solid ${s.border}`, borderRadius: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <p style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: "2px 0 0" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
          <FollowUpSection
            title="Overdue" subtitle="— call immediately"
            items={overdue} color="var(--danger)" bg="var(--danger-light)" icon={<AlertCircle size={14} />}
            onSelect={handleSelect} selectedId={selected?.id} globalOffset={0}
          />
          <FollowUpSection
            title="Due Today" subtitle="— scheduled for today"
            items={dueToday} color="var(--warning)" bg="var(--warning-light)" icon={<Clock size={14} />}
            onSelect={handleSelect} selectedId={selected?.id} globalOffset={overdue.length}
          />
          <FollowUpSection
            title="Upcoming" subtitle="— scheduled ahead"
            items={upcoming} color="var(--success)" bg="var(--success-light)" icon={<Calendar size={14} />}
            onSelect={handleSelect} selectedId={selected?.id} globalOffset={overdue.length + dueToday.length}
          />
        </div>

        {myLeads.length === 0 && (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <CheckCheck size={32} style={{ color: "var(--border-strong)", margin: "0 auto 10px" }} />
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No follow-ups scheduled.</p>
          </div>
        )}
      </div>

      {selected && view === "list" && (
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