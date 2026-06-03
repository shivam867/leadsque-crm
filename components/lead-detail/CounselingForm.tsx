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
  const [form, setForm] = useState<CounselingNote>({ ...init });
  const [saved, setSaved] = useState(false);

  const field = (label: string, key: keyof CounselingNote, multi = false) => (
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" as const, letterSpacing: "0.05em", display: "block", marginBottom: 3 }}>
        {label}
      </label>
      {editing ? (
        multi ? (
          <textarea
            value={form[key]}
            onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
            rows={2}
            style={{ width: "100%", fontSize: 12, padding: "7px 9px", borderRadius: 7, border: "1.5px solid #BFDBFE", background: "#F0F9FF", color: "#111827", resize: "vertical" as const, boxSizing: "border-box" as const, outline: "none", lineHeight: 1.5 }}
          />
        ) : (
          <input
            value={form[key]}
            onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
            style={{ width: "100%", fontSize: 12, padding: "7px 9px", borderRadius: 7, border: "1.5px solid #BFDBFE", background: "#F0F9FF", color: "#111827", boxSizing: "border-box" as const, outline: "none" }}
          />
        )
      ) : (
        <p style={{ fontSize: 12, color: form[key] ? "#111827" : "#9CA3AF", margin: 0, fontStyle: form[key] ? "normal" as const : "italic" as const }}>
          {form[key] || "Not filled"}
        </p>
      )}
    </div>
  );

  const save = () => { setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "9px 14px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <UserCheck size={12} style={{ color: "#059669" }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "#4B5563" }}>Counseling Form</span>
          {saved && (
            <span style={{ fontSize: 11, color: "#059669", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}>
              <CheckCircle2 size={11} /> Saved
            </span>
          )}
        </div>
        {editing ? (
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => { setForm({ ...init }); setEditing(false); }} style={{ fontSize: 11, padding: "4px 9px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#fff", color: "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
              <X size={10} /> Cancel
            </button>
            <button onClick={save} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "none", background: "#059669", color: "#fff", cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
              <Save size={10} /> Save
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#F9FAFB", color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
            <Edit3 size={10} /> Edit
          </button>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "12px 14px" }}>
        {field("Target Program", "targetProgram")}
        {field("Course Interest", "courseInterest")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>{field("Engagement Level", "engagementLevel")}</div>
          <div>{field("Budget", "budget")}</div>
        </div>
        {field("Previous Experience", "previousExperience")}
        {field("Pain Points", "painPoints", true)}
        {!editing && form.createdBy && (
          <p style={{ fontSize: 10, color: "#9CA3AF", margin: "6px 0 0", fontFamily: "monospace" }}>
            By {form.createdBy} · {form.createdAt}
          </p>
        )}
      </div>
    </div>
  );
}