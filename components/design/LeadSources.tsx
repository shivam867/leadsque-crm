"use client";
import { useState } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { leadSources } from "@/data/dummy";

// ─── Types ───────────────────────────────────────────────────────
export interface LeadSource {
  id: string;
  name: string;
  enabled: boolean;
}

// ─── Constants ───────────────────────────────────────────────────
export const DEFAULT_SOURCES: LeadSource[] = [
  { id: "ls1", name: "Website",      enabled: true  },
  { id: "ls2", name: "Referral",     enabled: true  },
  { id: "ls3", name: "Cold Call",    enabled: true  },
  { id: "ls4", name: "Instagram Ad", enabled: true  },
  { id: "ls5", name: "Google Ad",    enabled: true  },
  // { id: "ls6", name: "YouTube",      enabled: true  },
  // { id: "ls7", name: "Seminar",      enabled: true  },
  // { id: "ls8", name: "Walk-in",      enabled: true  },
  // { id: "ls9", name: "WhatsApp",     enabled: false },
];

// ─── Shared styles ────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "#fff", border: "1px solid #E5E7EB",
  borderRadius: 12, overflow: "hidden",
};

const cardHeader: React.CSSProperties = {
  padding: "11px 16px", borderBottom: "1px solid #F3F4F6",
  display: "flex", alignItems: "center", justifyContent: "space-between",
};

const cardBody: React.CSSProperties = { padding: "14px 16px" };

const sectionTitle: React.CSSProperties = {
  fontSize: 13, fontWeight: 700, color: "#111827", margin: 0,
};

const inputStyle: React.CSSProperties = {
  fontSize: 12, padding: "7px 10px", borderRadius: 7,
  border: "1px solid #E5E7EB", color: "#111827",
  background: "#fff", outline: "none", width: "100%",
  boxSizing: "border-box" as const,
};

function tag(color: string): React.CSSProperties {
  return {
    fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99,
    background: color + "18", color, border: `1px solid ${color}30`,
  };
}

// ─── Source Row ───────────────────────────────────────────────────
function SourceRow({
  source, onChange, onDelete,
}: {
  source: LeadSource;
  onChange: (s: LeadSource) => void;
  onDelete: () => void;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 9,
      padding: "6px 0", borderBottom: "1px solid #F9FAFB",
    }}>
      <input
        value={source.name}
        onChange={e => onChange({ ...source, name: e.target.value })}
        style={{ ...inputStyle, flex: 1, opacity: source.enabled ? 1 : 0.5 }}
      />
      <button
        onClick={() => onChange({ ...source, enabled: !source.enabled })}
        style={{ background: "none", border: "none", cursor: "pointer", color: source.enabled ? "#059669" : "#D1D5DB", display: "flex", flexShrink: 0 }}
      >
        {source.enabled ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
      </button>
      <button
        onClick={onDelete}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#F87171", display: "flex", flexShrink: 0 }}
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function LeadSources({
  sources,
  setSources,
}: {
  sources: LeadSource[];
  setSources: React.Dispatch<React.SetStateAction<LeadSource[]>>;
}) {
  const [newSourceName, setNewSourceName] = useState("");

  const addSource = () => {
    if (!newSourceName.trim()) return;
    setSources(prev => [...prev, { id: `ls${Date.now()}`, name: newSourceName.trim(), enabled: true }]);
    setNewSourceName("");
  };

  const updateSource = (updated: LeadSource) =>
    setSources(prev => prev.map(s => s.id === updated.id ? updated : s));

  const deleteSource = (id: string) =>
    setSources(prev => prev.filter(s => s.id !== id));

  const totalLeads = leadSources.reduce((a, s) => a + s.leads, 0);
  const sortedSources = [...leadSources].sort((a, b) => b.conversionRate - a.conversionRate);

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

        {/* Channels list */}
        <div style={card}>
          <div style={cardHeader}>
            <p style={sectionTitle}>Channels</p>
            <span style={tag("#059669")}>{sources.filter(s => s.enabled).length} active</span>
          </div>
          <div style={cardBody}>
            {sources.map(source => (
              <SourceRow
                key={source.id}
                source={source}
                onChange={updateSource}
                onDelete={() => deleteSource(source.id)}
              />
            ))}
            <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
              <input
                value={newSourceName}
                onChange={e => setNewSourceName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addSource()}
                placeholder="New source…"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                onClick={addSource}
                style={{
                  display: "flex", alignItems: "center", gap: 4, padding: "7px 12px",
                  borderRadius: 7, background: "#111827", color: "#fff",
                  fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", flexShrink: 0,
                }}
              >
                <Plus size={12} /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Performance from real dummy data */}
        <div style={card}>
          <div style={cardHeader}>
            <p style={sectionTitle}>Conversion by Source</p>
            <span style={{ fontSize: 10, color: "#9CA3AF" }}>{totalLeads} total leads</span>
          </div>
          <div style={cardBody}>
            {sortedSources.map(s => {
              const convColor = s.conversionRate >= 30 ? "#059669"
                : s.conversionRate >= 15 ? "#D97706"
                : "#9CA3AF";
              return (
                <div key={s.source} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                  <span style={{ fontSize: 11, color: "#374151", minWidth: 82, flexShrink: 0 }}>{s.source}</span>
                  <div style={{ flex: 1, height: 5, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${s.conversionRate}%`,
                      background: convColor, borderRadius: 99,
                    }} />
                  </div>
                  <span style={{ fontSize: 10, color: "#9CA3AF", minWidth: 28, textAlign: "right" }}>
                    {s.enrolled}/{s.leads}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: convColor, minWidth: 30, textAlign: "right" }}>
                    {s.conversionRate}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}