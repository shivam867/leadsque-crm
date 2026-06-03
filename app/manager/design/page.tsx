"use client";
import { useState } from "react";
import { Layers, FileText, Star, Save, RotateCcw, Check } from "lucide-react";

import PipelineStages, { DEFAULT_STAGES, type Stage } from "@/components/design/PipelineStages";
import CounselingForm, { DEFAULT_FORM_FIELDS, type FormField } from "@/components/design/CounselingForm";
import LeadScoring, { DEFAULT_SCORE_WEIGHTS, type ScoreWeight } from "@/components/design/LeadScoring";

function SaveToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20, zIndex: 99,
      display: "flex", alignItems: "center", gap: 8,
      padding: "10px 16px", borderRadius: 9,
      background: "var(--text-primary)", color: "#fff",
      fontSize: 12, fontWeight: 600,
      boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
    }}>
      <Check size={13} style={{ color: "var(--success)" }} /> Settings saved
    </div>
  );
}

const TABS = [
  { key: "pipeline", label: "Pipeline Stages", icon: <Layers size={13} /> },
  { key: "form",     label: "Counseling Form", icon: <FileText size={13} /> },
  { key: "scoring",  label: "Lead Scoring",    icon: <Star size={13} /> },
];

export default function ManagerDesignSettings() {
  const [activeTab, setActiveTab]       = useState("pipeline");
  const [stages, setStages]             = useState<Stage[]>(DEFAULT_STAGES);
  const [fields, setFields]             = useState<FormField[]>(DEFAULT_FORM_FIELDS);
  const [scoreWeights, setScoreWeights] = useState<ScoreWeight[]>(DEFAULT_SCORE_WEIGHTS);
  const [saved, setSaved]               = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleReset = () => {
    setStages(DEFAULT_STAGES);
    setFields(DEFAULT_FORM_FIELDS);
    setScoreWeights(DEFAULT_SCORE_WEIGHTS);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)" }}>

      {/* Page header */}
      <div style={{ padding: "20px 24px 0", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ marginBottom: 14 }}>
          <h1 className="page-title" style={{ fontSize: 18, marginBottom: 3 }}>CRM Design</h1>
          <p className="page-subtitle">Configure pipeline stages, counseling form, and lead scoring rules for all reps.</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0 }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 14px",
                fontSize: 12, fontWeight: activeTab === tab.key ? 700 : 500,
                color: activeTab === tab.key ? "var(--text-primary)" : "var(--text-secondary)",
                background: "none", border: "none", cursor: "pointer",
                borderBottom: activeTab === tab.key ? "2px solid var(--text-primary)" : "2px solid transparent",
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

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 80px" }}>
        {activeTab === "pipeline" && <PipelineStages stages={stages} setStages={setStages} />}
        {activeTab === "form"     && <CounselingForm fields={fields} setFields={setFields} />}
        {activeTab === "scoring"  && <LeadScoring scoreWeights={scoreWeights} setScoreWeights={setScoreWeights} />}
      </div>

      {/* Save bar */}
      <div style={{
        borderTop: "1px solid var(--border)", background: "var(--surface)",
        padding: "11px 24px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
      }}>
        <button onClick={handleSave} className="btn-primary" style={{ fontSize: 12 }}>
          <Save size={13} /> Save Changes
        </button>
        <button onClick={handleReset} className="btn-secondary" style={{ fontSize: 12 }}>
          <RotateCcw size={12} /> Reset
        </button>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Changes apply to all reps in your workspace</span>
      </div>

      <SaveToast show={saved} />
    </div>
  );
}