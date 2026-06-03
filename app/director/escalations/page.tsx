"use client";
import React, { useState } from "react";
import { AlertTriangle, Clock, CheckCircle, ArrowUp, Undo2, X, ChevronsUp } from "lucide-react";
import { escalations, salesReps } from "@/data/dummy";

type Severity = "High" | "Medium" | "Low";

interface EscalationItem {
  id: string; lead: string; rep: string; reason: string;
  severity: string; raisedAt: string; resolved: boolean;
  escalatedUp: boolean; note: string; team: string; age: string;
}

const SEV_CONFIG: Record<Severity, { color: string; bg: string; border: string; dot: string }> = {
  High:   { color: "var(--danger)",  bg: "var(--danger-light)",  border: "var(--danger-border)",  dot: "var(--danger)" },
  Medium: { color: "var(--warning)", bg: "var(--warning-light)", border: "var(--warning-border)", dot: "var(--warning)" },
  Low:    { color: "var(--info)",    bg: "var(--info-light)",    border: "var(--info-border)",    dot: "var(--info)" },
};

// Data-driven team palette — intentional chart colors
const TEAM_COLORS: Record<string, string> = {
  Alpha: "#1a56db", Beta: "#7e3af2", Gamma: "#0e9f6e",
};

// Action configs — intentional per-action semantic colors
const ACTION_CONFIG: Record<string, { label: string; type: string; color: string; bg: string; border: string }> = {
  "ESC-01": { label: "Approve Discount",    type: "approve-discount",    color: "var(--success)", bg: "var(--success-light)", border: "var(--success-border)" },
  "ESC-02": { label: "Schedule Coaching",   type: "coaching",            color: "var(--info)",    bg: "var(--info-light)",    border: "var(--info-border)" },
  "ESC-03": { label: "Approve Scholarship", type: "approve-scholarship", color: "var(--success)", bg: "var(--success-light)", border: "var(--success-border)" },
};
const DEFAULT_ACTION = { label: "Escalate Further", type: "escalate", color: "var(--danger)", bg: "var(--danger-light)", border: "var(--danger-border)" };

const MODAL_CONFIG: Record<string, { title: string; sub: string; cta: string; ctaColor: string }> = {
  "approve-discount":    { title: "Approve Discount",     sub: "This will allow the rep to offer a discount up to 10%.", cta: "Approve Discount",    ctaColor: "var(--success)" },
  "coaching":            { title: "Schedule Coaching",    sub: "A coaching session will be logged for the manager.",    cta: "Schedule Session",    ctaColor: "var(--info)" },
  "approve-scholarship": { title: "Approve Scholarship",  sub: "This will grant the lead a partial fee waiver.",        cta: "Approve Scholarship", ctaColor: "var(--success)" },
  "escalate":            { title: "Escalate Further",     sub: "This will flag the issue for senior leadership.",       cta: "Confirm Escalation",  ctaColor: "var(--danger)" },
};

function getRepTeam(repName: string)   { return salesReps.find(r => r.name === repName)?.team ?? "Alpha"; }
function getRepAvatar(repName: string) { return salesReps.find(r => r.name === repName)?.avatar ?? "??"; }
function getAge(severity: string)      { return severity === "High" ? "2 days" : severity === "Medium" ? "3 days" : "4 days"; }

function ActionModal({ type, onClose, onConfirm }: { type: string | null; onClose: () => void; onConfirm: (note: string) => void }) {
  const [note, setNote] = React.useState("");
  if (!type) return null;
  const c = MODAL_CONFIG[type] ?? MODAL_CONFIG["escalate"];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div className="animate-scale-in card" style={{ width: 420, padding: 24 }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px" }}>{c.title}</h3>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 16px" }}>{c.sub}</p>
        <textarea className="input" placeholder="Add a note (optional)…" rows={3} value={note} onChange={e => setNote(e.target.value)} style={{ marginBottom: 14 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => onConfirm(note)} className="btn-primary" style={{ flex: 1, background: c.ctaColor }}>{c.cta}</button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function DirectorEscalations() {
  const [items, setItems] = useState<EscalationItem[]>(
    escalations.map(e => ({ ...e, resolved: false, escalatedUp: false, note: "", team: getRepTeam(e.rep), age: getAge(e.severity) }))
  );
  const [actionModal, setActionModal] = useState<string | null>(null);
  const [activeId, setActiveId]       = useState<string | null>(null);
  const [teamFilter, setTeamFilter]   = useState("All");
  const [sevFilter, setSevFilter]     = useState("All");

  const open     = items.filter(e => !e.resolved && !e.escalatedUp);
  const resolved = items.filter(e => e.resolved);
  const esclUp   = items.filter(e => e.escalatedUp);

  const filtered = open
    .filter(e => teamFilter === "All" || e.team === teamFilter)
    .filter(e => sevFilter === "All" || e.severity === sevFilter)
    .sort((a, b) => (["High", "Medium", "Low"] as Severity[]).indexOf(a.severity as Severity) - (["High", "Medium", "Low"] as Severity[]).indexOf(b.severity as Severity));

  const counts = {
    High:   open.filter(e => e.severity === "High").length,
    Medium: open.filter(e => e.severity === "Medium").length,
    Low:    open.filter(e => e.severity === "Low").length,
  };

  const resolveItem  = (id: string, note = "") => { setItems(prev => prev.map(e => e.id === id ? { ...e, resolved: true, note } : e)); setActiveId(null); };
  const escalateItem = (id: string)             => setItems(prev => prev.map(e => e.id === id ? { ...e, escalatedUp: true } : e));
  const handleModalConfirm = (note: string)     => { if (activeId) resolveItem(activeId, note); setActionModal(null); };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 900, background: "var(--bg)", minHeight: "100%" }}>

      {/* Header */}
      <div className="animate-fade-up" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: 4 }}>Director View</p>
          <h1 className="page-title">Escalations</h1>
          <p className="page-subtitle">{open.length} open · {resolved.length} resolved · {esclUp.length} escalated up</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["High", "Medium", "Low"] as Severity[]).map(s => {
            const cfg = SEV_CONFIG[s];
            return (
              <div key={s} style={{ padding: "10px 14px", borderRadius: 10, background: cfg.bg, border: `1px solid ${cfg.border}`, textAlign: "center", minWidth: 64 }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: cfg.color, margin: 0, lineHeight: 1 }}>{counts[s]}</p>
                <p style={{ fontSize: 10, color: cfg.color, margin: "3px 0 0", opacity: 0.8 }}>{s}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="animate-fade-up" style={{ display: "flex", gap: 8, marginBottom: 16, animationDelay: "40ms", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Severity:</span>
        {["All", "High", "Medium", "Low"].map(s => (
          <button key={s} onClick={() => setSevFilter(s)}
            style={{ padding: "5px 12px", fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: "pointer", transition: "all .15s", background: sevFilter === s ? "var(--text-primary)" : "var(--surface)", color: sevFilter === s ? "#fff" : "var(--text-secondary)", border: `1.5px solid ${sevFilter === s ? "var(--text-primary)" : "var(--border)"}` }}>
            {s}
          </button>
        ))}
        <div style={{ width: 1, height: 20, background: "var(--border)" }} />
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Team:</span>
        {["All", "Alpha", "Beta", "Gamma"].map(t => (
          <button key={t} onClick={() => setTeamFilter(t)}
            style={{ padding: "5px 12px", fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: "pointer", transition: "all .15s", background: teamFilter === t ? "var(--accent)" : "var(--surface)", color: teamFilter === t ? "#fff" : "var(--text-secondary)", border: `1.5px solid ${teamFilter === t ? "var(--accent)" : "var(--border)"}` }}>
            {t}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 10, animationDelay: "80ms" }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ padding: "56px 0", textAlign: "center" }}>
            <CheckCircle size={28} style={{ color: "var(--success)", margin: "0 auto 8px", display: "block" }} />
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 4px" }}>All clear!</p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>No open escalations match this filter.</p>
          </div>
        ) : filtered.map((e, i) => {
          const cfg       = SEV_CONFIG[e.severity as Severity];
          const teamColor = TEAM_COLORS[e.team] ?? "var(--text-secondary)";
          const repAvatar = getRepAvatar(e.rep);
          const action    = ACTION_CONFIG[e.id] ?? DEFAULT_ACTION;

          return (
            <div key={e.id} className="animate-fade-up card" style={{ padding: 0, overflow: "hidden", animationDelay: `${Math.min(i, 5) * 40}ms`, borderLeft: `4px solid ${cfg.color}` }}>
              <div style={{ padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "monospace", color: "var(--text-muted)" }}>{e.id}</span>
                      <span className="badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, display: "flex", alignItems: "center", gap: 4 }}>
                        <AlertTriangle size={9} /> {e.severity}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: teamColor + "18", color: teamColor, border: `1px solid ${teamColor}30` }}>
                        Team {e.team}
                      </span>
                      <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={9} /> {e.raisedAt} · {e.age} ago
                      </span>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px" }}>{e.lead}</p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 10px", lineHeight: 1.5 }}>{e.reason}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 20, height: 20, borderRadius: 6, background: "var(--info-light)", color: "var(--info)", fontSize: 7, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {repAvatar}
                      </div>
                      <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>Rep: <strong style={{ color: "var(--text-primary)" }}>{e.rep}</strong></span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7, flexShrink: 0 }}>
                    <button onClick={() => { setActiveId(e.id); setActionModal(action.type); }}
                      style={{ padding: "7px 14px", borderRadius: 8, background: action.bg, color: action.color, fontSize: 12, fontWeight: 600, border: `1px solid ${action.border}`, cursor: "pointer", whiteSpace: "nowrap" }}>
                      {action.label}
                    </button>
                    <button onClick={() => escalateItem(e.id)}
                      style={{ padding: "7px 14px", borderRadius: 8, background: "var(--accent-light)", color: "var(--accent)", fontSize: 12, fontWeight: 600, border: "1px solid var(--accent-border)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}>
                      <ChevronsUp size={13} /> Escalate Up
                    </button>
                    <button onClick={() => resolveItem(e.id)} className="btn-secondary" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}>
                      <CheckCircle size={13} /> Mark Resolved
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Escalated up */}
      {esclUp.length > 0 && (
        <div className="animate-fade-up" style={{ marginTop: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: 10 }}>Escalated up ({esclUp.length})</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {esclUp.map(e => (
              <div key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 9, background: "var(--accent-light)", border: "1px solid var(--accent-border)", opacity: 0.85 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ArrowUp size={14} style={{ color: "var(--accent)" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{e.lead}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{e.id}</span>
                </div>
                <button onClick={() => setItems(prev => prev.map(i => i.id === e.id ? { ...i, escalatedUp: false } : i))}
                  className="btn-ghost" style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                  <Undo2 size={11} /> Undo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resolved */}
      {resolved.length > 0 && (
        <div className="animate-fade-up" style={{ marginTop: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: 10 }}>Resolved this session ({resolved.length})</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {resolved.map(e => (
              <div key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 9, background: "var(--surface-2)", border: "1px solid var(--border)", opacity: 0.7 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle size={14} style={{ color: "var(--success)" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", textDecoration: "line-through" }}>{e.lead}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{e.id}</span>
                  {e.note ? <span style={{ fontSize: 11, color: "var(--text-secondary)", fontStyle: "italic" }}>· "{e.note}"</span> : null}
                </div>
                <button onClick={() => setItems(prev => prev.map(i => i.id === e.id ? { ...i, resolved: false } : i))}
                  className="btn-ghost" style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                  <Undo2 size={11} /> Undo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <ActionModal type={actionModal} onClose={() => { setActionModal(null); setActiveId(null); }} onConfirm={handleModalConfirm} />
    </div>
  );
}