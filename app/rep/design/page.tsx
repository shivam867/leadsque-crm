"use client";
import { useState } from "react";
import {
  Layers, FileText, Tag, Bell, Star,
  Plus, Trash2, GripVertical, ChevronDown, Check,
  Save, RotateCcw, ToggleLeft, ToggleRight,
  AlertCircle, Calendar, Hash, Type, List,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────
interface Stage {
  id: string;
  name: string;
  color: string;
  isTerminal: boolean;
  isWon: boolean;
}

interface FormField {
  id: string;
  label: string;
  type: "text" | "select" | "textarea" | "number" | "date";
  required: boolean;
  options?: string[];
  enabled: boolean;
}

interface LeadSource {
  id: string;
  name: string;
  enabled: boolean;
}

interface ScoreWeight {
  id: string;
  label: string;
  weight: number;
  options: { label: string; score: number }[];
}

// ─── Default data ────────────────────────────────────────────────
const DEFAULT_STAGES: Stage[] = [
  { id: "s1", name: "New",            color: "#2563EB", isTerminal: false, isWon: false },
  { id: "s2", name: "Contacted",      color: "#475569", isTerminal: false, isWon: false },
  { id: "s3", name: "Qualified",      color: "#0369A1", isTerminal: false, isWon: false },
  { id: "s4", name: "Proposal Sent",  color: "#7C3AED", isTerminal: false, isWon: false },
  { id: "s5", name: "Negotiation",    color: "#B45309", isTerminal: false, isWon: false },
  { id: "s6", name: "Enrolled",       color: "#059669", isTerminal: true,  isWon: true  },
  { id: "s7", name: "Lost",           color: "#B91C1C", isTerminal: true,  isWon: false },
  { id: "s8", name: "Not Interested", color: "#6B7280", isTerminal: true,  isWon: false },
];

const DEFAULT_FORM_FIELDS: FormField[] = [
  { id: "f1",  label: "Target Program",        type: "text",     required: true,  enabled: true  },
  { id: "f2",  label: "Course Interest",        type: "select",   required: false, enabled: true,  options: ["Foundation Program","Advanced Program","Crash Course","Online Live","Test Series"] },
  { id: "f3",  label: "Engagement Level",       type: "select",   required: true,  enabled: true,  options: ["Just Exploring","Actively Researching","Ready to Enroll"] },
  { id: "f4",  label: "Previous Experience",    type: "textarea", required: false, enabled: true  },
  { id: "f5",  label: "Budget",                 type: "text",     required: true,  enabled: true  },
  { id: "f6",  label: "Pain Points",            type: "textarea", required: false, enabled: true  },
  { id: "f7",  label: "Preferred Batch Timing", type: "select",   required: false, enabled: false, options: ["Morning","Afternoon","Evening","Weekend"] },
  { id: "f8",  label: "Mode Preference",        type: "select",   required: false, enabled: false, options: ["Online","Offline","Hybrid"] },
  { id: "f9",  label: "Referral Source Name",   type: "text",     required: false, enabled: false },
  { id: "f10", label: "Parent Approval Status", type: "select",   required: false, enabled: false, options: ["Approved","Pending","Not Applicable"] },
];

const DEFAULT_SOURCES: LeadSource[] = [
  { id: "ls1", name: "Website",      enabled: true  },
  { id: "ls2", name: "Referral",     enabled: true  },
  { id: "ls3", name: "Cold Call",    enabled: true  },
  { id: "ls4", name: "Instagram Ad", enabled: true  },
  { id: "ls5", name: "Google Ad",    enabled: true  },
  { id: "ls6", name: "YouTube",      enabled: true  },
  { id: "ls7", name: "Seminar",      enabled: true  },
  { id: "ls8", name: "Walk-in",      enabled: true  },
  { id: "ls9", name: "WhatsApp",     enabled: false },
];

const DEFAULT_SCORE_WEIGHTS: ScoreWeight[] = [
  { id: "sw1", label: "Intake Timeline",  weight: 25, options: [{ label: "Immediate", score: 25 },{ label: "1-3 months", score: 18 },{ label: "3-6 months", score: 10 },{ label: "6+ months", score: 4 }] },
  { id: "sw2", label: "Engagement Level", weight: 30, options: [{ label: "Ready to Enroll", score: 30 },{ label: "Actively Researching", score: 18 },{ label: "Just Exploring", score: 6 }] },
  { id: "sw3", label: "Budget Readiness", weight: 25, options: [{ label: "High", score: 25 },{ label: "Medium", score: 15 },{ label: "Low", score: 5 }] },
  { id: "sw4", label: "Education",        weight: 20, options: [{ label: "Post Graduate", score: 20 },{ label: "Graduate", score: 17 },{ label: "Working Professional", score: 14 },{ label: "Final Year", score: 8 }] },
];

const PALETTE_COLORS = [
  "#2563EB","#7C3AED","#059669","#B45309","#B91C1C",
  "#0891B2","#C026D3","#D97706","#374151","#0F766E",
  "#E11D48","#9333EA","#16A34A","#EA580C","#6366F1",
];

const FIELD_TYPE_ICONS: Record<string, React.ReactNode> = {
  text:     <Type size={11} />,
  select:   <List size={11} />,
  textarea: <FileText size={11} />,
  number:   <Hash size={11} />,
  date:     <Calendar size={11} />,
};

// ─── Shared styles ───────────────────────────────────────────────
const S = {
  card: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    overflow: "hidden",
  } as React.CSSProperties,
  cardHeader: {
    padding: "11px 16px",
    borderBottom: "1px solid #F3F4F6",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  } as React.CSSProperties,
  cardBody: { padding: "14px 16px" } as React.CSSProperties,
  sectionTitle: { fontSize: 13, fontWeight: 700, color: "#111827", margin: 0 } as React.CSSProperties,
  sectionSub:   { fontSize: 11, color: "#6B7280", margin: "2px 0 0" } as React.CSSProperties,
  input: {
    fontSize: 12,
    padding: "7px 10px",
    borderRadius: 7,
    border: "1px solid #E5E7EB",
    color: "#111827",
    background: "#fff",
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,
  tag: (color: string) => ({
    fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99,
    background: color + "18", color, border: `1px solid ${color}30`,
  }) as React.CSSProperties,
};

// ─── Toast ───────────────────────────────────────────────────────
function SaveToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20, zIndex: 99,
      display: "flex", alignItems: "center", gap: 8,
      padding: "10px 16px", borderRadius: 9,
      background: "#111827", color: "#fff",
      fontSize: 12, fontWeight: 600,
      boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
    }}>
      <Check size={13} style={{ color: "#4ADE80" }} /> Settings saved
    </div>
  );
}

// ─── Stage row ───────────────────────────────────────────────────
function StageRow({ stage, onChange, onDelete, isDeletable }: {
  stage: Stage; onChange: (s: Stage) => void; onDelete: () => void; isDeletable: boolean;
}) {
  const [showPalette, setShowPalette] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 0", borderBottom: "1px solid #F9FAFB" }}>
      <GripVertical size={13} style={{ color: "#D1D5DB", flexShrink: 0, cursor: "grab" }} />
      <div style={{ position: "relative" }}>
        <button onClick={() => setShowPalette(p => !p)} style={{
          width: 18, height: 18, borderRadius: "50%", background: stage.color,
          border: "2px solid #fff", boxShadow: "0 0 0 1px #E5E7EB", cursor: "pointer", flexShrink: 0,
        }} />
        {showPalette && (
          <div style={{
            position: "absolute", top: 24, left: 0, zIndex: 10,
            background: "#fff", border: "1px solid #E5E7EB", borderRadius: 9,
            padding: 7, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}>
            {PALETTE_COLORS.map(c => (
              <button key={c} onClick={() => { onChange({ ...stage, color: c }); setShowPalette(false); }}
                style={{ width: 16, height: 16, borderRadius: "50%", background: c, border: "none", cursor: "pointer", outline: stage.color === c ? `2px solid ${c}` : "none", outlineOffset: 2 }} />
            ))}
          </div>
        )}
      </div>
      <input value={stage.name} onChange={e => onChange({ ...stage, name: e.target.value })}
        style={{ ...S.input, flex: 1, fontSize: 12, padding: "5px 8px" }} />
      <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
        <button onClick={() => onChange({ ...stage, isWon: !stage.isWon, isTerminal: !stage.isWon ? true : stage.isTerminal })}
          style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 5, cursor: "pointer", border: "1px solid",
            background: stage.isWon ? "#ECFDF5" : "#F9FAFB", color: stage.isWon ? "#059669" : "#9CA3AF", borderColor: stage.isWon ? "#A7F3D0" : "#E5E7EB" }}>Won</button>
        <button onClick={() => onChange({ ...stage, isTerminal: !stage.isTerminal })}
          style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 5, cursor: "pointer", border: "1px solid",
            background: stage.isTerminal ? "#FEF2F2" : "#F9FAFB", color: stage.isTerminal ? "#B91C1C" : "#9CA3AF", borderColor: stage.isTerminal ? "#FECACA" : "#E5E7EB" }}>End</button>
      </div>
      <button onClick={onDelete} disabled={!isDeletable}
        style={{ background: "none", border: "none", cursor: isDeletable ? "pointer" : "default", color: isDeletable ? "#F87171" : "#E5E7EB", flexShrink: 0, display: "flex", alignItems: "center" }}>
        <Trash2 size={12} />
      </button>
    </div>
  );
}

// ─── Field row ───────────────────────────────────────────────────
function FieldRow({ field, onChange, onDelete }: {
  field: FormField; onChange: (f: FormField) => void; onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ border: "1px solid #F0F0F0", borderRadius: 9, overflow: "hidden", marginBottom: 5, opacity: field.enabled ? 1 : 0.55 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 11px", background: "#FAFAFA" }}>
        <GripVertical size={12} style={{ color: "#D1D5DB", flexShrink: 0, cursor: "grab" }} />
        <span style={{ color: "#9CA3AF", flexShrink: 0 }}>{FIELD_TYPE_ICONS[field.type]}</span>
        <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "#374151" }}>{field.label}</span>
        <span style={{ ...S.tag("#6B7280"), fontSize: 9 }}>{field.type}</span>
        {field.required && <span style={{ ...S.tag("#B45309"), fontSize: 9 }}>Req</span>}
        <button onClick={() => onChange({ ...field, enabled: !field.enabled })}
          style={{ background: "none", border: "none", cursor: "pointer", color: field.enabled ? "#059669" : "#D1D5DB", display: "flex" }}>
          {field.enabled ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
        </button>
        <button onClick={() => setExpanded(e => !e)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex", padding: 0 }}>
          <ChevronDown size={13} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        </button>
        <button onClick={onDelete}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#F87171", display: "flex", padding: 0 }}>
          <Trash2 size={12} />
        </button>
      </div>
      {expanded && (
        <div style={{ padding: "10px 11px", borderTop: "1px solid #F0F0F0", background: "#fff" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 3 }}>Label</label>
              <input value={field.label} onChange={e => onChange({ ...field, label: e.target.value })} style={{ ...S.input }} />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 3 }}>Type</label>
              <select value={field.type} onChange={e => onChange({ ...field, type: e.target.value as FormField["type"] })}
                style={{ ...S.input, appearance: "none", cursor: "pointer" }}>
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
              <label style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 3 }}>Options (one per line)</label>
              <textarea value={field.options.join("\n")} onChange={e => onChange({ ...field, options: e.target.value.split("\n").filter(Boolean) })}
                rows={3} style={{ ...S.input, resize: "none", lineHeight: 1.5 }} />
            </div>
          )}
          <button onClick={() => onChange({ ...field, required: !field.required })} style={{
            marginTop: 8, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, cursor: "pointer", border: "1px solid",
            background: field.required ? "#FFFBEB" : "#F9FAFB", color: field.required ? "#B45309" : "#9CA3AF",
            borderColor: field.required ? "#FDE68A" : "#E5E7EB",
          }}>
            {field.required ? "Required ✓" : "Make Required"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Source row ──────────────────────────────────────────────────
function SourceRow({ source, onChange, onDelete }: { source: LeadSource; onChange: (s: LeadSource) => void; onDelete: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 0", borderBottom: "1px solid #F9FAFB" }}>
      <input value={source.name} onChange={e => onChange({ ...source, name: e.target.value })}
        style={{ ...S.input, flex: 1, opacity: source.enabled ? 1 : 0.5 }} />
      <button onClick={() => onChange({ ...source, enabled: !source.enabled })}
        style={{ background: "none", border: "none", cursor: "pointer", color: source.enabled ? "#059669" : "#D1D5DB", display: "flex", flexShrink: 0 }}>
        {source.enabled ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
      </button>
      <button onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", color: "#F87171", display: "flex", flexShrink: 0 }}>
        <Trash2 size={12} />
      </button>
    </div>
  );
}

// ─── Score weight row ────────────────────────────────────────────
function ScoreWeightRow({ sw, onChange }: { sw: ScoreWeight; onChange: (s: ScoreWeight) => void }) {
  return (
    <div style={{ border: "1px solid #F0F0F0", borderRadius: 9, padding: "10px 12px", marginBottom: 7 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{sw.label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 10, color: "#9CA3AF" }}>Max</span>
          <input type="number" value={sw.weight} min={0} max={100}
            onChange={e => onChange({ ...sw, weight: Number(e.target.value) })}
            style={{ ...S.input, width: 48, fontSize: 11, padding: "3px 6px", textAlign: "center" }} />
          <span style={{ fontSize: 10, color: "#9CA3AF" }}>pts</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {sw.options.map((opt, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input value={opt.label} onChange={e => { const o = [...sw.options]; o[i] = { ...opt, label: e.target.value }; onChange({ ...sw, options: o }); }}
              style={{ ...S.input, flex: 1, fontSize: 11, padding: "4px 7px" }} />
            <span style={{ fontSize: 10, color: "#9CA3AF", flexShrink: 0 }}>→</span>
            <input type="number" value={opt.score} min={0} max={sw.weight}
              onChange={e => { const o = [...sw.options]; o[i] = { ...opt, score: Number(e.target.value) }; onChange({ ...sw, options: o }); }}
              style={{ ...S.input, width: 44, fontSize: 11, padding: "4px 6px", textAlign: "center" }} />
            <span style={{ fontSize: 10, color: "#9CA3AF", flexShrink: 0 }}>pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab definitions ─────────────────────────────────────────────
const TABS = [
  { key: "pipeline", label: "Pipeline Stages", icon: <Layers size={13} /> },
  { key: "form",     label: "Counseling Form", icon: <FileText size={13} /> },
  { key: "sources",  label: "Lead Sources",    icon: <Tag size={13} /> },
  { key: "scoring",  label: "Lead Scoring",    icon: <Star size={13} /> },
  { key: "notify",   label: "Notifications",   icon: <Bell size={13} /> },
];

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function DesignSettings() {
  const [activeTab, setActiveTab]   = useState("pipeline");
  const [stages, setStages]         = useState<Stage[]>(DEFAULT_STAGES);
  const [fields, setFields]         = useState<FormField[]>(DEFAULT_FORM_FIELDS);
  const [sources, setSources]       = useState<LeadSource[]>(DEFAULT_SOURCES);
  const [scoreWeights, setScoreWeights] = useState<ScoreWeight[]>(DEFAULT_SCORE_WEIGHTS);
  const [saved, setSaved]           = useState(false);

  const [notifFollowUp,   setNotifFollowUp]   = useState(true);
  const [notifNewLead,    setNotifNewLead]    = useState(true);
  const [notifAssigned,   setNotifAssigned]   = useState(true);
  const [notifEnrolled,   setNotifEnrolled]   = useState(true);
  const [notifOverdue,    setNotifOverdue]    = useState(true);
  const [notifEscalation, setNotifEscalation] = useState(true);

  const [newStageName,  setNewStageName]  = useState("");
  const [newSourceName, setNewSourceName] = useState("");
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType,  setNewFieldType]  = useState<FormField["type"]>("text");

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };

  const addStage = () => {
    if (!newStageName.trim()) return;
    setStages(prev => [...prev, { id: `s${Date.now()}`, name: newStageName.trim(), color: "#6366F1", isTerminal: false, isWon: false }]);
    setNewStageName("");
  };
  const addSource = () => {
    if (!newSourceName.trim()) return;
    setSources(prev => [...prev, { id: `ls${Date.now()}`, name: newSourceName.trim(), enabled: true }]);
    setNewSourceName("");
  };
  const addField = () => {
    if (!newFieldLabel.trim()) return;
    setFields(prev => [...prev, { id: `f${Date.now()}`, label: newFieldLabel.trim(), type: newFieldType, required: false, enabled: true, options: newFieldType === "select" ? ["Option 1","Option 2"] : undefined }]);
    setNewFieldLabel("");
  };

  const activeStages   = stages.filter(s => !s.isTerminal);
  const terminalStages = stages.filter(s => s.isTerminal);
  const totalWeight    = scoreWeights.reduce((a, sw) => a + sw.weight, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#F9FAFB" }}>

      {/* ── Page header ── */}
      <div style={{ padding: "20px 24px 0", background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ marginBottom: 14 }}>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 3px", letterSpacing: "-0.02em" }}>Design</h1>
          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>Customize your CRM pipeline, forms, scoring, and notifications.</p>
        </div>

        {/* ── Horizontal tabs ── */}
        <div style={{ display: "flex", gap: 0, borderBottom: "none" }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 14px",
                fontSize: 12, fontWeight: activeTab === tab.key ? 700 : 500,
                color: activeTab === tab.key ? "#111827" : "#6B7280",
                background: "none", border: "none", cursor: "pointer",
                borderBottom: activeTab === tab.key ? "2px solid #111827" : "2px solid transparent",
                marginBottom: -1,
                transition: "all .15s",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ opacity: activeTab === tab.key ? 1 : 0.6 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 80px" }}>

        {/* ════ PIPELINE STAGES ════ */}
        {activeTab === "pipeline" && (
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>

              {/* Active stages */}
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <div>
                    <p style={S.sectionTitle}>Active Stages</p>
                    <p style={S.sectionSub}>Leads progress through these</p>
                  </div>
                  <span style={S.tag("#2563EB")}>{activeStages.length}</span>
                </div>
                <div style={S.cardBody}>
                  {activeStages.map(stage => (
                    <StageRow key={stage.id} stage={stage}
                      onChange={updated => setStages(prev => prev.map(s => s.id === updated.id ? updated : s))}
                      onDelete={() => setStages(prev => prev.filter(s => s.id !== stage.id))}
                      isDeletable={activeStages.length > 2} />
                  ))}
                  <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
                    <input value={newStageName} onChange={e => setNewStageName(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addStage()}
                      placeholder="New stage name..." style={{ ...S.input, flex: 1 }} />
                    <button onClick={addStage} style={{
                      display: "flex", alignItems: "center", gap: 4, padding: "7px 12px",
                      borderRadius: 7, background: "#111827", color: "#fff",
                      fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", flexShrink: 0,
                    }}><Plus size={12} /> Add</button>
                  </div>
                </div>
              </div>

              {/* Terminal stages */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={S.card}>
                  <div style={S.cardHeader}>
                    <div>
                      <p style={S.sectionTitle}>Terminal Stages</p>
                      <p style={S.sectionSub}>Won or Lost end states</p>
                    </div>
                  </div>
                  <div style={S.cardBody}>
                    {terminalStages.map(stage => (
                      <StageRow key={stage.id} stage={stage}
                        onChange={updated => setStages(prev => prev.map(s => s.id === updated.id ? updated : s))}
                        onDelete={() => setStages(prev => prev.filter(s => s.id !== stage.id))}
                        isDeletable={terminalStages.length > 1} />
                    ))}
                  </div>
                </div>

                {/* Pipeline preview */}
                <div style={S.card}>
                  <div style={S.cardHeader}><p style={S.sectionTitle}>Preview</p></div>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
                      {activeStages.map((stage, i) => (
                        <div key={stage.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            <div style={{ width: 26, height: 26, borderRadius: "50%", background: stage.color + "20", border: `2px solid ${stage.color}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: stage.color }} />
                            </div>
                            <span style={{ fontSize: 8, fontWeight: 700, color: stage.color, textAlign: "center", maxWidth: 46, lineHeight: 1.2 }}>{stage.name}</span>
                          </div>
                          {i < activeStages.length - 1 && <div style={{ width: 14, height: 1.5, background: "#E5E7EB", marginBottom: 14 }} />}
                        </div>
                      ))}
                      <div style={{ display: "flex", alignItems: "center", marginBottom: 14, marginLeft: 4 }}>
                        <div style={{ height: 1.5, width: 12, background: "#E5E7EB" }} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 14 }}>
                        {terminalStages.map(s => (
                          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color }} />
                            <span style={{ fontSize: 9, fontWeight: 700, color: s.color }}>{s.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ COUNSELING FORM ════ */}
        {activeTab === "form" && (
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
              {[
                { label: "Total Fields",    value: fields.length,                         color: "#111827", bg: "#F9FAFB" },
                { label: "Active Fields",   value: fields.filter(f => f.enabled).length,  color: "#059669", bg: "#ECFDF5" },
                { label: "Required Fields", value: fields.filter(f => f.required).length, color: "#B45309", bg: "#FFFBEB" },
              ].map(s => (
                <div key={s.label} style={{ padding: "11px 13px", background: s.bg, borderRadius: 10, border: "1px solid #F0F0F0" }}>
                  <p style={{ fontSize: 20, fontWeight: 900, color: s.color, margin: "0 0 2px" }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div style={S.card}>
              <div style={S.cardHeader}>
                <div>
                  <p style={S.sectionTitle}>Form Fields</p>
                  <p style={S.sectionSub}>Click a field to edit · toggle to enable/disable</p>
                </div>
              </div>
              <div style={{ padding: "11px 13px" }}>
                {fields.map(field => (
                  <FieldRow key={field.id} field={field}
                    onChange={updated => setFields(prev => prev.map(f => f.id === updated.id ? updated : f))}
                    onDelete={() => setFields(prev => prev.filter(f => f.id !== field.id))} />
                ))}
                <div style={{ display: "flex", gap: 6, marginTop: 8, padding: 10, background: "#F9FAFB", borderRadius: 9, border: "1px dashed #E5E7EB" }}>
                  <input value={newFieldLabel} onChange={e => setNewFieldLabel(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addField()}
                    placeholder="New field label..." style={{ ...S.input, flex: 1 }} />
                  <select value={newFieldType} onChange={e => setNewFieldType(e.target.value as FormField["type"])}
                    style={{ ...S.input, width: 105, appearance: "none", cursor: "pointer" }}>
                    <option value="text">Text</option>
                    <option value="textarea">Paragraph</option>
                    <option value="select">Dropdown</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                  </select>
                  <button onClick={addField} style={{
                    display: "flex", alignItems: "center", gap: 4, padding: "7px 12px",
                    borderRadius: 7, background: "#111827", color: "#fff",
                    fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", flexShrink: 0,
                  }}><Plus size={12} /> Add</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ LEAD SOURCES ════ */}
        {activeTab === "sources" && (
          <div style={{ maxWidth: 560 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <p style={S.sectionTitle}>Channels</p>
                  <span style={S.tag("#059669")}>{sources.filter(s => s.enabled).length} active</span>
                </div>
                <div style={S.cardBody}>
                  {sources.map(source => (
                    <SourceRow key={source.id} source={source}
                      onChange={updated => setSources(prev => prev.map(s => s.id === updated.id ? updated : s))}
                      onDelete={() => setSources(prev => prev.filter(s => s.id !== source.id))} />
                  ))}
                  <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
                    <input value={newSourceName} onChange={e => setNewSourceName(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addSource()}
                      placeholder="New source..." style={{ ...S.input, flex: 1 }} />
                    <button onClick={addSource} style={{
                      display: "flex", alignItems: "center", gap: 4, padding: "7px 12px",
                      borderRadius: 7, background: "#111827", color: "#fff",
                      fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", flexShrink: 0,
                    }}><Plus size={12} /> Add</button>
                  </div>
                </div>
              </div>

              {/* Source performance */}
              <div style={S.card}>
                <div style={S.cardHeader}><p style={S.sectionTitle}>Performance (demo)</p></div>
                <div style={S.cardBody}>
                  {[
                    { name: "Referral",     leads: 34, enrolled: 12, pct: 35 },
                    { name: "Seminar",      leads: 28, enrolled: 9,  pct: 32 },
                    { name: "Website",      leads: 52, enrolled: 8,  pct: 15 },
                    { name: "Instagram Ad", leads: 41, enrolled: 7,  pct: 17 },
                  ].map(s => (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                      <span style={{ fontSize: 11, color: "#374151", minWidth: 82 }}>{s.name}</span>
                      <div style={{ flex: 1, height: 5, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${s.pct}%`, background: "#2563EB", borderRadius: 99, opacity: 0.7 }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#059669", minWidth: 30, textAlign: "right" }}>{s.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ LEAD SCORING ════ */}
        {activeTab === "scoring" && (
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Score overview */}
                <div style={S.card}>
                  <div style={S.cardHeader}>
                    <div>
                      <p style={S.sectionTitle}>Weight Distribution</p>
                      <p style={S.sectionSub}>Should sum to 100</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: totalWeight === 100 ? "#059669" : "#B91C1C" }}>{totalWeight}/100</span>
                      {totalWeight !== 100 && <AlertCircle size={13} style={{ color: "#B91C1C" }} />}
                    </div>
                  </div>
                  <div style={S.cardBody}>
                    <div style={{ display: "flex", height: 7, borderRadius: 99, overflow: "hidden", marginBottom: 10, gap: 2 }}>
                      {scoreWeights.map((sw, i) => {
                        const colors = ["#2563EB","#7C3AED","#059669","#D97706"];
                        return <div key={sw.id} style={{ flex: sw.weight, background: colors[i % colors.length], borderRadius: 99 }} />;
                      })}
                    </div>
                    {scoreWeights.map((sw, i) => {
                      const colors = ["#2563EB","#7C3AED","#059669","#D97706"];
                      return (
                        <div key={sw.id} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: colors[i % colors.length], flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: "#374151", flex: 1 }}>{sw.label}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: colors[i % colors.length] }}>{sw.weight}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Score bands */}
                <div style={S.card}>
                  <div style={S.cardHeader}><p style={S.sectionTitle}>Score Bands</p></div>
                  <div style={S.cardBody}>
                    {[
                      { label: "Hot",  range: "70–100", color: "#BE123C", bg: "#FFF1F2", desc: "Follow up immediately" },
                      { label: "Warm", range: "40–69",  color: "#B45309", bg: "#FFFBEB", desc: "Nurture actively" },
                      { label: "Cold", range: "0–39",   color: "#2563EB", bg: "#EFF6FF", desc: "Periodic follow-up" },
                    ].map(b => (
                      <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #F9FAFB" }}>
                        <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 99, background: b.bg, color: b.color, minWidth: 34, textAlign: "center" }}>{b.label}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", minWidth: 44 }}>{b.range}</span>
                        <span style={{ fontSize: 11, color: "#6B7280" }}>{b.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scoring criteria */}
              <div style={S.card}>
                <div style={S.cardHeader}><p style={S.sectionTitle}>Scoring Criteria</p></div>
                <div style={S.cardBody}>
                  {scoreWeights.map(sw => (
                    <ScoreWeightRow key={sw.id} sw={sw}
                      onChange={updated => setScoreWeights(prev => prev.map(s => s.id === updated.id ? updated : s))} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ NOTIFICATIONS ════ */}
        {activeTab === "notify" && (
          <div style={{ maxWidth: 560 }}>
            {[
              {
                section: "Lead Events",
                items: [
                  { label: "New lead assigned",   sub: "Notify rep when a lead is assigned to them",  val: notifAssigned,   set: setNotifAssigned   },
                  { label: "New lead created",     sub: "Notify manager when any new lead is added",   val: notifNewLead,    set: setNotifNewLead    },
                  { label: "Lead enrolled (Won)",  sub: "Team notification when a deal closes",        val: notifEnrolled,   set: setNotifEnrolled   },
                ],
              },
              {
                section: "Follow-up & Tasks",
                items: [
                  { label: "Follow-up due",        sub: "15 minutes before a scheduled follow-up",    val: notifFollowUp,   set: setNotifFollowUp   },
                  { label: "Follow-up overdue",    sub: "Alert if a follow-up is past due by 1 hour", val: notifOverdue,    set: setNotifOverdue    },
                ],
              },
              {
                section: "Manager Alerts",
                items: [
                  { label: "Escalation received", sub: "Notify manager immediately on escalation",    val: notifEscalation, set: setNotifEscalation },
                ],
              },
            ].map(group => (
              <div key={group.section} style={{ ...S.card, marginBottom: 12 }}>
                <div style={S.cardHeader}><p style={S.sectionTitle}>{group.section}</p></div>
                <div style={S.cardBody}>
                  {group.items.map((item, i) => (
                    <div key={item.label} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                      padding: "10px 0", borderBottom: i < group.items.length - 1 ? "1px solid #F9FAFB" : "none",
                    }}>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#111827", margin: 0 }}>{item.label}</p>
                        <p style={{ fontSize: 11, color: "#6B7280", margin: "2px 0 0" }}>{item.sub}</p>
                      </div>
                      <button onClick={() => item.set(!item.val)}
                        style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0, display: "flex", color: item.val ? "#059669" : "#D1D5DB" }}>
                        {item.val ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Save bar (fixed to bottom) ── */}
      <div style={{
        borderTop: "1px solid #E5E7EB", background: "#fff",
        padding: "11px 24px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
      }}>
        <button onClick={handleSave} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 18px",
          borderRadius: 8, background: "#111827", color: "#fff",
          fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer",
        }}><Save size={13} /> Save Changes</button>
        <button onClick={() => { setStages(DEFAULT_STAGES); setFields(DEFAULT_FORM_FIELDS); setSources(DEFAULT_SOURCES); setScoreWeights(DEFAULT_SCORE_WEIGHTS); }}
          style={{
            display: "flex", alignItems: "center", gap: 5, padding: "8px 14px",
            borderRadius: 8, background: "#fff", color: "#374151",
            fontSize: 12, fontWeight: 600, border: "1px solid #E5E7EB", cursor: "pointer",
          }}><RotateCcw size={12} /> Reset</button>
        <span style={{ fontSize: 11, color: "#9CA3AF" }}>Changes apply to all reps in your workspace</span>
      </div>

      <SaveToast show={saved} />
    </div>
  );
}