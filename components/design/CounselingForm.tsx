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

const TYPE_ICONS: Record<string, React.ReactNode> = {
  text:     <Type size={10} />,
  select:   <List size={10} />,
  textarea: <FileText size={10} />,
  number:   <Hash size={10} />,
  date:     <Calendar size={10} />,
};

const TYPE_LABEL: Record<string, string> = {
  text: "Text", select: "Dropdown", textarea: "Paragraph", number: "Number", date: "Date",
};

// ─── Stat chip ───────────────────────────────────────────────────
function Stat({ value, label, color, bg, border }: {
  value: number; label: string;
  color: string; bg: string; border: string;
}) {
  return (
    <div style={{
      flex: 1, padding: "10px 12px", background: bg,
      border: `1px solid ${border}`, borderRadius: 9,
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <span style={{ fontSize: 22, fontWeight: 900, color, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 11, color, fontWeight: 600, lineHeight: 1.3 }}>{label}</span>
    </div>
  );
}

// ─── Field Row ───────────────────────────────────────────────────
function FieldRow({ field, onChange, onDelete }: {
  field: FormField; onChange: (f: FormField) => void; onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      border: "1px solid #F3F4F6", borderRadius: 8,
      overflow: "hidden", marginBottom: 4,
      opacity: field.enabled ? 1 : 0.5,
      transition: "opacity .15s",
    }}>
      {/* Header row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "7px 10px", background: "#FAFAFA",
      }}>
        <GripVertical size={12} style={{ color: "#D1D5DB", cursor: "grab", flexShrink: 0 }} />
        <span style={{ color: "#9CA3AF", flexShrink: 0, display: "flex" }}>{TYPE_ICONS[field.type]}</span>
        <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "#374151", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {field.label}
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 99, background: "#F3F4F6", color: "#6B7280", border: "1px solid #E5E7EB", flexShrink: 0 }}>
          {TYPE_LABEL[field.type]}
        </span>
        {field.required && (
          <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 99, background: "#FFFBEB", color: "#B45309", border: "1px solid #FDE68A", flexShrink: 0 }}>
            Req
          </span>
        )}
        <button onClick={() => onChange({ ...field, enabled: !field.enabled })}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", color: field.enabled ? "#059669" : "#D1D5DB", flexShrink: 0 }}>
          {field.enabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
        </button>
        <button onClick={() => setExpanded(e => !e)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex", padding: 0, flexShrink: 0 }}>
          <ChevronDown size={12} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        </button>
        <button onClick={onDelete}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#F87171", display: "flex", padding: 0, flexShrink: 0 }}>
          <Trash2 size={11} />
        </button>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div style={{ padding: "9px 10px", borderTop: "1px solid #F3F4F6", background: "#fff", display: "flex", flexDirection: "column", gap: 7 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
            <div>
              <label style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 3 }}>Label</label>
              <input value={field.label} onChange={e => onChange({ ...field, label: e.target.value })}
                style={{ width: "100%", fontSize: 11, padding: "5px 8px", borderRadius: 6, border: "1px solid #E5E7EB", outline: "none", boxSizing: "border-box" as const }} />
            </div>
            <div>
              <label style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 3 }}>Type</label>
              <select value={field.type} onChange={e => onChange({ ...field, type: e.target.value as FormField["type"] })}
                style={{ width: "100%", fontSize: 11, padding: "5px 8px", borderRadius: 6, border: "1px solid #E5E7EB", outline: "none", boxSizing: "border-box" as const }}>
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
              <label style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 3 }}>Options (one per line)</label>
              <textarea value={field.options.join("\n")} rows={3}
                onChange={e => onChange({ ...field, options: e.target.value.split("\n").filter(Boolean) })}
                style={{ width: "100%", fontSize: 11, padding: "5px 8px", borderRadius: 6, border: "1px solid #E5E7EB", outline: "none", resize: "none", lineHeight: 1.5, boxSizing: "border-box" as const }} />
            </div>
          )}
          <button onClick={() => onChange({ ...field, required: !field.required })}
            style={{
              alignSelf: "flex-start", fontSize: 10, fontWeight: 700, padding: "3px 9px",
              borderRadius: 5, cursor: "pointer", border: "1px solid",
              background: field.required ? "#FFFBEB" : "#F9FAFB",
              color: field.required ? "#B45309" : "#9CA3AF",
              borderColor: field.required ? "#FDE68A" : "#E5E7EB",
            }}>
            {field.required ? "Required ✓" : "Mark as Required"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────
export default function CounselingForm({ fields, setFields }: {
  fields: FormField[];
  setFields: React.Dispatch<React.SetStateAction<FormField[]>>;
}) {
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType]   = useState<FormField["type"]>("text");

  const safeFields = fields ?? DEFAULT_FORM_FIELDS;
  const active   = safeFields.filter(f => f.enabled).length;
  const required = safeFields.filter(f => f.required).length;
  const disabled = safeFields.filter(f => !f.enabled).length;

  const addField = () => {
    if (!newLabel.trim()) return;
    setFields(prev => [...prev, {
      id: `f${Date.now()}`, label: newLabel.trim(), type: newType,
      required: false, enabled: true,
      options: newType === "select" ? ["Option 1", "Option 2"] : undefined,
    }]);
    setNewLabel("");
  };

  const update = (u: FormField) => setFields(prev => prev.map(f => f.id === u.id ? u : f));
  const remove = (id: string)   => setFields(prev => prev.filter(f => f.id !== id));

  const cardStyle: React.CSSProperties = {
    background: "#fff", border: "1px solid #E5E7EB",
    borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>

      {/* ── Summary strip (top) ── */}
      <div style={{ display: "flex", gap: 8 }}>
        <Stat value={safeFields.length} label="Total Fields"    color="#374151" bg="#F9FAFB"  border="#E5E7EB" />
        <Stat value={active}            label="Active"          color="#059669" bg="#ECFDF5"  border="#A7F3D0" />
        <Stat value={required}          label="Required"        color="#B45309" bg="#FFFBEB"  border="#FDE68A" />
        <Stat value={disabled}          label="Hidden"          color="#6B7280" bg="#F3F4F6"  border="#E5E7EB" />
      </div>

      {/* ── Two columns: active fields | disabled fields ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flex: 1, minHeight: 0 }}>

        {/* Active / enabled fields */}
        <div style={cardStyle}>
          <div style={{
            padding: "9px 13px", borderBottom: "1px solid #F3F4F6",
            background: "#FAFAFA", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#111827", margin: 0 }}>Active Fields</p>
              <p style={{ fontSize: 10, color: "#9CA3AF", margin: "1px 0 0" }}>Shown to reps during counseling</p>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 99, background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0" }}>
              {active}
            </span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
            {safeFields.filter(f => f.enabled).map(f => (
              <FieldRow key={f.id} field={f} onChange={update} onDelete={() => remove(f.id)} />
            ))}
            {active === 0 && (
              <p style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", padding: "20px 0", margin: 0 }}>No active fields</p>
            )}
          </div>
          {/* Add field */}
          <div style={{ padding: "8px 10px", borderTop: "1px solid #F3F4F6", display: "flex", gap: 5, flexShrink: 0 }}>
            <input
              value={newLabel} onChange={e => setNewLabel(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addField()}
              placeholder="New field label…"
              style={{ flex: 1, fontSize: 11, padding: "5px 8px", borderRadius: 6, border: "1px solid #E5E7EB", outline: "none", minWidth: 0 }}
            />
            <select value={newType} onChange={e => setNewType(e.target.value as FormField["type"])}
              style={{ width: 88, fontSize: 11, padding: "5px 6px", borderRadius: 6, border: "1px solid #E5E7EB", outline: "none" }}>
              <option value="text">Text</option>
              <option value="textarea">Paragraph</option>
              <option value="select">Dropdown</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
            </select>
            <button onClick={addField} style={{
              display: "flex", alignItems: "center", gap: 3, padding: "5px 10px",
              borderRadius: 6, background: "#111827", color: "#fff",
              fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", flexShrink: 0,
            }}><Plus size={11} /> Add</button>
          </div>
        </div>

        {/* Disabled / hidden fields */}
        <div style={cardStyle}>
          <div style={{
            padding: "9px 13px", borderBottom: "1px solid #F3F4F6",
            background: "#FAFAFA", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#111827", margin: 0 }}>Hidden Fields</p>
              <p style={{ fontSize: 10, color: "#9CA3AF", margin: "1px 0 0" }}>Toggle on to make visible to reps</p>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 99, background: "#F3F4F6", color: "#6B7280", border: "1px solid #E5E7EB" }}>
              {disabled}
            </span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
            {safeFields.filter(f => !f.enabled).map(f => (
              <FieldRow key={f.id} field={f} onChange={update} onDelete={() => remove(f.id)} />
            ))}
            {disabled === 0 && (
              <p style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", padding: "20px 0", margin: 0 }}>
                All fields are active
              </p>
            )}
          </div>
          <div style={{ padding: "8px 10px", borderTop: "1px solid #F3F4F6", flexShrink: 0 }}>
            <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0, lineHeight: 1.5 }}>
              Toggle the switch on any field to move it between Active and Hidden.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}