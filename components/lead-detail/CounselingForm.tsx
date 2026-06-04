"use client";
import { useState } from "react";
import { UserCheck, CheckCircle2, Edit3, Save, X } from "lucide-react";
import { Lead, CounselingNote } from "./types";

interface CounselingFormProps {
  lead: Lead;
}

export default function CounselingForm({ lead }: CounselingFormProps) {
  const init: CounselingNote = lead.counselingNote ?? {
    targetProgram: "", courseInterest: "", engagementLevel: "",
    previousExperience: "", budget: "", painPoints: "", createdAt: "", createdBy: "",
  };
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState<CounselingNote>({ ...init });
  const [saved, setSaved]     = useState(false);

  const inputStyle: React.CSSProperties = {
    width: "100%", fontSize: 12, padding: "7px 10px",
    borderRadius: 6, border: "1px solid var(--border-strong)",
    background: "var(--surface)", color: "var(--text-primary)",
    boxSizing: "border-box", outline: "none",
    fontFamily: "inherit", lineHeight: 1.5,
    transition: "border-color .15s, box-shadow .15s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 10, fontWeight: 700,
    color: "var(--text-muted)", textTransform: "uppercase",
    letterSpacing: "0.06em", marginBottom: 4,
  };

  const field = (label: string, key: keyof CounselingNote, multi = false) => (
    <div>
      <label style={labelStyle}>{label}</label>
      {editing ? (
        multi ? (
          <textarea
            value={form[key]}
            onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
            rows={2}
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={e => { (e.target as HTMLElement).style.borderColor = "var(--text-primary)"; (e.target as HTMLElement).style.boxShadow = "0 0 0 3px rgba(0,0,0,.06)"; }}
            onBlur={e  => { (e.target as HTMLElement).style.borderColor = "var(--border-strong)"; (e.target as HTMLElement).style.boxShadow = "none"; }}
          />
        ) : (
          <input
            value={form[key]}
            onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
            style={inputStyle}
            onFocus={e => { (e.target as HTMLElement).style.borderColor = "var(--text-primary)"; (e.target as HTMLElement).style.boxShadow = "0 0 0 3px rgba(0,0,0,.06)"; }}
            onBlur={e  => { (e.target as HTMLElement).style.borderColor = "var(--border-strong)"; (e.target as HTMLElement).style.boxShadow = "none"; }}
          />
        )
      ) : (
        <p style={{ fontSize: 12, color: form[key] ? "var(--text-primary)" : "var(--text-muted)", margin: 0, lineHeight: 1.5, fontStyle: form[key] ? "normal" : "italic" }}>
          {form[key] || "Not filled"}
        </p>
      )}
    </div>
  );

  const save = () => { setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface-2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <UserCheck size={12} style={{ color: "var(--success)" }} />
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-secondary)" }}>Counseling Form</span>
          {saved && (
            <span style={{ fontSize: 11, color: "var(--success)", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
              <CheckCircle2 size={11} /> Saved
            </span>
          )}
        </div>
        {editing ? (
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => { setForm({ ...init }); setEditing(false); }}
              style={{ fontSize: 11, padding: "4px 9px", borderRadius: 5, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
              <X size={10} /> Cancel
            </button>
            <button onClick={save}
              style={{ fontSize: 11, padding: "4px 10px", borderRadius: 5, border: "none", background: "var(--success)", color: "#fff", cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
              <Save size={10} /> Save
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)}
            style={{ fontSize: 11, padding: "4px 10px", borderRadius: 5, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
            <Edit3 size={10} /> Edit
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {field("Target Program", "targetProgram")}
        {field("Course Interest", "courseInterest")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {field("Engagement Level", "engagementLevel")}
          {field("Budget", "budget")}
        </div>
        {field("Previous Experience", "previousExperience")}
        {field("Pain Points", "painPoints", true)}
        {!editing && form.createdBy && (
          <p style={{ fontSize: 10, color: "var(--text-muted)", margin: 0, fontFamily: "monospace", paddingTop: 4, borderTop: "1px solid var(--border)" }}>
            By {form.createdBy} · {form.createdAt}
          </p>
        )}
      </div>
    </div>
  );
}