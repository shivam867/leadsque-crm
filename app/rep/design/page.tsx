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
      background: "#111827", color: "#fff",
      fontSize: 12, fontWeight: 600,
      boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
    }}>
      <Check size={13} style={{ color: "#4ADE80" }} /> Settings saved
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
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#F9FAFB" }}>

      {/* Page header */}
      <div className="animate-fade-up" style={{ padding: "20px 24px 0", background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ marginBottom: 14 }}>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 3px", letterSpacing: "-0.02em" }}>
            Design
          </h1>
          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
            Configure your lead sources and notification preferences.
          </p>
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

      {/* Scrollable content */}
      <div className="animate-fade-up" style={{ flex: 1, overflowY: "auto", padding: "20px 24px 80px", animationDelay: "40ms" }}>
        {activeTab === "sources" && (
          <LeadSources sources={sources} setSources={setSources} />
        )}
        {activeTab === "notify" && (
          <Notifications />
        )}
      </div>

      {/* Save bar */}
      <div style={{
        borderTop: "1px solid #E5E7EB", background: "#fff",
        padding: "11px 24px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
      }}>
        <button
          onClick={handleSave}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 18px",
            borderRadius: 8, background: "#111827", color: "#fff",
            fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer",
          }}
        >
          <Save size={13} /> Save Changes
        </button>
        <button
          onClick={() => setSources(DEFAULT_SOURCES)}
          style={{
            display: "flex", alignItems: "center", gap: 5, padding: "8px 14px",
            borderRadius: 8, background: "#fff", color: "#374151",
            fontSize: 12, fontWeight: 600, border: "1px solid #E5E7EB", cursor: "pointer",
          }}
        >
          <RotateCcw size={12} /> Reset
        </button>
        <span style={{ fontSize: 11, color: "#9CA3AF" }}>Changes apply to your account</span>
      </div>

      <SaveToast show={saved} />
    </div>
  );
}