"use client";
import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────
export interface Stage {
  id: string;
  name: string;
  color: string;
  isTerminal: boolean;
  isWon: boolean;
}

// ─── Constants ───────────────────────────────────────────────────
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

const PALETTE_COLORS = [
  "#2563EB","#7C3AED","#059669","#B45309","#B91C1C",
  "#0891B2","#C026D3","#D97706","#374151","#0F766E",
  "#E11D48","#9333EA","#16A34A","#EA580C","#6366F1",
];

// ─── Shared card styles ───────────────────────────────────────────
const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #E5E7EB",
  borderRadius: 12,
  overflow: "hidden",
};

const cardHeader: React.CSSProperties = {
  padding: "11px 16px",
  borderBottom: "1px solid #F3F4F6",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const cardBody: React.CSSProperties = { padding: "14px 16px" };

const sectionTitle: React.CSSProperties = {
  fontSize: 13, fontWeight: 700, color: "#111827", margin: 0,
};

const sectionSub: React.CSSProperties = {
  fontSize: 11, color: "#6B7280", margin: "2px 0 0",
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

// ─── Stage Row ───────────────────────────────────────────────────
function StageRow({
  stage, onChange, onDelete, isDeletable,
}: {
  stage: Stage;
  onChange: (s: Stage) => void;
  onDelete: () => void;
  isDeletable: boolean;
}) {
  const [showPalette, setShowPalette] = useState(false);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 7,
      padding: "7px 0", borderBottom: "1px solid #F9FAFB",
    }}>
      <GripVertical size={13} style={{ color: "#D1D5DB", flexShrink: 0, cursor: "grab" }} />

      {/* Color picker */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setShowPalette(p => !p)}
          style={{
            width: 18, height: 18, borderRadius: "50%", background: stage.color,
            border: "2px solid #fff", boxShadow: "0 0 0 1px #E5E7EB",
            cursor: "pointer", flexShrink: 0,
          }}
        />
        {showPalette && (
          <div style={{
            position: "absolute", top: 24, left: 0, zIndex: 10,
            background: "#fff", border: "1px solid #E5E7EB", borderRadius: 9,
            padding: 7, display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
            gap: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}>
            {PALETTE_COLORS.map(c => (
              <button
                key={c}
                onClick={() => { onChange({ ...stage, color: c }); setShowPalette(false); }}
                style={{
                  width: 16, height: 16, borderRadius: "50%", background: c,
                  border: "none", cursor: "pointer",
                  outline: stage.color === c ? `2px solid ${c}` : "none",
                  outlineOffset: 2,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <input
        value={stage.name}
        onChange={e => onChange({ ...stage, name: e.target.value })}
        style={{ ...inputStyle, flex: 1, fontSize: 12, padding: "5px 8px" }}
      />

      <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
        <button
          onClick={() => onChange({
            ...stage,
            isWon: !stage.isWon,
            isTerminal: !stage.isWon ? true : stage.isTerminal,
          })}
          style={{
            fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 5,
            cursor: "pointer", border: "1px solid",
            background: stage.isWon ? "#ECFDF5" : "#F9FAFB",
            color: stage.isWon ? "#059669" : "#9CA3AF",
            borderColor: stage.isWon ? "#A7F3D0" : "#E5E7EB",
          }}
        >
          Won
        </button>
        <button
          onClick={() => onChange({ ...stage, isTerminal: !stage.isTerminal })}
          style={{
            fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 5,
            cursor: "pointer", border: "1px solid",
            background: stage.isTerminal ? "#FEF2F2" : "#F9FAFB",
            color: stage.isTerminal ? "#B91C1C" : "#9CA3AF",
            borderColor: stage.isTerminal ? "#FECACA" : "#E5E7EB",
          }}
        >
          End
        </button>
      </div>

      <button
        onClick={onDelete}
        disabled={!isDeletable}
        style={{
          background: "none", border: "none",
          cursor: isDeletable ? "pointer" : "default",
          color: isDeletable ? "#F87171" : "#E5E7EB",
          flexShrink: 0, display: "flex", alignItems: "center",
        }}
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

// ─── Pipeline Preview ─────────────────────────────────────────────
function PipelinePreview({
  activeStages,
  terminalStages,
}: {
  activeStages: Stage[];
  terminalStages: Stage[];
}) {
  return (
    <div style={card}>
      <div style={cardHeader}><p style={sectionTitle}>Preview</p></div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
          {activeStages.map((stage, i) => (
            <div key={stage.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: stage.color + "20", border: `2px solid ${stage.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: stage.color }} />
                </div>
                <span style={{
                  fontSize: 8, fontWeight: 700, color: stage.color,
                  textAlign: "center", maxWidth: 46, lineHeight: 1.2,
                }}>
                  {stage.name}
                </span>
              </div>
              {i < activeStages.length - 1 && (
                <div style={{ width: 14, height: 1.5, background: "#E5E7EB", marginBottom: 14 }} />
              )}
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 14, marginLeft: 4 }}>
            <div style={{ height: 1.5, width: 12, background: "#E5E7EB" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 14 }}>
            {terminalStages.map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: s.color }}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function PipelineStages({
  stages,
  setStages,
}: {
  stages: Stage[];
  setStages: React.Dispatch<React.SetStateAction<Stage[]>>;
}) {
  const [newStageName, setNewStageName] = useState("");

  const activeStages   = stages.filter(s => !s.isTerminal);
  const terminalStages = stages.filter(s => s.isTerminal);

  const addStage = () => {
    if (!newStageName.trim()) return;
    setStages(prev => [
      ...prev,
      { id: `s${Date.now()}`, name: newStageName.trim(), color: "#6366F1", isTerminal: false, isWon: false },
    ]);
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
        <div style={card}>
          <div style={cardHeader}>
            <div>
              <p style={sectionTitle}>Active Stages</p>
              <p style={sectionSub}>Leads progress through these</p>
            </div>
            <span style={tag("#2563EB")}>{activeStages.length}</span>
          </div>
          <div style={cardBody}>
            {activeStages.map(stage => (
              <StageRow
                key={stage.id}
                stage={stage}
                onChange={updateStage}
                onDelete={() => deleteStage(stage.id)}
                isDeletable={activeStages.length > 2}
              />
            ))}
            <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
              <input
                value={newStageName}
                onChange={e => setNewStageName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addStage()}
                placeholder="New stage name…"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                onClick={addStage}
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

        {/* Terminal stages + preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={card}>
            <div style={cardHeader}>
              <div>
                <p style={sectionTitle}>Terminal Stages</p>
                <p style={sectionSub}>Won or Lost end states</p>
              </div>
            </div>
            <div style={cardBody}>
              {terminalStages.map(stage => (
                <StageRow
                  key={stage.id}
                  stage={stage}
                  onChange={updateStage}
                  onDelete={() => deleteStage(stage.id)}
                  isDeletable={terminalStages.length > 1}
                />
              ))}
            </div>
          </div>

          <PipelinePreview activeStages={activeStages} terminalStages={terminalStages} />
        </div>
      </div>
    </div>
  );
}