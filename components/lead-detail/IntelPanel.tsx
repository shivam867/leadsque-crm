"use client";
import { useState } from "react";
import { Shield, Target, MessageSquare, Plus, X } from "lucide-react";
import { LeadIntelligence, ObjectionEntry } from "./types";

interface IntelPanelProps {
  intel: LeadIntelligence;
}

export default function IntelPanel({ intel }: IntelPanelProps) {
  const [compEdit, setCompEdit] = useState(false);
  const [compVal, setCompVal] = useState(intel.competitorIntel ?? "");

  const [objEdit, setObjEdit] = useState(false);
  const [objections, setObjections] = useState<ObjectionEntry[]>(intel.handlingObjections ?? []);

  const [langs, setLangs] = useState<string[]>(intel.languagePreference ?? []);
  const [langIn, setLangIn] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>

      {/* Competitor Intel */}
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden", borderTop: "3px solid #7C3AED" }}>
        <div style={{ padding: "9px 14px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Shield size={12} style={{ color: "#7C3AED" }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "#4B5563" }}>Competitor Intel</span>
          </div>
          {compEdit ? (
            <div style={{ display: "flex", gap: 5 }}>
              <button onClick={() => setCompEdit(false)} style={{ fontSize: 10, padding: "3px 7px", borderRadius: 5, border: "1px solid #E5E7EB", background: "#fff", color: "#6B7280", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => setCompEdit(false)} style={{ fontSize: 10, padding: "3px 7px", borderRadius: 5, border: "none", background: "#7C3AED", color: "#fff", cursor: "pointer", fontWeight: 700 }}>Save</button>
            </div>
          ) : (
            <button onClick={() => setCompEdit(true)} style={{ fontSize: 10, padding: "3px 7px", borderRadius: 5, border: "1px solid #E5E7EB", background: "#F9FAFB", color: "#374151", cursor: "pointer" }}>Edit</button>
          )}
        </div>
        <div style={{ padding: "10px 14px" }}>
          {compEdit ? (
            <textarea
              value={compVal}
              onChange={e => setCompVal(e.target.value)}
              rows={3}
              style={{ width: "100%", fontSize: 12, padding: "7px 9px", borderRadius: 7, border: "1.5px solid #DDD6FE", background: "#FAF5FF", color: "#111827", resize: "vertical" as const, boxSizing: "border-box" as const, outline: "none" }}
            />
          ) : (
            <p style={{ fontSize: 12, color: compVal ? "#374151" : "#9CA3AF", margin: 0, lineHeight: 1.55, fontStyle: compVal ? "normal" as const : "italic" as const }}>
              {compVal || "No competitor intel added."}
            </p>
          )}
        </div>
      </div>

      {/* Handling Objections */}
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden", borderTop: "3px solid #D97706" }}>
        <div style={{ padding: "9px 14px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Target size={12} style={{ color: "#D97706" }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "#4B5563" }}>Handling Objections</span>
          </div>
          {objEdit ? (
            <div style={{ display: "flex", gap: 5 }}>
              <button onClick={() => setObjEdit(false)} style={{ fontSize: 10, padding: "3px 7px", borderRadius: 5, border: "1px solid #E5E7EB", background: "#fff", color: "#6B7280", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => setObjEdit(false)} style={{ fontSize: 10, padding: "3px 7px", borderRadius: 5, border: "none", background: "#D97706", color: "#fff", cursor: "pointer", fontWeight: 700 }}>Save</button>
            </div>
          ) : (
            <button onClick={() => setObjEdit(true)} style={{ fontSize: 10, padding: "3px 7px", borderRadius: 5, border: "1px solid #E5E7EB", background: "#F9FAFB", color: "#374151", cursor: "pointer" }}>Edit</button>
          )}
        </div>
        <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column" as const, gap: 8 }}>
          {objections.map((obj, i) => (
            <div key={i} style={{ padding: "9px 11px", background: "#FFFBEB", borderRadius: 8, border: "1px solid #FDE68A" }}>
              {objEdit ? (
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 5 }}>
                  <input
                    value={obj.objection}
                    onChange={e => { const o = [...objections]; o[i] = { ...o[i], objection: e.target.value }; setObjections(o); }}
                    placeholder="Objection..."
                    style={{ fontSize: 11, fontWeight: 700, padding: "4px 7px", borderRadius: 5, border: "1px solid #FDE68A", background: "#fff", color: "#B45309", outline: "none" }}
                  />
                  <input
                    value={obj.response}
                    onChange={e => { const o = [...objections]; o[i] = { ...o[i], response: e.target.value }; setObjections(o); }}
                    placeholder="Response..."
                    style={{ fontSize: 11, padding: "4px 7px", borderRadius: 5, border: "1px solid #FDE68A", background: "#fff", color: "#374151", outline: "none" }}
                  />
                  {objections.length > 1 && (
                    <button
                      onClick={() => setObjections(objections.filter((_, j) => j !== i))}
                      style={{ fontSize: 10, color: "#EF4444", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" as const, padding: 0 }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#B45309", margin: "0 0 2px" }}>If: {obj.objection}</p>
                  <p style={{ fontSize: 11, color: "#374151", margin: 0, lineHeight: 1.45 }}>→ {obj.response}</p>
                </>
              )}
            </div>
          ))}
          {objEdit && (
            <button
              onClick={() => setObjections([...objections, { objection: "", response: "" }])}
              style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#D97706", background: "transparent", border: "1px dashed #FDE68A", borderRadius: 7, padding: "6px 10px", cursor: "pointer", fontWeight: 600 }}
            >
              <Plus size={11} /> Add Objection
            </button>
          )}
        </div>
      </div>

      {/* Language Preference */}
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden", borderTop: "3px solid #0891B2" }}>
        <div style={{ padding: "9px 14px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 5 }}>
          <MessageSquare size={12} style={{ color: "#0891B2" }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "#4B5563" }}>Language Preference</span>
        </div>
        <div style={{ padding: "10px 14px" }}>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 8 }}>
            {langs.map(l => (
              <span
                key={l}
                style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 7, background: "#F0F9FF", color: "#0369A1", border: "1px solid #BAE6FD" }}
              >
                {l}
                <button
                  onClick={() => setLangs(langs.filter(x => x !== l))}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: "#0369A1", padding: 0, display: "flex" }}
                >
                  <X size={9} />
                </button>
              </span>
            ))}
          </div>
          <input
            value={langIn}
            onChange={e => setLangIn(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && langIn.trim()) {
                setLangs([...langs, langIn.trim()]);
                setLangIn("");
              }
            }}
            placeholder="Add language + Enter"
            style={{ fontSize: 11, padding: "4px 8px", borderRadius: 7, border: "1px solid #E5E7EB", outline: "none", width: 140 }}
          />
        </div>
      </div>

    </div>
  );
}