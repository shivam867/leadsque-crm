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

  // Pre-call brief — editable by manager/rep, seeded from intel if present
  const [brief, setBrief] = useState(intel.preBriefNote ?? "");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const safeIdx = lineIdx < lines.length ? lineIdx : 0;
  const cfg = STATUS_CONFIG[currentStatus];

  const saveBrief = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "14px 24px 0" }}>

      {/* ── Suggested Opening ── */}
      <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 7 }}>
          <Sparkles size={11} style={{ color: cfg.text }} />
          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: cfg.text }}>
            Suggested Opening · {currentStatus}
          </span>
        </div>
        <p style={{ fontSize: 12, lineHeight: 1.6, margin: "0 0 10px", fontStyle: "italic" as const, color: "#374151" }}>
          &ldquo;{interpolate(lines[safeIdx] ?? "No opening line set for this stage.", lead.name, lead.service)}&rdquo;
        </p>
        {lines.length > 1 && (
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {lines.map((_, i) => (
              <button key={i} onClick={() => setLineIdx(i)} style={{ width: i === safeIdx ? 16 : 5, height: 5, borderRadius: 99, background: i === safeIdx ? cfg.text : `${cfg.text}40`, border: "none", cursor: "pointer", padding: 0, transition: "all .2s" }} />
            ))}
            <span style={{ fontSize: 10, color: "#6B7280", marginLeft: 4 }}>{safeIdx + 1}/{lines.length}</span>
          </div>
        )}
      </div>

      {/* ── Pre-Call Brief (editable) ── */}
      <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "9px 12px", borderBottom: "1px solid #FEF3C7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <StickyNote size={11} style={{ color: "#B45309" }} />
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#B45309" }}>
              Pre-Call Brief
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {saved && (
              <span style={{ fontSize: 10, color: "#059669", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                <Check size={10} /> Saved
              </span>
            )}
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, border: "1px solid #FDE68A", background: "#fff", color: "#B45309", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveBrief}
                  style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, border: "none", background: "#B45309", color: "#fff", cursor: "pointer", fontWeight: 700 }}
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, padding: "2px 7px", borderRadius: 5, border: "1px solid #FDE68A", background: "transparent", color: "#B45309", cursor: "pointer" }}
              >
                <Edit3 size={9} /> Edit
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "10px 12px" }}>
          {editing ? (
            <textarea
              value={brief}
              onChange={e => setBrief(e.target.value)}
              placeholder="Add notes for the rep before this call — student background, key concerns, what to highlight..."
              rows={4}
              autoFocus
              style={{ width: "100%", fontSize: 12, padding: "7px 9px", borderRadius: 7, border: "1.5px solid #FDE68A", background: "#fff", color: "#78350F", resize: "none" as const, boxSizing: "border-box" as const, outline: "none", lineHeight: 1.55, fontFamily: "inherit" }}
            />
          ) : brief ? (
            <p style={{ fontSize: 12, color: "#78350F", lineHeight: 1.6, margin: 0 }}>{brief}</p>
          ) : (
            <p
              onClick={() => setEditing(true)}
              style={{ fontSize: 12, color: "#D97706", lineHeight: 1.55, margin: 0, fontStyle: "italic" as const, cursor: "pointer" }}
            >
              Click Edit to add a pre-call brief for this lead...
            </p>
          )}
        </div>
      </div>

      {/* ── Best Time to Call ── */}
      <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 7 }}>
          <Clock size={12} style={{ color: "#16A34A" }} />
          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#16A34A" }}>
            Best Time to Call
          </span>
        </div>
        <p style={{ fontSize: 15, fontWeight: 800, color: "#15803D", margin: "0 0 5px", lineHeight: 1.3 }}>
          {intel.bestTimeToCall ?? (
            <span style={{ fontSize: 12, fontWeight: 400, color: "#9CA3AF", fontStyle: "italic" as const }}>Not set</span>
          )}
        </p>
        {intel.bestTimeNote && (
          <p style={{ fontSize: 11, color: "#166534", margin: 0, lineHeight: 1.5, display: "flex", gap: 5 }}>
            <ChevronRight size={11} style={{ color: "#16A34A", marginTop: 1, flexShrink: 0 }} />
            {intel.bestTimeNote}
          </p>
        )}
        {intel.dealProbability != null && (
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #BBF7D0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: "#16A34A", fontWeight: 700 }}>Deal Probability</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: intel.dealProbability >= 70 ? "#15803D" : intel.dealProbability >= 40 ? "#B45309" : "#6B7280" }}>
                {intel.dealProbability}%
              </span>
            </div>
            <div style={{ height: 4, background: "#D1FAE5", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${intel.dealProbability}%`, background: "#16A34A", borderRadius: 99, transition: "width 0.4s ease" }} />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}