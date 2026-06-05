"use client";
import { useState } from "react";
import { Target, MessageSquare, Plus, X } from "lucide-react";
import { LeadIntelligence, ObjectionEntry } from "./types";

interface IntelPanelProps {
  intel: LeadIntelligence;
}

const CARD_HEAD = (accent: string): React.CSSProperties => ({
  padding: "8px 12px",
  borderBottom: "1px solid var(--border)",
  display: "flex", justifyContent: "space-between", alignItems: "center",
  background: "var(--surface-2)",
  borderLeft: `3px solid ${accent}`,
});

const LABEL: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
  textTransform: "uppercase", color: "var(--text-muted)",
};

const editBtn: React.CSSProperties = {
  fontSize: 11, padding: "3px 8px", borderRadius: 4,
  border: "1px solid var(--border-strong)", background: "var(--surface)",
  color: "var(--text-secondary)", cursor: "pointer", fontWeight: 500,
};

const saveBtn = (color: string): React.CSSProperties => ({
  fontSize: 11, padding: "3px 8px", borderRadius: 4,
  border: "none", background: color, color: "#fff",
  cursor: "pointer", fontWeight: 700,
});

const INPUT: React.CSSProperties = {
  width: "100%", fontSize: 12, padding: "6px 9px",
  borderRadius: 4, border: "1px solid var(--border-strong)",
  background: "var(--surface)", color: "var(--text-primary)",
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};

export default function IntelPanel({ intel }: IntelPanelProps) {
  const [objEdit,    setObjEdit]    = useState(false);
  const [objections, setObjections] = useState<ObjectionEntry[]>(intel.handlingObjections ?? []);
  const [langs,      setLangs]      = useState<string[]>(intel.languagePreference ?? []);
  const [langIn,     setLangIn]     = useState("");

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 12 }}>

      {/* Handling Objections — takes the wider left slot */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        <div style={CARD_HEAD("var(--warning)")}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Target size={11} style={{ color: "var(--warning)" }} />
            <span style={LABEL}>Handling Objections</span>
          </div>
          {objEdit ? (
            <div style={{ display: "flex", gap: 5 }}>
              <button onClick={() => setObjEdit(false)} style={editBtn}>Cancel</button>
              <button onClick={() => setObjEdit(false)} style={saveBtn("var(--warning)")}>Save</button>
            </div>
          ) : (
            <button onClick={() => setObjEdit(true)} style={editBtn}>Edit</button>
          )}
        </div>
        <div style={{ padding: "10px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {objections.length === 0 && !objEdit && (
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, fontStyle: "italic", gridColumn: "1 / -1" }}>No objections added yet.</p>
          )}
          {objections.map((obj, i) => (
            <div key={i} style={{ padding: "8px 10px", background: "var(--warning-light)", borderRadius: 6, border: "1px solid var(--warning-border)" }}>
              {objEdit ? (
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 5 }}>
                  <input value={obj.objection} onChange={e => { const o = [...objections]; o[i] = { ...o[i], objection: e.target.value }; setObjections(o); }} placeholder="Objection..." style={{ ...INPUT, fontWeight: 600 }} />
                  <input value={obj.response}  onChange={e => { const o = [...objections]; o[i] = { ...o[i], response:  e.target.value }; setObjections(o); }} placeholder="Response..." style={INPUT} />
                  {objections.length > 1 && (
                    <button onClick={() => setObjections(objections.filter((_, j) => j !== i))} style={{ fontSize: 10, color: "var(--danger)", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" as const, padding: 0, fontWeight: 600 }}>Remove</button>
                  )}
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--warning)", margin: "0 0 3px" }}>If: {obj.objection}</p>
                  <p style={{ fontSize: 11, color: "var(--text-primary)", margin: 0, lineHeight: 1.5 }}>→ {obj.response}</p>
                </>
              )}
            </div>
          ))}
          {objEdit && (
            <button onClick={() => setObjections([...objections, { objection: "", response: "" }])} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--warning)", background: "transparent", border: "1px dashed var(--warning-border)", borderRadius: 5, padding: "5px 9px", cursor: "pointer", fontWeight: 600 }}>
              <Plus size={10} /> Add Objection
            </button>
          )}
        </div>
      </div>

      {/* Language Preference — narrower right slot */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        <div style={CARD_HEAD("var(--info)")}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <MessageSquare size={11} style={{ color: "var(--info)" }} />
            <span style={LABEL}>Language Preference</span>
          </div>
        </div>
        <div style={{ padding: "10px 12px" }}>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: langs.length ? 10 : 0 }}>
            {langs.map(l => (
              <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 5, background: "var(--info-light)", color: "var(--info)", border: "1px solid var(--info-border)" }}>
                {l}
                <button onClick={() => setLangs(langs.filter(x => x !== l))} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--info)", padding: 0, display: "flex", alignItems: "center" }}>
                  <X size={9} />
                </button>
              </span>
            ))}
          </div>
          <input
            value={langIn}
            onChange={e => setLangIn(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && langIn.trim()) { setLangs([...langs, langIn.trim()]); setLangIn(""); } }}
            placeholder="Type a language, press Enter"
            style={{ ...INPUT, width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}