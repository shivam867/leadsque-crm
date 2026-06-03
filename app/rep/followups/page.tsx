"use client";
import { useState } from "react";
import { leads } from "@/data/dummy";
import { ScoreBadge, StatusBadge } from "@/components/ui/Badges";
import LeadDetailPanel from "@/components/ui/LeadDetailPanel";
import LeadDetailPage from "@/components/lead-detail/LeadDetailPage"; // ★ swapped
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
        <h2 style={{ fontSize: 13, fontWeight: 800, color: "#374151", textTransform: "uppercase" as const, letterSpacing: "0.05em", margin: 0 }}>{title}</h2>
        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: bg, color }}>
          {items.length}
        </span>
        <span style={{ fontSize: 12, color: "#6B7280" }}>{subtitle}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
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
      style={{
        padding: "14px 16px", background: isSelected ? "#EFF6FF" : "#fff",
        border: `1.5px solid ${isSelected ? "#BFDBFE" : "#E5E7EB"}`, borderRadius: 12, cursor: "pointer",
        transition: "all 0.15s", boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#F9FAFB"; }}
      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#fff"; }}>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0, background: "#F9FAFB", color: "#374151", border: "1px solid #E5E7EB" }}>
          {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{lead.name}</span>
            <ScoreBadge score={lead.score} />
            <StatusBadge status={lead.status} />
          </div>
          <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>
            {lead.service} · {lead.phone} · {lead.city}
          </p>
          {lead.followUps[0]?.remarks && (
            <p style={{ fontSize: 11, color: "#9CA3AF", margin: "4px 0 0", fontStyle: "italic" as const, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const, maxWidth: 360 }}>
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
            style={{ display: "flex", alignItems: "center", padding: "6px 10px", borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", color: "#374151" }}>
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

  // ★ swapped — no avatarIndex prop needed
  if (view === "full" && selected) {
    return <LeadDetailPage lead={selected} onBack={() => setView("list")} />;
  }

  return (
    <div style={{ display: "flex", height: "100%", background: "#F9FAFB" }}>
      <div style={{ flex: 1, padding: "24px 28px", overflowY: "auto", minWidth: 0, maxWidth: 860 }}>

        {/* Header */}
        <div className="animate-fade-up" style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Follow-ups</h1>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
            {overdue.length} overdue · {dueToday.length} due today · {upcoming.length} upcoming
          </p>
        </div>

        {/* Summary cards */}
        <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24, animationDelay: "40ms" }}>
          {[
            { icon: <AlertCircle size={16} />, label: "Overdue",   value: overdue.length,  color: "#B91C1C", bg: "#FEF2F2", border: "#FECACA" },
            { icon: <Clock size={16} />,       label: "Due Today", value: dueToday.length, color: "#B45309", bg: "#FFFBEB", border: "#FDE68A" },
            { icon: <CheckCheck size={16} />,  label: "Upcoming",  value: upcoming.length, color: "#065F46", bg: "#ECFDF5", border: "#A7F3D0" },
          ].map(s => (
            <div key={s.label} style={{ padding: "14px 16px", background: "#fff", border: `1px solid ${s.border}`, borderRadius: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: "#6B7280", margin: "2px 0 0" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
          <FollowUpSection
            title="Overdue" subtitle="— call immediately"
            items={overdue} color="#DC2626" bg="#FEF2F2" icon={<AlertCircle size={14} />}
            onSelect={handleSelect} selectedId={selected?.id} globalOffset={0}
          />
          <FollowUpSection
            title="Due Today" subtitle="— scheduled for today"
            items={dueToday} color="#D97706" bg="#FFFBEB" icon={<Clock size={14} />}
            onSelect={handleSelect} selectedId={selected?.id} globalOffset={overdue.length}
          />
          <FollowUpSection
            title="Upcoming" subtitle="— scheduled ahead"
            items={upcoming} color="#059669" bg="#ECFDF5" icon={<Calendar size={14} />}
            onSelect={handleSelect} selectedId={selected?.id} globalOffset={overdue.length + dueToday.length}
          />
        </div>

        {myLeads.length === 0 && (
          <div style={{ textAlign: "center" as const, padding: "64px 0" }}>
            <CheckCheck size={32} style={{ color: "#D1D5DB", margin: "0 auto 10px" }} />
            <p style={{ fontSize: 13, color: "#9CA3AF" }}>No follow-ups scheduled.</p>
          </div>
        )}
      </div>

      {/* ★ guard — panel only in list view */}
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