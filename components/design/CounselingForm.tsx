"use client";
import { useState } from "react";
import {
  Plus, Trash2, GripVertical, ChevronDown,
  ToggleLeft, ToggleRight, FileText, Hash, Type, List, Calendar,
} from "lucide-react";

export interface FormField {
  id: string;
  label: string;
  type: "text" | "select" | "textarea" | "number" | "date";
  required: boolean;
  options?: string[];
  enabled: boolean;
}

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

const FIELD_TYPE_ICONS: Record<string, React.ReactNode> = {
  text:     <Type size={11} />,
  select:   <List size={11} />,
  textarea: <FileText size={11} />,
  number:   <Hash size={11} />,
  date:     <Calendar size={11} />,
};

function FieldRow({ field, onChange, onDelete }: {
  field: FormField;
  onChange: (f: FormField) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ border: "1px solid var(--surface-3)", borderRadius: 9, overflow: "hidden", marginBottom: 5, opacity: field.enabled ? 1 : 0.55 }}>
      {/* Row header */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 11px", background: "var(--surface-2)" }}>
        <GripVertical size={12} style={{ color: "var(--border-strong)", flexShrink: 0, cursor: "grab" }} />
        <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{FIELD_TYPE_ICONS[field.type]}</span>
        <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>{field.label}</span>
        <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: "var(--surface-3)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
          {field.type}
        </span>
        {field.required && (
          <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: "var(--warning-light)", color: "var(--warning)", border: "1px solid var(--warning-border)" }}>
            Req
          </span>
        )}
        <button
          onClick={() => onChange({ ...field, enabled: !field.enabled })}
          style={{ background: "none", border: "none", cursor: "pointer", color: field.enabled ? "var(--success)" : "var(--border-strong)", display: "flex" }}
        >
          {field.enabled ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
        </button>
        <button
          onClick={() => setExpanded(e => !e)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 0 }}
        >
          <ChevronDown size={13} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        </button>
        <button
          onClick={onDelete}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", display: "flex", padding: 0 }}
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Expanded edit */}
      {expanded && (
        <div style={{ padding: "10px 11px", borderTop: "1px solid var(--surface-3)", background: "var(--surface)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 3 }}>
                Label
              </label>
              <input
                value={field.label}
                onChange={e => onChange({ ...field, label: e.target.value })}
                className="input"
                style={{ fontSize: 12, padding: "7px 10px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 3 }}>
                Type
              </label>
              <select
                value={field.type}
                onChange={e => onChange({ ...field, type: e.target.value as FormField["type"] })}
                className="input"
                style={{ fontSize: 12, padding: "7px 10px" }}
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
              <label style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 3 }}>
                Options (one per line)
              </label>
              <textarea
                value={field.options.join("\n")}
                onChange={e => onChange({ ...field, options: e.target.value.split("\n").filter(Boolean) })}
                rows={3}
                className="input"
                style={{ fontSize: 12, padding: "7px 10px", resize: "none", lineHeight: 1.5 }}
              />
            </div>
          )}

          <button
            onClick={() => onChange({ ...field, required: !field.required })}
            style={{
              marginTop: 8, fontSize: 11, fontWeight: 700, padding: "3px 10px",
              borderRadius: 6, cursor: "pointer", border: "1px solid",
              background: field.required ? "var(--warning-light)" : "var(--surface-2)",
              color: field.required ? "var(--warning)" : "var(--text-muted)",
              borderColor: field.required ? "var(--warning-border)" : "var(--border)",
            }}
          >
            {field.required ? "Required ✓" : "Make Required"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function CounselingForm({ fields, setFields }: {
  fields: FormField[];
  setFields: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType]   = useState<FormField["type"]>("text");

  const addField = () => {
    if (!newFieldLabel.trim()) return;
    setFields(prev => [...prev, {
      id: `f${Date.now()}`, label: newFieldLabel.trim(),
      type: newFieldType, required: false, enabled: true,
      options: newFieldType === "select" ? ["Option 1", "Option 2"] : undefined,
    }]);
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
          { label: "Total Fields",    value: totalFields,    color: "var(--text-primary)", bg: "var(--surface-2)" },
          { label: "Active Fields",   value: activeFields,   color: "var(--success)",      bg: "var(--success-light)" },
          { label: "Required Fields", value: requiredFields, color: "var(--warning)",      bg: "var(--warning-light)" },
        ].map(s => (
          <div key={s.label} style={{ padding: "11px 13px", background: s.bg, borderRadius: 10, border: "1px solid var(--border)" }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: s.color, margin: "0 0 2px" }}>{s.value}</p>
            <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Fields card */}
      <div className="card">
        <div style={{ padding: "11px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Form Fields</p>
            <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: "2px 0 0" }}>Click a field to edit · toggle to enable/disable</p>
          </div>
        </div>
        <div style={{ padding: "11px 13px" }}>
          {fields.map(field => (
            <FieldRow key={field.id} field={field} onChange={updateField} onDelete={() => deleteField(field.id)} />
          ))}

          {/* Add new field */}
          <div style={{ display: "flex", gap: 6, marginTop: 8, padding: 10, background: "var(--surface-2)", borderRadius: 9, border: "1px dashed var(--border)" }}>
            <input
              value={newFieldLabel}
              onChange={e => setNewFieldLabel(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addField()}
              placeholder="New field label…"
              className="input"
              style={{ flex: 1, fontSize: 12, padding: "7px 10px" }}
            />
            <select
              value={newFieldType}
              onChange={e => setNewFieldType(e.target.value as FormField["type"])}
              className="input"
              style={{ width: 105, fontSize: 12, padding: "7px 10px" }}
            >
              <option value="text">Text</option>
              <option value="textarea">Paragraph</option>
              <option value="select">Dropdown</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
            <button onClick={addField} className="btn-primary" style={{ fontSize: 12, padding: "7px 12px", flexShrink: 0 }}>
              <Plus size={12} /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}