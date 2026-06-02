"use client";
import { useState, useMemo } from "react";
import { salesReps, leads } from "@/data/dummy";
import { salesRepsExtended, type SalesRepExtended } from "@/components/ui/RepDetailPanel";
import RepDetailPanel from "@/components/ui/RepDetailPanel";
import {
  Users, Phone, CheckCircle, TrendingUp,
  AlertCircle, Calendar, ChevronRight, X,
} from "lucide-react";
import type { Lead } from "@/data/dummy";

const today = "2025-05-28";

// ─── Types ───────────────────────────────────────────────────────
interface OverdueModalProps {
  rep: SalesRepExtended;
  overdueLeads: Lead[];
  onClose: () => void;
}

// ─── Avatar palette ───────────────────────────────────────────────
const PALETTES = [
  { bg: "#EFF6FF", text: "#1D4ED8" },
  { bg: "#F0FDF4", text: "#15803D" },
  { bg: "#FFFBEB", text: "#B45309" },
  { bg: "#FAF5FF", text: "#7E22CE" },
  { bg: "#FDF2F8", text: "#9D174D" },
  { bg: "#ECFDF5", text: "#065F46" },
  { bg: "#FFF7ED", text: "#C2410C" },
];

// ─── Overdue Modal ────────────────────────────────────────────────
function OverdueModal({ rep, overdueLeads, onClose }: OverdueModalProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)",
          zIndex: 50, backdropFilter: "blur(2px)",
        }}
      />
      {/* Modal */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 51, width: 520, maxHeight: "80vh",
        background: "#fff", borderRadius: 16,
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 20px", borderBottom: "1px solid #E5E7EB",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>
              Overdue Follow-ups — {rep.name}
            </h3>
            <p style={{ fontSize: 12, color: "#6B7280", margin: "2px 0 0" }}>
              {overdueLeads.length} lead{overdueLeads.length !== 1 ? "s" : ""} past their follow-up date
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", color: "#6B7280",
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Lead list */}
        <div style={{ overflowY: "auto", flex: 1, padding: "12px 16px" }}>
          {overdueLeads.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF" }}>
              <CheckCircle size={28} style={{ margin: "0 auto 8px", color: "#D1D5DB" }} />
              <p style={{ fontSize: 13, margin: 0 }}>No overdue follow-ups</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {overdueLeads.map(lead => {
                const SCORE_CFG = {
                  Hot:  { bg: "#FFF1F2", color: "#BE123C" },
                  Warm: { bg: "#FFFBEB", color: "#B45309" },
                  Cold: { bg: "#EFF6FF", color: "#1D4ED8" },
                };
                const sc = SCORE_CFG[lead.score as keyof typeof SCORE_CFG] ?? { bg: "#F9FAFB", color: "#6B7280" };

                return (
                  <div key={lead.id} style={{
                    padding: "12px 14px", borderRadius: 10,
                    background: "#FEF2F2", border: "1px solid #FECACA",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{lead.name}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99,
                        background: sc.bg, color: sc.color,
                      }}>
                        {lead.score}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: "#374151", margin: "0 0 4px" }}>
                      {lead.service} · {lead.city}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Calendar size={10} style={{ color: "#DC2626" }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#DC2626" }}>
                        Due: {lead.followUpDate}
                      </span>
                      <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 4 }}>{lead.phone}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Rep Card ─────────────────────────────────────────────────────
function RepCard({
  rep,
  index,
  overdueCount,
  onSelect,
  onViewOverdue,
  isSelected,
}: {
  rep: SalesRepExtended;
  index: number;
  overdueCount: number;
  onSelect: () => void;
  onViewOverdue: () => void;
  isSelected: boolean;
}) {
  const palette = PALETTES[index % PALETTES.length];
  const convColor = rep.conversionRate >= 35 ? "#059669"
    : rep.conversionRate >= 28 ? "#D97706"
    : "#DC2626";

  return (
    <div
      style={{
        background: isSelected ? "#EFF6FF" : "#fff",
        border: `1.5px solid ${isSelected ? "#BFDBFE" : "#E5E7EB"}`,
        borderRadius: 14, padding: "16px 18px", cursor: "pointer",
        transition: "all 0.15s",
        boxShadow: isSelected ? "0 0 0 2px #BFDBFE" : "0 1px 3px rgba(0,0,0,0.04)",
      }}
      onClick={onSelect}
      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#F9FAFB"; }}
      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#fff"; }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: palette.bg, color: palette.text,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>
            {rep.avatar}
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0 }}>{rep.name}</p>
            <p style={{ fontSize: 11, color: "#6B7280", margin: "1px 0 0" }}>Team {rep.team}</p>
          </div>
        </div>
        <ChevronRight size={14} style={{ color: "#9CA3AF", marginTop: 2 }} />
      </div>

      {/* Metrics grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[
          { label: "Leads",   value: rep.leadsAssigned, color: "#1D4ED8" },
          { label: "Calls",   value: rep.callsToday,    color: "#0369A1" },
          { label: "Won",     value: rep.wonThisMonth,  color: "#059669" },
          { label: "Conv.",   value: `${rep.conversionRate}%`, color: convColor },
        ].map(m => (
          <div key={m.label} style={{
            padding: "8px 10px", background: "#F9FAFB", borderRadius: 8,
          }}>
            <p style={{ fontSize: 16, fontWeight: 800, color: m.color, margin: 0, lineHeight: 1 }}>{m.value}</p>
            <p style={{ fontSize: 10, color: "#9CA3AF", margin: "2px 0 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Conversion bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1, height: 5, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${rep.conversionRate}%`, background: convColor, borderRadius: 99 }} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: convColor }}>{rep.conversionRate}%</span>
      </div>

      {/* Overdue button */}
      {overdueCount > 0 && (
        <button
          onClick={e => { e.stopPropagation(); onViewOverdue(); }}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 6, padding: "7px 0", borderRadius: 8,
            background: "#FEF2F2", border: "1px solid #FECACA",
            color: "#DC2626", fontSize: 11, fontWeight: 700, cursor: "pointer",
          }}
        >
          <AlertCircle size={12} />
          {overdueCount} overdue follow-up{overdueCount !== 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function TeamPerformance() {
  const [selected, setSelected]       = useState<SalesRepExtended | null>(null);
  const [overdueRep, setOverdueRep]   = useState<SalesRepExtended | null>(null);

  // Build overdue lead counts per rep
  const overdueByRep = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    leads.forEach(lead => {
      if (lead.followUpDate && lead.followUpDate < today) {
        if (!map[lead.assignedTo]) map[lead.assignedTo] = [];
        map[lead.assignedTo].push(lead);
      }
    });
    return map;
  }, []);

  // Lead breakdown for panel chart
  const leadBreakdown = useMemo(() => {
    if (!selected) return [];
    const repLeads = leads.filter(l => l.assignedTo === selected.name);
    const counts: Record<string, number> = {};
    repLeads.forEach(l => { counts[l.status] = (counts[l.status] ?? 0) + 1; });
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [selected]);

  // Team summary stats
  const totalLeads   = salesRepsExtended.reduce((a, r) => a + r.leadsAssigned, 0);
  const totalCalls   = salesRepsExtended.reduce((a, r) => a + r.callsToday, 0);
  const totalWon     = salesRepsExtended.reduce((a, r) => a + r.wonThisMonth, 0);
  const avgConv      = Math.round(salesRepsExtended.reduce((a, r) => a + r.conversionRate, 0) / salesRepsExtended.length);
  const totalOverdue = Object.values(overdueByRep).reduce((a, arr) => a + arr.length, 0);

  return (
    <div style={{ display: "flex", height: "100%", background: "#F9FAFB" }}>

      {/* Main content */}
      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto", minWidth: 0 }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
            Team Performance
          </h1>
          <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
            {salesRepsExtended.length} reps across all teams · May 2025
          </p>
        </div>

        {/* Summary strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total Leads",  value: totalLeads,          color: "#1D4ED8", bg: "#EFF6FF", icon: <Users size={15} /> },
            { label: "Calls Today",  value: totalCalls,          color: "#0369A1", bg: "#F0F9FF", icon: <Phone size={15} /> },
            { label: "Won / Month",  value: totalWon,            color: "#065F46", bg: "#ECFDF5", icon: <CheckCircle size={15} /> },
            { label: "Avg Conv.",    value: `${avgConv}%`,       color: "#7C3AED", bg: "#FAF5FF", icon: <TrendingUp size={15} /> },
            { label: "Overdue",      value: totalOverdue,        color: "#DC2626", bg: "#FEF2F2", icon: <AlertCircle size={15} /> },
          ].map(s => (
            <div key={s.label} style={{
              background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12,
              padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <p style={{ fontSize: 20, fontWeight: 800, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: "#6B7280", margin: "2px 0 0" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Rep cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {salesRepsExtended.map((rep, i) => {
            const overdueLeads = overdueByRep[rep.name] ?? [];
            return (
              <RepCard
                key={rep.id}
                rep={rep}
                index={i}
                overdueCount={overdueLeads.length}
                isSelected={selected?.id === rep.id}
                onSelect={() => setSelected(prev => prev?.id === rep.id ? null : rep)}
                onViewOverdue={() => setOverdueRep(rep)}
              />
            );
          })}
        </div>
      </div>

      {/* Rep detail panel */}
      {selected && (
        <RepDetailPanel
          rep={selected}
          leadBreakdown={leadBreakdown}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Overdue modal */}
      {overdueRep && (
        <OverdueModal
          rep={overdueRep}
          overdueLeads={overdueByRep[overdueRep.name] ?? []}
          onClose={() => setOverdueRep(null)}
        />
      )}
    </div>
  );
}