"use client";
import { useState } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { leadSources } from "@/data/dummy";

export interface LeadSource {
  id: string;
  name: string;
  enabled: boolean;
}

export const DEFAULT_SOURCES: LeadSource[] = [
  { id: "ls1", name: "Website",      enabled: true },
  { id: "ls2", name: "Referral",     enabled: true },
  { id: "ls3", name: "Cold Call",    enabled: true },
  { id: "ls4", name: "Instagram Ad", enabled: true },
  { id: "ls5", name: "Google Ad",    enabled: true },
];

function SourceRow({ source, onChange, onDelete }: {
  source: LeadSource;
  onChange: (s: LeadSource) => void;
  onDelete: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 0", borderBottom: "1px solid var(--surface-2)" }}>
      <input
        value={source.name}
        onChange={e => onChange({ ...source, name: e.target.value })}
        className="input"
        style={{ flex: 1, fontSize: 12, padding: "7px 10px", opacity: source.enabled ? 1 : 0.5 }}
      />
      <button
        onClick={() => onChange({ ...source, enabled: !source.enabled })}
        style={{ background: "none", border: "none", cursor: "pointer", color: source.enabled ? "var(--success)" : "var(--border-strong)", display: "flex", flexShrink: 0 }}
      >
        {source.enabled ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
      </button>
      <button
        onClick={onDelete}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", display: "flex", flexShrink: 0 }}
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

export default function LeadSources({ sources, setSources }: {
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

  const totalLeads    = leadSources.reduce((a, s) => a + s.leads, 0);
  const sortedSources = [...leadSources].sort((a, b) => b.conversionRate - a.conversionRate);

  const convColor = (rate: number) =>
    rate >= 30 ? "var(--success)" : rate >= 15 ? "var(--warning)" : "var(--text-muted)";

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

        {/* Channels list */}
        <div className="card">
          <div style={{ padding: "11px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Channels</p>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: "var(--success-light)", color: "var(--success)", border: "1px solid var(--success-border)" }}>
              {sources.filter(s => s.enabled).length} active
            </span>
          </div>
          <div style={{ padding: "14px 16px" }}>
            {sources.map(source => (
              <SourceRow key={source.id} source={source} onChange={updateSource} onDelete={() => deleteSource(source.id)} />
            ))}
            <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
              <input
                value={newSourceName}
                onChange={e => setNewSourceName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addSource()}
                placeholder="New source…"
                className="input"
                style={{ flex: 1, fontSize: 12, padding: "7px 10px" }}
              />
              <button onClick={addSource} className="btn-primary" style={{ fontSize: 12, padding: "7px 12px", flexShrink: 0 }}>
                <Plus size={12} /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Conversion by source */}
        <div className="card">
          <div style={{ padding: "11px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Conversion by Source</p>
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{totalLeads} total leads</span>
          </div>
          <div style={{ padding: "14px 16px" }}>
            {sortedSources.map(s => (
              <div key={s.source} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                <span style={{ fontSize: 11, color: "var(--text-secondary)", minWidth: 82, flexShrink: 0 }}>{s.source}</span>
                <div style={{ flex: 1, height: 5, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${s.conversionRate}%`, background: convColor(s.conversionRate), borderRadius: 99 }} />
                </div>
                <span style={{ fontSize: 10, color: "var(--text-muted)", minWidth: 28, textAlign: "right" }}>
                  {s.enrolled}/{s.leads}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: convColor(s.conversionRate), minWidth: 30, textAlign: "right" }}>
                  {s.conversionRate}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}