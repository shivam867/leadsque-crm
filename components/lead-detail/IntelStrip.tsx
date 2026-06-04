"use client";
import { useState } from "react";
import { Sparkles, Clock, ChevronRight, StickyNote, Edit3, Check } from "lucide-react";
import { Lead, LeadStatus } from "./types";
import { STAGE_OPENING_LINES, STATUS_CONFIG, interpolate } from "./constants";

interface IntelStripProps {
  lead: Lead;
  currentStatus: LeadStatus;
}

export default function IntelStrip({ lead, currentStatus }: IntelStripProps) {
  const intel = lead.intelligence ?? {};
  const lines = STAGE_OPENING_LINES[currentStatus] ?? [];
  const [lineIdx, setLineIdx] = useState(0);
  const [brief,   setBrief]   = useState(intel.preBriefNote ?? "");
  const [editing, setEditing] = useState(false);
  const [saved,   setSaved]   = useState(false);

  const safeIdx = lineIdx < lines.length ? lineIdx : 0;
  const cfg = STATUS_CONFIG[currentStatus];

  const saveBrief = () => { setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 2000); };

  const cardBase: React.CSSProperties = {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 10, overflow: "hidden",
    display: "flex", flexDirection: "column",
  };

  const cardHeaderBase: React.CSSProperties = {
    padding: "10px 14px", borderBottom: "1px solid var(--border)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "var(--surface-2)", flexShrink: 0,
  };

  const labelBase: React.CSSProperties = {
    fontSize: 10, fontWeight: 800, letterSpacing: "0.07em",
    textTransform: "uppercase",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "16px 24px 0" }}>

      {/* ── Suggested Opening ── */}
      <div style={{ ...cardBase, borderTop: `3px solid ${cfg.text}` }}>
        <div style={cardHeaderBase}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Sparkles size={12} style={{ color: cfg.text }} />
            <span style={{ ...labelBase, color: cfg.text }}>
              Suggested Opening
            </span>
          </div>
          <span style={{ fontSize: 10, color: "var(--text-muted)", background: cfg.bg, padding: "2px 7px", borderRadius: 99, border: `1px solid ${cfg.border}`, fontWeight: 600 }}>
            {currentStatus}
          </span>
        </div>
        <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <p style={{ fontSize: 12, lineHeight: 1.65, margin: "0 0 12px", fontStyle: "italic", color: "var(--text-primary)" }}>
            &ldquo;{interpolate(lines[safeIdx] ?? "No opening line set for this stage.", lead.name, lead.service)}&rdquo;
          </p>
          {lines.length > 1 && (
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {lines.map((_, i) => (
                <button key={i} onClick={() => setLineIdx(i)}
                  style={{ width: i === safeIdx ? 14 : 5, height: 5, borderRadius: 99, background: i === safeIdx ? cfg.text : `${cfg.text}40`, border: "none", cursor: "pointer", padding: 0, transition: "all .2s" }} />
              ))}
              <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 4 }}>{safeIdx + 1}/{lines.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Pre-Call Brief ── */}
      <div style={{ ...cardBase, borderTop: "3px solid var(--warning)" }}>
        <div style={cardHeaderBase}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <StickyNote size={12} style={{ color: "var(--warning)" }} />
            <span style={{ ...labelBase, color: "var(--warning)" }}>Pre-Call Brief</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {saved && (
              <span style={{ fontSize: 10, color: "var(--success)", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                <Check size={10} /> Saved
              </span>
            )}
            {editing ? (
              <>
                <button onClick={() => setEditing(false)}
                  style={{ fontSize: 10, padding: "3px 7px", borderRadius: 5, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text-secondary)", cursor: "pointer" }}>
                  Cancel
                </button>
                <button onClick={saveBrief}
                  style={{ fontSize: 10, padding: "3px 7px", borderRadius: 5, border: "none", background: "var(--warning)", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
                  Save
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)}
                style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, padding: "3px 7px", borderRadius: 5, border: "1px solid var(--border-strong)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}>
                <Edit3 size={9} /> Edit
              </button>
            )}
          </div>
        </div>
        <div style={{ padding: "12px 14px", flex: 1 }}>
          {editing ? (
            <textarea
              value={brief}
              onChange={e => setBrief(e.target.value)}
              placeholder="Add notes for the rep before this call — student background, key concerns, what to highlight..."
              rows={4}
              autoFocus
              style={{ width: "100%", fontSize: 12, padding: "7px 9px", borderRadius: 7, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text-primary)", resize: "none", boxSizing: "border-box", outline: "none", lineHeight: 1.55, fontFamily: "inherit" }}
            />
          ) : brief ? (
            <p style={{ fontSize: 12, color: "var(--text-primary)", lineHeight: 1.65, margin: 0 }}>{brief}</p>
          ) : (
            <p onClick={() => setEditing(true)}
              style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.55, margin: 0, fontStyle: "italic", cursor: "pointer" }}>
              Click Edit to add a pre-call brief for this lead...
            </p>
          )}
        </div>
      </div>

      {/* ── Best Time to Call ── */}
      <div style={{ ...cardBase, borderTop: "3px solid var(--success)" }}>
        <div style={cardHeaderBase}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Clock size={12} style={{ color: "var(--success)" }} />
            <span style={{ ...labelBase, color: "var(--success)" }}>Best Time to Call</span>
          </div>
        </div>
        <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: "var(--success)", margin: "0 0 5px", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
              {intel.bestTimeToCall ?? (
                <span style={{ fontSize: 12, fontWeight: 400, color: "var(--text-muted)", fontStyle: "italic" }}>Not set</span>
              )}
            </p>
            {intel.bestTimeNote && (
              <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5, display: "flex", gap: 5, alignItems: "flex-start" }}>
                <ChevronRight size={11} style={{ color: "var(--success)", marginTop: 1, flexShrink: 0 }} />
                {intel.bestTimeNote}
              </p>
            )}
          </div>

          {intel.dealProbability != null && (
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: "var(--text-secondary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Deal Probability</span>
                <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em", color: intel.dealProbability >= 70 ? "var(--success)" : intel.dealProbability >= 40 ? "var(--warning)" : "var(--text-secondary)" }}>
                  {intel.dealProbability}%
                </span>
              </div>
              <div style={{ height: 4, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${intel.dealProbability}%`, borderRadius: 99, background: intel.dealProbability >= 70 ? "var(--success)" : intel.dealProbability >= 40 ? "var(--warning)" : "var(--text-muted)", transition: "width 0.4s ease" }} />
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}