"use client";
import { useState } from "react";
import { Sparkles, Clock, Shield, Edit3, Check, ChevronRight } from "lucide-react";
import { Lead, LeadStatus } from "./types";
import { STAGE_OPENING_LINES, STATUS_CONFIG, interpolate } from "./constants";

interface IntelStripProps {
  lead: Lead;
  currentStatus: LeadStatus;
}

const CARD: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-md)",
  display: "flex", flexDirection: "column",
  overflow: "hidden",
};

const CARD_HEAD = (accent: string): React.CSSProperties => ({
  padding: "8px 12px",
  borderBottom: "1px solid var(--border)",
  display: "flex", alignItems: "center", justifyContent: "space-between",
  background: "var(--surface-2)",
  borderLeft: `3px solid ${accent}`,
});

const LABEL: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
  textTransform: "uppercase", color: "var(--text-muted)",
};

export default function IntelStrip({ lead, currentStatus }: IntelStripProps) {
  const intel = lead.intelligence ?? {};
  const lines = STAGE_OPENING_LINES[currentStatus] ?? [];
  const [lineIdx, setLineIdx] = useState(0);
  const [compVal, setCompVal] = useState(intel.competitorIntel ?? "");
  const [compEdit, setCompEdit] = useState(false);
  const [compSaved, setCompSaved] = useState(false);

  const safeIdx = lineIdx < lines.length ? lineIdx : 0;
  const cfg = STATUS_CONFIG[currentStatus];

  const saveComp = () => { setCompSaved(true); setCompEdit(false); setTimeout(() => setCompSaved(false), 2000); };

  return (
    <div style={{ padding: "12px 24px 0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>

      {/* ── 1. Suggested Opening (manager-set) ── */}
      <div style={CARD}>
        <div style={CARD_HEAD("#111111")}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Sparkles size={11} style={{ color: "#111111" }} />
            <span style={LABEL}>Suggested Opening</span>
          </div>
          <span style={{
            fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 99,
            background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`,
          }}>
            {currentStatus}
          </span>
        </div>
        <div style={{ padding: "10px 12px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <p style={{ fontSize: 12, lineHeight: 1.65, margin: "0 0 10px", fontStyle: "italic", color: "var(--text-primary)" }}>
            &ldquo;{interpolate(lines[safeIdx] ?? "No opening line set for this stage.", lead.name, lead.service)}&rdquo;
          </p>
          {lines.length > 1 && (
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {lines.map((_, i) => (
                <button key={i} onClick={() => setLineIdx(i)} style={{
                  width: i === safeIdx ? 14 : 5, height: 5, borderRadius: 99,
                  background: i === safeIdx ? "#111111" : "#D4D4D4",
                  border: "none", cursor: "pointer", padding: 0, transition: "all .2s",
                }} />
              ))}
              <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 4 }}>{safeIdx + 1}/{lines.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── 2. Best Time to Call ── */}
      <div style={CARD}>
        <div style={CARD_HEAD("var(--success)")}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Clock size={11} style={{ color: "var(--success)" }} />
            <span style={LABEL}>Best Time to Call</span>
          </div>
        </div>
        <div style={{ padding: "10px 12px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: "var(--success)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
              {intel.bestTimeToCall ?? (
                <span style={{ fontSize: 12, fontWeight: 400, color: "var(--text-muted)", fontStyle: "italic" }}>Not set</span>
              )}
            </p>
            {intel.bestTimeNote && (
              <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5, display: "flex", gap: 4, alignItems: "flex-start" }}>
                <ChevronRight size={11} style={{ color: "var(--success)", marginTop: 1, flexShrink: 0 }} />
                {intel.bestTimeNote}
              </p>
            )}
          </div>
          {intel.dealProbability != null && (
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Deal probability</span>
                <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: "-0.02em", color: intel.dealProbability >= 70 ? "var(--success)" : intel.dealProbability >= 40 ? "var(--warning)" : "var(--text-muted)" }}>
                  {intel.dealProbability}%
                </span>
              </div>
              <div style={{ height: 3, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${intel.dealProbability}%`, borderRadius: 99, background: intel.dealProbability >= 70 ? "var(--success)" : intel.dealProbability >= 40 ? "var(--warning)" : "var(--text-muted)", transition: "width 0.4s ease" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 3. Competitor Intel (manager-set, editable) ── */}
      <div style={CARD}>
        <div style={CARD_HEAD("var(--purple)")}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Shield size={11} style={{ color: "var(--purple)" }} />
            <span style={LABEL}>Competitor Intel</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {compSaved && (
              <span style={{ fontSize: 10, color: "var(--success)", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                <Check size={9} /> Saved
              </span>
            )}
            {compEdit ? (
              <>
                <button onClick={() => setCompEdit(false)} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text-secondary)", cursor: "pointer" }}>Cancel</button>
                <button onClick={saveComp} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, border: "none", background: "var(--purple)", color: "#fff", cursor: "pointer", fontWeight: 700 }}>Save</button>
              </>
            ) : (
              <button onClick={() => setCompEdit(true)} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, padding: "2px 7px", borderRadius: 4, border: "1px solid var(--border-strong)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}>
                <Edit3 size={9} /> Edit
              </button>
            )}
          </div>
        </div>
        <div style={{ padding: "10px 12px", flex: 1 }}>
          {compEdit ? (
            <textarea
              value={compVal}
              onChange={e => setCompVal(e.target.value)}
              rows={4}
              autoFocus
              style={{ width: "100%", fontSize: 12, padding: "6px 8px", borderRadius: 6, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text-primary)", resize: "none", boxSizing: "border-box", outline: "none", lineHeight: 1.55, fontFamily: "inherit" }}
            />
          ) : compVal ? (
            <p style={{ fontSize: 12, color: "var(--text-primary)", lineHeight: 1.65, margin: 0 }}>{compVal}</p>
          ) : (
            <p onClick={() => setCompEdit(true)} style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.55, margin: 0, fontStyle: "italic", cursor: "pointer" }}>
              Click Edit to add competitor intel...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}