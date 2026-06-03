"use client";
import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";

export interface Stage {
  id: string;
  name: string;
  color: string;
  isTerminal: boolean;
  isWon: boolean;
}

export const DEFAULT_STAGES: Stage[] = [
  { id: "s1", name: "New",            color: "#2563EB", isTerminal: false, isWon: false },
  { id: "s2", name: "Contacted",      color: "#475569", isTerminal: false, isWon: false },
  { id: "s3", name: "Qualified",      color: "#0369A1", isTerminal: false, isWon: false },
  { id: "s4", name: "Proposal Sent",  color: "#7C3AED", isTerminal: false, isWon: false },
  { id: "s5", name: "Negotiation",    color: "#B45309", isTerminal: false, isWon: false },
  { id: "s6", name: "Enrolled",       color: "#059669", isTerminal: true,  isWon: true  },
  { id: "s7", name: "Lost",           color: "#B91C1C", isTerminal: true,  isWon: false },
  { id: "s8", name: "Not Interested", color: "#6B7280", isTerminal: true,  isWon: false },
];

// These are data-driven user-configurable stage colors — kept as hex since users pick them
const PALETTE_COLORS = [
  "#2563EB","#7C3AED","#059669","#B45309","#B91C1C",
  "#0891B2","#C026D3","#D97706","#374151","#0F766E",
  "#E11D48","#9333EA","#16A34A","#EA580C","#6366F1",
];

function StageRow({ stage, onChange, onDelete, isDeletable }: {
  stage: Stage;
  onChange: (s: Stage) => void;
  onDelete: () => void;
  isDeletable: boolean;
}) {
  const [showPalette, setShowPalette] = useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 0", borderBottom: "1px solid var(--surface-2)" }}>
      <GripVertical size={13} style={{ color: "var(--border-strong)", flexShrink: 0, cursor: "grab" }} />

      {/* Color picker */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setShowPalette(p => !p)}
          style={{ width: 18, height: 18, borderRadius: "50%", background: stage.color, border: "2px solid var(--surface)", boxShadow: "0 0 0 1px var(--border)", cursor: "pointer", flexShrink: 0 }}
        />
        {showPalette && (
          <div style={{ position: "absolute", top: 24, left: 0, zIndex: 10, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 9, padding: 7, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            {PALETTE_COLORS.map(c => (
              <button
                key={c}
                onClick={() => { onChange({ ...stage, color: c }); setShowPalette(false); }}
                style={{ width: 16, height: 16, borderRadius: "50%", background: c, border: "none", cursor: "pointer", outline: stage.color === c ? `2px solid ${c}` : "none", outlineOffset: 2 }}
              />
            ))}
          </div>
        )}
      </div>

      <input
        value={stage.name}
        onChange={e => onChange({ ...stage, name: e.target.value })}
        className="input"
        style={{ flex: 1, fontSize: 12, padding: "5px 8px" }}
      />

      <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
        <button
          onClick={() => onChange({ ...stage, isWon: !stage.isWon, isTerminal: !stage.isWon ? true : stage.isTerminal })}
          style={{
            fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 5, cursor: "pointer", border: "1px solid",
            background: stage.isWon ? "var(--success-light)" : "var(--surface-2)",
            color: stage.isWon ? "var(--success)" : "var(--text-muted)",
            borderColor: stage.isWon ? "var(--success-border)" : "var(--border)",
          }}
        >
          Won
        </button>
        <button
          onClick={() => onChange({ ...stage, isTerminal: !stage.isTerminal })}
          style={{
            fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 5, cursor: "pointer", border: "1px solid",
            background: stage.isTerminal ? "var(--danger-light)" : "var(--surface-2)",
            color: stage.isTerminal ? "var(--danger)" : "var(--text-muted)",
            borderColor: stage.isTerminal ? "var(--danger-border)" : "var(--border)",
          }}
        >
          End
        </button>
      </div>

      <button
        onClick={onDelete}
        disabled={!isDeletable}
        style={{ background: "none", border: "none", cursor: isDeletable ? "pointer" : "default", color: isDeletable ? "var(--danger)" : "var(--border)", flexShrink: 0, display: "flex", alignItems: "center" }}
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

function PipelinePreview({
  activeStages,
  terminalStages,
}: {
  activeStages: Stage[];
  terminalStages: Stage[];
}) {
  return (
    <div className="card">
      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>Pipeline preview</p>
        <span style={{ fontSize: 11, color: "var(--text-secondary)", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 20, padding: "2px 8px" }}>
          {activeStages.length} active · {terminalStages.length} terminal
        </span>
      </div>

      <div style={{ padding: "24px 20px 20px", overflowX: "auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", flexWrap: "nowrap" }}>

          {activeStages.map((stage, i) => (
            <div key={stage.id} style={{ display: "flex", alignItems: "flex-start" }}>
              {/* Line touching previous circle */}
              {i > 0 && (
                <div style={{ display: "flex", alignItems: "center", height: 32, margin: "0 -1px", flexShrink: 0 }}>
                  <div style={{ width: 36, height: 1.5, background: "var(--border)" }} />
                </div>
              )}

              {/* Circle + label */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, flexShrink: 0, position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: `1.5px solid ${stage.color}`,
                  background: "var(--bg-primary)",
                  boxShadow: `0 0 0 3px ${stage.color}14`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "transform .15s",
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: stage.color }} />
                </div>
                <div style={{ fontSize: 10, fontWeight: 500, color: stage.color, textAlign: "center", maxWidth: 54, lineHeight: 1.3, whiteSpace: "pre-line" }}>
                  {stage.name}
                </div>
              </div>
            </div>
          ))}

          {/* Fork stub after last active stage */}
          <div style={{ height: 1.5, width: 20, background: "var(--border)", alignSelf: "center", margin: "0 -1px", flexShrink: 0 }} />

          {/* Vertical divider */}
          <div style={{ width: 0.5, alignSelf: "stretch", background: "var(--border)", margin: "0 12px", flexShrink: 0 }} />

          {/* Terminal stages */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7, alignSelf: "center" }}>
            {terminalStages.map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 500, color: t.color }}>{t.name}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function PipelineStages({ stages, setStages }: {
  stages: Stage[];
  setStages: React.Dispatch<React.SetStateAction<Stage[]>>;
}) {
  const [newStageName, setNewStageName] = useState("");

  const activeStages   = stages.filter(s => !s.isTerminal);
  const terminalStages = stages.filter(s => s.isTerminal);

  const addStage = () => {
    if (!newStageName.trim()) return;
    setStages(prev => [...prev, { id: `s${Date.now()}`, name: newStageName.trim(), color: "#6366F1", isTerminal: false, isWon: false }]);
    setNewStageName("");
  };

  const updateStage = (updated: Stage) =>
    setStages(prev => prev.map(s => s.id === updated.id ? updated : s));

  const deleteStage = (id: string) =>
    setStages(prev => prev.filter(s => s.id !== id));

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>

        {/* Active stages */}
        <div className="card">
          <div style={{ padding: "11px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Active Stages</p>
              <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: "2px 0 0" }}>Leads progress through these</p>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: "var(--info-light)", color: "var(--info)", border: "1px solid var(--info-border)" }}>
              {activeStages.length}
            </span>
          </div>
          <div style={{ padding: "14px 16px" }}>
            {activeStages.map(stage => (
              <StageRow key={stage.id} stage={stage} onChange={updateStage} onDelete={() => deleteStage(stage.id)} isDeletable={activeStages.length > 2} />
            ))}
            <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
              <input
                value={newStageName}
                onChange={e => setNewStageName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addStage()}
                placeholder="New stage name…"
                className="input"
                style={{ flex: 1, fontSize: 12, padding: "7px 10px" }}
              />
              <button onClick={addStage} className="btn-primary" style={{ fontSize: 12, padding: "7px 12px", flexShrink: 0 }}>
                <Plus size={12} /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Terminal stages + preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card">
            <div style={{ padding: "11px 16px", borderBottom: "1px solid var(--border)" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Terminal Stages</p>
              <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: "2px 0 0" }}>Won or Lost end states</p>
            </div>
            <div style={{ padding: "14px 16px" }}>
              {terminalStages.map(stage => (
                <StageRow key={stage.id} stage={stage} onChange={updateStage} onDelete={() => deleteStage(stage.id)} isDeletable={terminalStages.length > 1} />
              ))}
            </div>
          </div>
          <PipelinePreview activeStages={activeStages} terminalStages={terminalStages} />
        </div>
      </div>
    </div>
  );
}