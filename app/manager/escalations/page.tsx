"use client";
import { useState, useMemo } from "react";
import { escalations, salesReps } from "@/data/dummy";

type Severity = "High" | "Medium" | "Low";
type EscalationItem = (typeof escalations)[number] & { resolved?: boolean; escalatedUp?: boolean };

const severityConfig = {
  High:   { bg: "var(--danger-light)",  color: "var(--danger)",  border: "var(--danger-border)",  label: "High Priority", dot: "var(--danger)" },
  Medium: { bg: "var(--warning-light)", color: "var(--warning)", border: "var(--warning-border)", label: "Medium",        dot: "var(--warning)" },
  Low:    { bg: "var(--info-light)",    color: "var(--info)",    border: "var(--info-border)",    label: "Low",           dot: "var(--info)" },
};

const ORDER: Severity[] = ["High", "Medium", "Low"];

function SeverityFilterPill({ severity, count, active, onClick }: {
  severity: "All" | Severity; count: number; active: boolean; onClick: () => void;
}) {
  const cfg = severity !== "All" ? severityConfig[severity] : null;
  return (
    <button onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 11, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .15s",
        background: active ? (cfg?.bg ?? "var(--accent-light)") : "var(--surface-2)",
        color: active ? (cfg?.color ?? "var(--accent)") : "var(--text-secondary)",
        border: `1.5px solid ${active ? (cfg?.border ?? "var(--accent-border)") : "var(--border)"}`,
      }}>
      {cfg && <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: active ? cfg.dot : "var(--text-muted)", display: "inline-block" }} />}
      {severity === "All" ? "All" : cfg!.label}
      <span style={{
        padding: "2px 6px", borderRadius: 6, fontWeight: 700, fontSize: 10,
        background: active ? (cfg?.color ?? "var(--accent)") : "var(--border)",
        color: active ? "#fff" : "var(--text-secondary)",
      }}>
        {count}
      </span>
    </button>
  );
}

export default function ManagerEscalations() {
  const [severityFilter, setSeverityFilter] = useState<"All" | Severity>("All");
  const [repFilter, setRepFilter]           = useState("All");
  const [items, setItems]                   = useState<EscalationItem[]>(escalations as EscalationItem[]);
  const [resolveConfirm, setResolveConfirm] = useState<string | null>(null);

  const open        = items.filter(e => !e.resolved && !e.escalatedUp);
  const resolved    = items.filter(e => e.resolved);
  const escalatedUp = items.filter(e => e.escalatedUp);

  const reps = useMemo(() => ["All", ...Array.from(new Set(items.map(e => e.rep)))], [items]);

  const filtered = useMemo(() =>
    open
      .filter(e => severityFilter === "All" || e.severity === severityFilter)
      .filter(e => repFilter === "All" || e.rep === repFilter)
      .sort((a, b) => ORDER.indexOf(a.severity as Severity) - ORDER.indexOf(b.severity as Severity)),
    [open, severityFilter, repFilter]
  );

  const counts = {
    All:    open.length,
    High:   open.filter(e => e.severity === "High").length,
    Medium: open.filter(e => e.severity === "Medium").length,
    Low:    open.filter(e => e.severity === "Low").length,
  };

  const resolveEscalation = (id: string) => {
    setItems(prev => prev.map(e => e.id === id ? { ...e, resolved: true } : e));
    setResolveConfirm(null);
  };

  const escalateUp = (id: string) =>
    setItems(prev => prev.map(e => e.id === id ? { ...e, escalatedUp: true } : e));

  return (
    <div style={{ padding: 28, maxWidth: 896 }}>

      {/* Header */}
      <div className="animate-fade-up" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Escalations</h1>
          <p className="page-subtitle">
            {open.length} open · {resolved.length} resolved · {escalatedUp.length} escalated up
          </p>
        </div>

        {/* Summary strip */}
        <div style={{ display: "flex", gap: 8 }}>
          {(["High", "Medium", "Low"] as Severity[]).map(s => (
            <div key={s} style={{ padding: "8px 12px", borderRadius: 11, textAlign: "center", background: severityConfig[s].bg, border: `1px solid ${severityConfig[s].border}` }}>
              <p style={{ fontSize: 20, fontWeight: 700, lineHeight: 1, color: severityConfig[s].color, margin: 0 }}>{counts[s]}</p>
              <p style={{ fontSize: 12, marginTop: 2, color: severityConfig[s].color, opacity: 0.8, margin: 0 }}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="animate-fade-up" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap", animationDelay: "40ms" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {(["All", "High", "Medium", "Low"] as const).map(s => (
            <SeverityFilterPill key={s} severity={s} count={counts[s] ?? open.length}
              active={severityFilter === s} onClick={() => setSeverityFilter(s)} />
          ))}
        </div>
        <div style={{ height: 20, width: 1, background: "var(--border)" }} />
        <select className="input" style={{ width: 150, fontSize: 12, padding: "6px 10px" }}
          value={repFilter} onChange={e => setRepFilter(e.target.value)}>
          {reps.map(r => <option key={r} value={r}>{r === "All" ? "All Reps" : r}</option>)}
        </select>
      </div>

      {/* Cards */}
      <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 12, animationDelay: "80ms" }}>
        {filtered.length === 0
          ? (
            <div className="card" style={{ padding: 48, textAlign: "center", border: "2px dashed var(--border)" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
              <p style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)", margin: "0 0 4px" }}>All clear!</p>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
                {severityFilter !== "All" || repFilter !== "All"
                  ? "No escalations match the current filters."
                  : "No open escalations at the moment."}
              </p>
            </div>
          )
          : filtered.map((e, i) => {
              const cfg          = severityConfig[e.severity as Severity];
              const isConfirming = resolveConfirm === e.id;

              return (
                <div key={e.id} className="animate-fade-up card" style={{ padding: 20, transition: "all .15s", borderLeft: `4px solid ${cfg.color}`, animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "monospace", color: "var(--text-secondary)" }}>{e.id}</span>
                        <span className="badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block", marginRight: 4 }} />
                          {cfg.label}
                        </span>
                      </div>
                      <h3 style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", margin: "0 0 4px" }}>{e.lead}</h3>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 12px" }}>{e.reason}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "var(--text-secondary)" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                          </svg>
                          Rep: <strong style={{ color: "var(--text-primary)" }}>{e.rep}</strong>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                          </svg>
                          Raised: {e.raisedAt}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                      {isConfirming ? (
                        <>
                          <p style={{ fontSize: 12, textAlign: "center", marginBottom: 4, fontWeight: 500, color: "var(--text-secondary)" }}>Confirm resolve?</p>
                          <button className="btn-primary" style={{ fontSize: 12, background: "var(--success)" }}
                            onClick={() => resolveEscalation(e.id)}>✓ Confirm</button>
                          <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => setResolveConfirm(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn-primary" style={{ fontSize: 12, background: "var(--success)" }}
                            onClick={() => setResolveConfirm(e.id)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Resolve
                          </button>
                          <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => escalateUp(e.id)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                            Escalate Up
                          </button>
                          <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => alert(`Navigating to lead: ${e.lead}`)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            View Lead
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Resolved section */}
      {resolved.length > 0 && (
        <div className="animate-fade-up" style={{ marginTop: 32 }}>
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)", marginBottom: 12 }}>
            Resolved this session ({resolved.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {resolved.map(e => (
              <div key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 11, background: "var(--surface-2)", border: "1px solid var(--border)", opacity: 0.7 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: "var(--success)" }}>✓</span>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", textDecoration: "line-through" }}>{e.lead}</span>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)", marginLeft: 8 }}>{e.id}</span>
                  </div>
                </div>
                <button className="btn-ghost" style={{ fontSize: 12 }}
                  onClick={() => setItems(prev => prev.map(i => i.id === e.id ? { ...i, resolved: false } : i))}>
                  Undo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}