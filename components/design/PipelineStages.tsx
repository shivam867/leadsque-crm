"use client";
import { useState } from "react";
import { Plus, Trash2, GripVertical, Check, ArrowRight } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────
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

const PALETTE: string[] = [
  "#2563EB","#7C3AED","#059669","#B45309","#B91C1C",
  "#0891B2","#C026D3","#D97706","#374151","#0F766E",
  "#E11D48","#9333EA","#16A34A","#EA580C","#6366F1",
];

// ─── Color Picker ─────────────────────────────────────────────────
function ColorDot({ color, onChange }: { color: string; onChange: (c: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          width: 16, height: 16, borderRadius: "50%", background: color,
          border: "2px solid #fff", boxShadow: "0 0 0 1px #E5E7EB",
          cursor: "pointer", flexShrink: 0, display: "block",
        }}
      />
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 9 }} />
          <div style={{
            position: "absolute", top: 22, left: 0, zIndex: 10,
            background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8,
            padding: 6, display: "grid", gridTemplateColumns: "repeat(5,1fr)",
            gap: 4, boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
          }}>
            {PALETTE.map(c => (
              <button key={c} onClick={() => { onChange(c); setOpen(false); }}
                style={{
                  width: 15, height: 15, borderRadius: "50%", background: c,
                  border: "none", cursor: "pointer",
                  outline: color === c ? `2px solid ${c}` : "none", outlineOffset: 2,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Stage Row ────────────────────────────────────────────────────
function StageRow({ stage, onChange, onDelete, isDeletable }: {
  stage: Stage; onChange: (s: Stage) => void;
  onDelete: () => void; isDeletable: boolean;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "5px 0", borderBottom: "1px solid #F3F4F6",
    }}>
      <GripVertical size={12} style={{ color: "#D1D5DB", cursor: "grab", flexShrink: 0 }} />
      <ColorDot color={stage.color} onChange={c => onChange({ ...stage, color: c })} />
      <input
        value={stage.name}
        onChange={e => onChange({ ...stage, name: e.target.value })}
        style={{
          flex: 1, fontSize: 12, padding: "4px 7px", borderRadius: 6,
          border: "1px solid #E5E7EB", color: "#111827", background: "#fff",
          outline: "none", minWidth: 0,
        }}
      />
      <button
        onClick={() => onChange({ ...stage, isWon: !stage.isWon, isTerminal: !stage.isWon ? true : stage.isTerminal })}
        style={{
          fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 5,
          cursor: "pointer", border: "1px solid", flexShrink: 0,
          background: stage.isWon ? "#ECFDF5" : "#F9FAFB",
          color: stage.isWon ? "#059669" : "#9CA3AF",
          borderColor: stage.isWon ? "#A7F3D0" : "#E5E7EB",
        }}
      >Won</button>
      <button
        onClick={() => onChange({ ...stage, isTerminal: !stage.isTerminal })}
        style={{
          fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 5,
          cursor: "pointer", border: "1px solid", flexShrink: 0,
          background: stage.isTerminal ? "#FEF2F2" : "#F9FAFB",
          color: stage.isTerminal ? "#B91C1C" : "#9CA3AF",
          borderColor: stage.isTerminal ? "#FECACA" : "#E5E7EB",
        }}
      >End</button>
      <button
        onClick={onDelete} disabled={!isDeletable}
        style={{
          background: "none", border: "none", flexShrink: 0,
          cursor: isDeletable ? "pointer" : "default",
          color: isDeletable ? "#F87171" : "#E5E7EB",
          display: "flex", alignItems: "center", padding: 0,
        }}
      ><Trash2 size={12} /></button>
    </div>
  );
}

// ─── Chevron Preview ──────────────────────────────────────────────
function Preview({ active, terminal }: { active: Stage[]; terminal: Stage[] }) {
  const C = 12; // chevron notch size
  return (
    <div style={{
      background: "#fff", border: "1px solid #E5E7EB",
      borderRadius: 10, overflow: "hidden",
    }}>
      {/* header */}
      <div style={{
        padding: "9px 14px", borderBottom: "1px solid #F3F4F6",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#FAFAFA",
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#374151" }}>Pipeline Preview</span>
        <div style={{ display: "flex", gap: 5 }}>
          <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 8px", borderRadius: 99, background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}>
            {active.length} active
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 8px", borderRadius: 99, background: "#F9FAFB", color: "#6B7280", border: "1px solid #E5E7EB" }}>
            {terminal.length} terminal
          </span>
        </div>
      </div>

      <div style={{ padding: "12px 14px 10px" }}>
        {/* Chevron row */}
        {active.length > 0 ? (
          <div style={{ display: "flex", height: 32, marginBottom: 10 }}>
            {active.map((s, i) => {
              const first = i === 0, last = i === active.length - 1;
              return (
                <div key={s.id} style={{
                  flex: 1, position: "relative",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#111827", color: "#fff",
                  fontSize: 10, fontWeight: 600, overflow: "hidden",
                  whiteSpace: "nowrap",
                  clipPath: first
                    ? `polygon(0 0,calc(100% - ${C}px) 0,100% 50%,calc(100% - ${C}px) 100%,0 100%)`
                    : last
                    ? `polygon(0 0,100% 0,100% 100%,0 100%,${C}px 50%)`
                    : `polygon(0 0,calc(100% - ${C}px) 0,100% 50%,calc(100% - ${C}px) 100%,0 100%,${C}px 50%)`,
                  paddingLeft: first ? 12 : 18,
                  paddingRight: last ? 12 : 18,
                }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</span>
                  {!last && <div style={{ position: "absolute", right: -1, top: 0, bottom: 0, width: 2, background: "#F9FAFB", zIndex: 1 }} />}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB", borderRadius: 6, marginBottom: 10, border: "1px dashed #E5E7EB" }}>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>No active stages</span>
          </div>
        )}

        {/* Terminal pills */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600 }}>End states</span>
          <ArrowRight size={10} style={{ color: "#D1D5DB" }} />
          {terminal.length > 0 ? terminal.map(t => (
            <span key={t.id} style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
              background: t.isWon ? "#ECFDF5" : "#F9FAFB",
              color: t.isWon ? "#059669" : "#6B7280",
              border: `1px solid ${t.isWon ? "#A7F3D0" : "#E5E7EB"}`,
            }}>
              {t.isWon && <Check size={8} strokeWidth={3} />}
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.color }} />
              {t.name}
            </span>
          )) : (
            <span style={{ fontSize: 10, color: "#9CA3AF", fontStyle: "italic" }}>None defined</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function PipelineStages({ stages, setStages }: {
  stages: Stage[];
  setStages: React.Dispatch<React.SetStateAction<Stage[]>>;
}) {
  const [newName, setNewName] = useState("");

  const safeStages   = stages ?? DEFAULT_STAGES;
  const active       = safeStages.filter(s => !s.isTerminal);
  const terminal     = safeStages.filter(s => s.isTerminal);

  const update = (u: Stage) => setStages(p => p.map(s => s.id === u.id ? u : s));
  const remove = (id: string) => setStages(p => p.filter(s => s.id !== id));
  const add    = () => {
    if (!newName.trim()) return;
    setStages(p => [
      ...p.filter(s => !s.isTerminal),
      { id: `s${Date.now()}`, name: newName.trim(), color: "#6366F1", isTerminal: false, isWon: false },
      ...p.filter(s => s.isTerminal),
    ]);
    setNewName("");
  };

  const cardStyle: React.CSSProperties = {
    background: "#fff", border: "1px solid #E5E7EB",
    borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column",
  };

  const hdr = (title: string, sub: string, badge?: React.ReactNode): React.ReactNode => (
    <div style={{
      padding: "9px 13px", borderBottom: "1px solid #F3F4F6",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "#FAFAFA", flexShrink: 0,
    }}>
      <div>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#111827", margin: 0 }}>{title}</p>
        <p style={{ fontSize: 10, color: "#9CA3AF", margin: "1px 0 0" }}>{sub}</p>
      </div>
      {badge}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>

      {/* ── Preview (top, full width) ── */}
      <Preview active={active} terminal={terminal} />

      {/* ── Active + Terminal side by side ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flex: 1, minHeight: 0 }}>

        {/* Active Stages */}
        <div style={cardStyle}>
          {hdr("Active Stages", "Leads progress through these in order",
            <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 99, background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}>
              {active.length}
            </span>
          )}
          <div style={{ padding: "8px 12px", flex: 1, overflowY: "auto" }}>
            {active.map(s => (
              <StageRow key={s.id} stage={s} onChange={update} onDelete={() => remove(s.id)} isDeletable={active.length > 2} />
            ))}
            {active.length === 0 && (
              <p style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", padding: "16px 0", margin: 0 }}>No active stages</p>
            )}
          </div>
          {/* Add row */}
          <div style={{ padding: "8px 12px", borderTop: "1px solid #F3F4F6", display: "flex", gap: 6, flexShrink: 0 }}>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && add()}
              placeholder="New stage name…"
              style={{
                flex: 1, fontSize: 12, padding: "5px 8px", borderRadius: 6,
                border: "1px solid #E5E7EB", outline: "none", color: "#111827",
                minWidth: 0,
              }}
            />
            <button onClick={add} style={{
              display: "flex", alignItems: "center", gap: 4, padding: "5px 11px",
              borderRadius: 6, background: "#111827", color: "#fff",
              fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", flexShrink: 0,
            }}>
              <Plus size={11} /> Add
            </button>
          </div>
        </div>

        {/* Terminal Stages */}
        <div style={cardStyle}>
          {hdr("Terminal Stages", "Won / Lost end states — leads stop here",
            <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 99, background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}>
              {terminal.length}
            </span>
          )}
          <div style={{ padding: "8px 12px", flex: 1, overflowY: "auto" }}>
            {terminal.map(s => (
              <StageRow key={s.id} stage={s} onChange={update} onDelete={() => remove(s.id)} isDeletable={terminal.length > 1} />
            ))}
            {terminal.length === 0 && (
              <p style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", padding: "16px 0", margin: 0 }}>
                Mark a stage as <strong>End</strong> to add it here
              </p>
            )}
          </div>
          {/* hint */}
          <div style={{ padding: "7px 12px", borderTop: "1px solid #F3F4F6", flexShrink: 0 }}>
            <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0, lineHeight: 1.5 }}>
              Toggle <strong>End</strong> on any active stage to move it here. Toggle <strong>Won</strong> to mark it as a successful enrollment.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}