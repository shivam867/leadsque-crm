"use client";
import { useState } from "react";
import { Bell, Save, Check } from "lucide-react";
import Notifications from "@/components/design/Notifications";

function SaveToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20, zIndex: 99,
      display: "flex", alignItems: "center", gap: 8,
      padding: "10px 16px", borderRadius: 8,
      background: "var(--text-primary)", color: "#fff",
      fontSize: 13, fontWeight: 600,
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    }}>
      <Check size={13} style={{ color: "var(--success)" }} /> Settings saved
    </div>
  );
}

export default function RepDesignSettings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)" }}>

      {/* Header */}
      <div className="animate-fade-up" style={{ padding: "20px 24px 18px", background: "var(--surface)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 className="page-title" style={{ fontSize: 18, marginBottom: 2 }}>Settings</h1>
            <p className="page-subtitle">Configure your notification preferences.</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleSave} className="btn-primary" style={{ fontSize: 13 }}>
              <Save size={13} /> Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-up" style={{ flex: 1, overflowY: "auto", animationDelay: "40ms" }}>
        <div style={{ maxWidth: 680, padding: "24px 24px 40px" }}>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid var(--border)" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bell size={15} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Notifications</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>Choose when and how you're notified about lead activity</p>
            </div>
          </div>

          <Notifications />
        </div>
      </div>

      <SaveToast show={saved} />
    </div>
  );
}