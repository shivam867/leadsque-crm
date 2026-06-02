"use client";
import { useState } from "react";
import {
  Plus, Trash2, GripVertical, ChevronDown,
  ToggleLeft, ToggleRight, FileText, Hash, Type, List, Calendar,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────
export interface FormField {
  id: string;
  label: string;
  type: "text" | "select" | "textarea" | "number" | "date";
  required: boolean;
  options?: string[];
  enabled: boolean;
}

// ─── Constants ───────────────────────────────────────────────────
export const DEFAULT_FORM_FIELDS: FormField[] = [
  { id: "f1",  label: "Target Program",        type: "text",     required: true,  enabled: true  },
  { id: "f2",  label: "Course Interest",        type: "select",   required: false, enabled: true,
    options: ["Foundation Program","Advanced Program","Crash Course","Online Live","Test Series"] },
  { id: "f3",  label: "Engagement Level",       type: "select",   required: true,  enabled: true,
    options: ["Just Exploring","Actively Researching","Ready to Enroll"] },
  { id: "f4",  label: "Previous Experience",    type: "textarea", required: false, enabled: true  },
  { id: "f5",  label: "Budget",                 type: "text",     required: true,  enabled: true  },
  { id: "f6",  label: "Pain Points",            type: "textarea", required: false, enabled: true  },
  { id: "f7",  label: "Preferred Batch Timing", type: "select",   required: false, enabled: false,
    options: ["Morning","Afternoon","Evening","Weekend"] },
  { id: "f8",  label: "Mode Preference",        type: "select",   required: false, enabled: false,
    options: ["Online","Offline","Hybrid"] },
  { id: "f9",  label: "Referral Source Name",   type: "text",     required: false, enabled: false },
  { id: "f10", label: "Parent Approval Status", type: "select",   required: false, enabled: false,
    options: ["Approved","Pending","Not Applicable"] },
];

// ─── Shared styles ────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  fontSize: 12, padding: "7px 10px", borderRadius: 7,
  border: "1px solid #E5E7EB", color: "#111827",
  background: "#fff", outline: "none", width: "100%",
  boxSizing: "border-box" as const,
};

const FIELD_TYPE_ICONS: Record<string, React.ReactNode> = {
  text:     <Type size={11} />,
  select:   <List size={11} />,
  textarea: <FileText size={11} />,
  number:   <Hash size={11} />,
  date:     <Calendar size={11} />,
};

function tag(color: string, fontSize = 10): React.CSSProperties {
  return {
    fontSize, fontWeight: 700, padding: "2px 7px", borderRadius: 99,
    background: color + "18", color, border: `1px solid ${color}30`,
  };
}

// ─── Field Row ───────────────────────────────────────────────────
function FieldRow({
  field, onChange, onDelete,
}: {
  field: FormField;
  onChange: (f: FormField) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      border: "1px solid #F0F0F0", borderRadius: 9, overflow: "hidden",
      marginBottom: 5, opacity: field.enabled ? 1 : 0.55,
    }}>
      {/* Row header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "8px 11px", background: "#FAFAFA",
      }}>
        <GripVertical size={12} style={{ color: "#D1D5DB", flexShrink: 0, cursor: "grab" }} />
        <span style={{ color: "#9CA3AF", flexShrink: 0 }}>{FIELD_TYPE_ICONS[field.type]}</span>
        <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "#374151" }}>{field.label}</span>
        <span style={{ ...tag("#6B7280"), fontSize: 9 }}>{field.type}</span>
        {field.required && <span style={{ ...tag("#B45309"), fontSize: 9 }}>Req</span>}
        <button
          onClick={() => onChange({ ...field, enabled: !field.enabled })}
          style={{ background: "none", border: "none", cursor: "pointer", color: field.enabled ? "#059669" : "#D1D5DB", display: "flex" }}
        >
          {field.enabled ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
        </button>
        <button
          onClick={() => setExpanded(e => !e)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex", padding: 0 }}
        >
          <ChevronDown size={13} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        </button>
        <button
          onClick={onDelete}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#F87171", display: "flex", padding: 0 }}
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Expanded edit */}
      {expanded && (
        <div style={{ padding: "10px 11px", borderTop: "1px solid #F0F0F0", background: "#fff" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            <div>
              <label style={{
                fontSize: 10, fontWeight: 700, color: "#9CA3AF",
                textTransform: "uppercase", letterSpacing: "0.06em",
                display: "block", marginBottom: 3,
              }}>
                Label
              </label>
              <input
                value={field.label}
                onChange={e => onChange({ ...field, label: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{
                fontSize: 10, fontWeight: 700, color: "#9CA3AF",
                textTransform: "uppercase", letterSpacing: "0.06em",
                display: "block", marginBottom: 3,
              }}>
                Type
              </label>
              <select
                value={field.type}
                onChange={e => onChange({ ...field, type: e.target.value as FormField["type"] })}
                style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
              >
                <option value="text">Text</option>
                <option value="textarea">Paragraph</option>
                <option value="select">Dropdown</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
              </select>
            </div>
          </div>

          {field.type === "select" && field.options && (
            <div>
              <label style={{
                fontSize: 10, fontWeight: 700, color: "#9CA3AF",
                textTransform: "uppercase", letterSpacing: "0.06em",
                display: "block", marginBottom: 3,
              }}>
                Options (one per line)
              </label>
              <textarea
                value={field.options.join("\n")}
                onChange={e => onChange({ ...field, options: e.target.value.split("\n").filter(Boolean) })}
                rows={3}
                style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }}
              />
            </div>
          )}

          <button
            onClick={() => onChange({ ...field, required: !field.required })}
            style={{
              marginTop: 8, fontSize: 11, fontWeight: 700, padding: "3px 10px",
              borderRadius: 6, cursor: "pointer", border: "1px solid",
              background: field.required ? "#FFFBEB" : "#F9FAFB",
              color: field.required ? "#B45309" : "#9CA3AF",
              borderColor: field.required ? "#FDE68A" : "#E5E7EB",
            }}
          >
            {field.required ? "Required ✓" : "Make Required"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function CounselingForm({
  fields,
  setFields,
}: {
  fields: FormField[];
  setFields: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType]   = useState<FormField["type"]>("text");

  const addField = () => {
    if (!newFieldLabel.trim()) return;
    setFields(prev => [
      ...prev,
      {
        id: `f${Date.now()}`,
        label: newFieldLabel.trim(),
        type: newFieldType,
        required: false,
        enabled: true,
        options: newFieldType === "select" ? ["Option 1", "Option 2"] : undefined,
      },
    ]);
    setNewFieldLabel("");
  };

  const updateField = (updated: FormField) =>
    setFields(prev => prev.map(f => f.id === updated.id ? updated : f));

  const deleteField = (id: string) =>
    setFields(prev => prev.filter(f => f.id !== id));

  const totalFields    = fields.length;
  const activeFields   = fields.filter(f => f.enabled).length;
  const requiredFields = fields.filter(f => f.required).length;

  return (
    <div style={{ maxWidth: 680 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
        {[
          { label: "Total Fields",    value: totalFields,    color: "#111827", bg: "#F9FAFB" },
          { label: "Active Fields",   value: activeFields,   color: "#059669", bg: "#ECFDF5" },
          { label: "Required Fields", value: requiredFields, color: "#B45309", bg: "#FFFBEB" },
        ].map(s => (
          <div key={s.label} style={{
            padding: "11px 13px", background: s.bg,
            borderRadius: 10, border: "1px solid #F0F0F0",
          }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: s.color, margin: "0 0 2px" }}>{s.value}</p>
            <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Fields card */}
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
        <div style={{
          padding: "11px 16px", borderBottom: "1px solid #F3F4F6",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0 }}>Form Fields</p>
            <p style={{ fontSize: 11, color: "#6B7280", margin: "2px 0 0" }}>
              Click a field to edit · toggle to enable/disable
            </p>
          </div>
        </div>
        <div style={{ padding: "11px 13px" }}>
          {fields.map(field => (
            <FieldRow
              key={field.id}
              field={field}
              onChange={updateField}
              onDelete={() => deleteField(field.id)}
            />
          ))}

          {/* Add new field */}
          <div style={{
            display: "flex", gap: 6, marginTop: 8, padding: 10,
            background: "#F9FAFB", borderRadius: 9, border: "1px dashed #E5E7EB",
          }}>
            <input
              value={newFieldLabel}
              onChange={e => setNewFieldLabel(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addField()}
              placeholder="New field label…"
              style={{ ...inputStyle, flex: 1 }}
            />
            <select
              value={newFieldType}
              onChange={e => setNewFieldType(e.target.value as FormField["type"])}
              style={{ ...inputStyle, width: 105, appearance: "none", cursor: "pointer" }}
            >
              <option value="text">Text</option>
              <option value="textarea">Paragraph</option>
              <option value="select">Dropdown</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
            <button
              onClick={addField}
              style={{
                display: "flex", alignItems: "center", gap: 4, padding: "7px 12px",
                borderRadius: 7, background: "#111827", color: "#fff",
                fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", flexShrink: 0,
              }}
            >
              <Plus size={12} /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}