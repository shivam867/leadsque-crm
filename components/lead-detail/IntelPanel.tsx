"use client";
import { useState } from "react";
import { Shield, Target, MessageSquare, Plus, X } from "lucide-react";
import { LeadIntelligence, ObjectionEntry } from "./types";

interface IntelPanelProps {
  intel: LeadIntelligence;
}

const cardHeaderStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderBottom: "1px solid var(--border)",
  display: "flex", justifyContent: "space-between", alignItems: "center",
  background: "var(--surface-2)",
};

const labelStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 800, letterSpacing: "0.07em",
  textTransform: "uppercase", color: "var(--text-secondary)",
};

const editBtnStyle: React.CSSProperties = {
  fontSize: 11, padding: "4px 9px", borderRadius: 5,
  border: "1px solid var(--border-strong)", background: "var(--surface)",
  color: "var(--text-secondary)", cursor: "pointer",
};

const saveBtnStyle = (color: string): React.CSSProperties => ({
  fontSize: 11, padding: "4px 9px", borderRadius: 5,
  border: "none", background: color, color: "#fff",
  cursor: "pointer", fontWeight: 700,
});

const textareaStyle: React.CSSProperties = {
  width: "100%", fontSize: 12, padding: "8px 10px",
  borderRadius: 7, border: "1px solid var(--border-strong)",
  background: "var(--surface)", color: "var(--text-primary)",
  resize: "vertical", boxSizing: "border-box", outline: "none",
  lineHeight: 1.55, fontFamily: "inherit",
};

const inputStyle: React.CSSProperties = {
  width: "100%", fontSize: 12, padding: "6px 9px",
  borderRadius: 5, border: "1px solid var(--border-strong)",
  background: "var(--surface)", color: "var(--text-primary)",
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};

export default function IntelPanel({ intel }: IntelPanelProps) {
  const [compEdit, setCompEdit] = useState(false);
  const [compVal,  setCompVal]  = useState(intel.competitorIntel ?? "");
  const [objEdit,  setObjEdit]  = useState(false);
  const [objections, setObjections] = useState<ObjectionEntry[]>(intel.handlingObjections ?? []);
  const [langs,   setLangs]   = useState<string[]>(intel.languagePreference ?? []);
  const [langIn,  setLangIn]  = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* ── Competitor Intel ── */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", borderTop: "3px solid var(--purple)" }}>
        <div style={cardHeaderStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Shield size={12} style={{ color: "var(--purple)" }} />
            <span style={{ ...labelStyle }}>Competitor Intel</span>
          </div>
          {compEdit ? (
            <div style={{ display: "flex", gap: 5 }}>
              <button onClick={() => setCompEdit(false)} style={editBtnStyle}>Cancel</button>
              <button onClick={() => setCompEdit(false)} style={saveBtnStyle("var(--purple)")}>Save</button>
            </div>
          ) : (
            <button onClick={() => setCompEdit(true)} style={editBtnStyle}>Edit</button>
          )}
        </div>
        <div style={{ padding: "12px 14px" }}>
          {compEdit ? (
            <textarea
              value={compVal}
              onChange={e => setCompVal(e.target.value)}
              rows={3}
              style={textareaStyle}
            />
          ) : (
            <p style={{ fontSize: 12, color: compVal ? "var(--text-primary)" : "var(--text-muted)", margin: 0, lineHeight: 1.6, fontStyle: compVal ? "normal" : "italic" }}>
              {compVal || "No competitor intel added."}
            </p>
          )}
        </div>
      </div>

      {/* ── Handling Objections ── */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", borderTop: "3px solid var(--warning)" }}>
        <div style={cardHeaderStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Target size={12} style={{ color: "var(--warning)" }} />
            <span style={labelStyle}>Handling Objections</span>
          </div>
          {objEdit ? (
            <div style={{ display: "flex", gap: 5 }}>
              <button onClick={() => setObjEdit(false)} style={editBtnStyle}>Cancel</button>
              <button onClick={() => setObjEdit(false)} style={saveBtnStyle("var(--warning)")}>Save</button>
            </div>
          ) : (
            <button onClick={() => setObjEdit(true)} style={editBtnStyle}>Edit</button>
          )}
        </div>
        <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
          {objections.map((obj, i) => (
            <div key={i} style={{ padding: "10px 12px", background: "var(--warning-light)", borderRadius: 8, border: "1px solid var(--warning-border)" }}>
              {objEdit ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <input
                    value={obj.objection}
                    onChange={e => { const o = [...objections]; o[i] = { ...o[i], objection: e.target.value }; setObjections(o); }}
                    placeholder="Objection..."
                    style={{ ...inputStyle, fontWeight: 600 }}
                  />
                  <input
                    value={obj.response}
                    onChange={e => { const o = [...objections]; o[i] = { ...o[i], response: e.target.value }; setObjections(o); }}
                    placeholder="Response..."
                    style={inputStyle}
                  />
                  {objections.length > 1 && (
                    <button
                      onClick={() => setObjections(objections.filter((_, j) => j !== i))}
                      style={{ fontSize: 10, color: "var(--danger)", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>
                      Remove
                    </button>
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
          {objections.length === 0 && !objEdit && (
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, fontStyle: "italic" }}>No objections added yet.</p>
          )}
          {objEdit && (
            <button
              onClick={() => setObjections([...objections, { objection: "", response: "" }])}
              style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--warning)", background: "transparent", border: "1px dashed var(--warning-border)", borderRadius: 7, padding: "6px 10px", cursor: "pointer", fontWeight: 600 }}>
              <Plus size={11} /> Add Objection
            </button>
          )}
        </div>
      </div>

      {/* ── Language Preference ── */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", borderTop: "3px solid var(--info)" }}>
        <div style={cardHeaderStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <MessageSquare size={12} style={{ color: "var(--info)" }} />
            <span style={labelStyle}>Language Preference</span>
          </div>
        </div>
        <div style={{ padding: "12px 14px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: langs.length ? 10 : 0 }}>
            {langs.map(l => (
              <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 6, background: "var(--info-light)", color: "var(--info)", border: "1px solid var(--info-border)" }}>
                {l}
                <button
                  onClick={() => setLangs(langs.filter(x => x !== l))}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--info)", padding: 0, display: "flex", alignItems: "center" }}>
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
            placeholder="Type a language and press Enter"
            style={{ ...inputStyle, width: "auto", minWidth: 200 }}
          />
        </div>
      </div>

    </div>
  );
}