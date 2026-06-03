"use client";
import { useState } from "react";
import { Tag, Bell, Save, RotateCcw, Check } from "lucide-react";

import LeadSources, { DEFAULT_SOURCES, type LeadSource } from "@/components/design/LeadSources";
import Notifications from "@/components/design/Notifications";

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
  { key: "sources", label: "Lead Sources",  icon: <Tag size={13} /> },
  { key: "notify",  label: "Notifications", icon: <Bell size={13} /> },
];

export default function RepDesignSettings() {
  const [activeTab, setActiveTab] = useState("sources");
  const [sources, setSources]     = useState<LeadSource[]>(DEFAULT_SOURCES);
  const [saved, setSaved]         = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)" }}>

      {/* Page header */}
      <div className="animate-fade-up" style={{ padding: "20px 24px 0", background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ marginBottom: 14 }}>
          <h1 className="page-title" style={{ fontSize: 18, marginBottom: 3 }}>Design</h1>
          <p className="page-subtitle">Configure your lead sources and notification preferences.</p>
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
      <div className="animate-fade-up" style={{ flex: 1, overflowY: "auto", padding: "20px 24px 80px", animationDelay: "40ms" }}>
        {activeTab === "sources" && <LeadSources sources={sources} setSources={setSources} />}
        {activeTab === "notify"  && <Notifications />}
      </div>

      {/* Save bar */}
      <div style={{
        borderTop: "1px solid var(--border)", background: "var(--surface)",
        padding: "11px 24px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
      }}>
        <button onClick={handleSave} className="btn-primary" style={{ fontSize: 12 }}>
          <Save size={13} /> Save Changes
        </button>
        <button onClick={() => setSources(DEFAULT_SOURCES)} className="btn-secondary" style={{ fontSize: 12 }}>
          <RotateCcw size={12} /> Reset
        </button>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Changes apply to your account</span>
      </div>

      <SaveToast show={saved} />
    </div>
  );
}