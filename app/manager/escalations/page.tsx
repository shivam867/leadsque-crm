"use client";
import { useState, useMemo } from "react";
import { escalations, salesReps } from "@/data/dummy";

type Severity = "High" | "Medium" | "Low";
type EscalationItem = (typeof escalations)[number] & { resolved?: boolean; escalatedUp?: boolean };

const severityConfig = {
  High:   { bg: "#FFF1F2", color: "#DC2626", border: "#FECDD3", label: "High Priority", dot: "#DC2626" },
  Medium: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A", label: "Medium",        dot: "#D97706" },
  Low:    { bg: "#F0F9FF", color: "#0369A1", border: "#BAE6FD", label: "Low",            dot: "#0369A1" },
};

const ORDER: Severity[] = ["High", "Medium", "Low"];

function SeverityFilterPill({ severity, count, active, onClick }: {
  severity: "All" | Severity; count: number; active: boolean; onClick: () => void;
}) {
  const cfg = severity !== "All" ? severityConfig[severity] : null;
  return (
    <button onClick={onClick}
      className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
      style={{
        background: active ? (cfg?.bg ?? "var(--accent-light)") : "var(--surface-2)",
        color: active ? (cfg?.color ?? "var(--accent)") : "var(--text-secondary)",
        border: `1.5px solid ${active ? (cfg?.border ?? "var(--accent-border)") : "var(--border)"}`,
      }}>
      {cfg && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: active ? cfg.dot : "var(--text-muted)" }} />}
      {severity === "All" ? "All" : cfg!.label}
      <span className="px-1.5 py-0.5 rounded-md font-bold"
        style={{
          background: active ? (cfg?.color ?? "var(--accent)") : "var(--border)",
          color: active ? "#fff" : "var(--text-secondary)",
          fontSize: 10,
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
    <div className="p-7 max-w-4xl">

      {/* Header */}
      <div className="animate-fade-up flex items-start justify-between mb-6">
        <div>
          <h1 className="page-title">Escalations</h1>
          <p className="page-subtitle">
            {open.length} open · {resolved.length} resolved · {escalatedUp.length} escalated up
          </p>
        </div>

        {/* Summary strip */}
        <div className="flex gap-2">
          {(["High", "Medium", "Low"] as Severity[]).map(s => (
            <div key={s} className="px-3 py-2 rounded-xl text-center"
              style={{ background: severityConfig[s].bg, border: `1px solid ${severityConfig[s].border}` }}>
              <p className="text-lg font-bold leading-none" style={{ color: severityConfig[s].color }}>{counts[s]}</p>
              <p className="text-xs mt-0.5" style={{ color: severityConfig[s].color, opacity: 0.8 }}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="animate-fade-up flex items-center gap-3 mb-5 flex-wrap" style={{ animationDelay: "40ms" }}>
        <div className="flex gap-1.5">
          {(["All", "High", "Medium", "Low"] as const).map(s => (
            <SeverityFilterPill key={s} severity={s} count={counts[s] ?? open.length}
              active={severityFilter === s} onClick={() => setSeverityFilter(s)} />
          ))}
        </div>
        <div className="h-5 w-px" style={{ background: "var(--border)" }} />
        <select className="input text-xs py-1.5" style={{ width: 150 }}
          value={repFilter} onChange={e => setRepFilter(e.target.value)}>
          {reps.map(r => <option key={r} value={r}>{r === "All" ? "All Reps" : r}</option>)}
        </select>
      </div>

      {/* Cards */}
      <div className="animate-fade-up flex flex-col gap-3" style={{ animationDelay: "80ms" }}>
        {filtered.length === 0
          ? (
            <div className="card p-12 text-center" style={{ border: "2px dashed var(--border)" }}>
              <div className="text-4xl mb-3">✅</div>
              <p className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>All clear!</p>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
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
                <div key={e.id} className="animate-fade-up card p-5 transition-all"
                  style={{ animationDelay: `${Math.min(i, 8) * 40}ms`, borderLeft: `4px solid ${cfg.color}` }}>
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="text-xs font-bold font-mono" style={{ color: "var(--text-secondary)" }}>{e.id}</span>
                        <span className="badge text-xs"
                          style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                          <span className="w-1.5 h-1.5 rounded-full mr-1 inline-block" style={{ background: cfg.dot }} />
                          {cfg.label}
                        </span>
                      </div>
                      <h3 className="font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>{e.lead}</h3>
                      <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{e.reason}</p>
                      <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-secondary)" }}>
                        <span className="flex items-center gap-1">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                          </svg>
                          Rep: <strong style={{ color: "var(--text-primary)" }}>{e.rep}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                          </svg>
                          Raised: {e.raisedAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {isConfirming ? (
                        <>
                          <p className="text-xs text-center mb-1 font-medium" style={{ color: "var(--text-secondary)" }}>Confirm resolve?</p>
                          <button className="btn-primary text-xs py-2 px-4" style={{ background: "#059669" }}
                            onClick={() => resolveEscalation(e.id)}>✓ Confirm</button>
                          <button className="btn-secondary text-xs py-2 px-4" onClick={() => setResolveConfirm(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn-primary text-xs py-2 px-4" style={{ background: "#059669" }}
                            onClick={() => setResolveConfirm(e.id)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Resolve
                          </button>
                          <button className="btn-secondary text-xs py-2 px-4" onClick={() => escalateUp(e.id)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                            Escalate Up
                          </button>
                          <button className="btn-secondary text-xs py-2 px-4" onClick={() => alert(`Navigating to lead: ${e.lead}`)}>
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
        <div className="animate-fade-up mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-secondary)" }}>
            Resolved this session ({resolved.length})
          </p>
          <div className="flex flex-col gap-2">
            {resolved.map(e => (
              <div key={e.id} className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", opacity: 0.7 }}>
                <div className="flex items-center gap-3">
                  <span style={{ color: "#059669" }}>✓</span>
                  <div>
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)", textDecoration: "line-through" }}>{e.lead}</span>
                    <span className="text-xs ml-2" style={{ color: "var(--text-secondary)" }}>{e.id}</span>
                  </div>
                </div>
                <button className="text-xs px-2.5 py-1 rounded-lg"
                  style={{ background: "var(--border)", color: "var(--text-secondary)" }}
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