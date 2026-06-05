"use client";
import { useState } from "react";
import { PhoneCall, PhoneMissed, Ban, CheckCircle2, AlertTriangle, Send } from "lucide-react";
import { Lead, LeadStatus } from "./types";
import { STATUS_CONFIG, SCORE_CONFIG, ESCALATION_REASONS, ACTIVITY_COLORS, ACTIVITY_LABELS } from "./constants";

/* ── Shared card header ── */
const HEAD = (accent: string): React.CSSProperties => ({
  padding: "8px 12px", borderBottom: "1px solid var(--border)",
  display: "flex", alignItems: "center", justifyContent: "space-between",
  background: "var(--surface-2)", borderLeft: `3px solid ${accent}`,
});
const LABEL: React.CSSProperties = { fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" };

// ─── CALL LOGS TAB ────────────────────────────────────────────────
export function CallLogsTab({ lead }: { lead: Lead }) {
  const connected = lead.callLogs.filter(c => c.result === "Connected").length;
  return (
    <div style={{ maxWidth: 680 }}>
      {/* Summary pills */}
      <div style={{ display: "flex", gap: 7, marginBottom: 14 }}>
        {([
          { label: `${lead.callLogs.length} Total`,             bg: "var(--surface-2)", color: "var(--text-secondary)", border: "var(--border-strong)" },
          { label: `${connected} Connected`,                     bg: "var(--success-light)", color: "var(--success)", border: "var(--success-border)" },
          { label: `${lead.callLogs.length - connected} Missed`, bg: "var(--surface-2)", color: "var(--text-muted)", border: "var(--border)" },
        ]).map(x => (
          <span key={x.label} style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 6, background: x.bg, color: x.color, border: `1px solid ${x.border}` }}>
            {x.label}
          </span>
        ))}
      </div>

      {lead.callLogs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)", fontSize: 13 }}>No call logs yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {lead.callLogs.map(log => {
            const rc = log.result === "Connected" ? "var(--success)" : log.result === "Busy" ? "var(--warning)" : "var(--danger)";
            const RI = log.result === "Connected" ? PhoneCall : log.result === "Not Connected" ? PhoneMissed : Ban;
            return (
              <div key={log.id} style={{ padding: "12px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--surface-2)", color: rc, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid var(--border)" }}>
                  <RI size={15} strokeWidth={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: rc }}>{log.result}</span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>{log.date} · {log.time}</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginBottom: log.remarks ? 4 : 0 }}>
                    {log.duration && <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{log.duration}</span>}
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>by {log.by}</span>
                  </div>
                  {log.remarks && <p style={{ fontSize: 12, color: "var(--text-primary)", margin: 0, lineHeight: 1.5 }}>{log.remarks}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── ACTIVITY TAB ─────────────────────────────────────────────────
export function ActivityTab({ lead }: { lead: Lead }) {
  return (
    <div style={{ maxWidth: 600 }}>
      {lead.activity.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)", fontSize: 13 }}>No activity yet.</div>
      ) : (
        <ol style={{ position: "relative", borderLeft: "2px solid var(--border)", marginLeft: 6, padding: 0, listStyle: "none" }}>
          {lead.activity.map((item, i) => {
            const color = ACTIVITY_COLORS[item.type] ?? "var(--text-muted)";
            return (
              <li key={i} style={{ position: "relative", paddingBottom: 14, paddingLeft: 20 }}>
                <span style={{ position: "absolute", left: -5, top: 5, width: 9, height: 9, borderRadius: "50%", background: color, border: "2px solid var(--surface-2)" }} />
                <div style={{ padding: "10px 12px", background: "var(--surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <p style={{ fontSize: 9, fontWeight: 800, color, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{ACTIVITY_LABELS[item.type]}</p>
                    <p style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "monospace", margin: 0 }}>{item.time}</p>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-primary)", lineHeight: 1.5, margin: "0 0 2px" }}>{item.text}</p>
                  {item.by && <p style={{ fontSize: 10, color: "var(--text-muted)", margin: 0 }}>by {item.by}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

// ─── ESCALATE TAB ─────────────────────────────────────────────────
export function EscalateTab({ lead }: { lead: Lead }) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [sent, setSent] = useState(false);

  const sc = STATUS_CONFIG[lead.status] ?? STATUS_CONFIG["New"];
  const scorec = SCORE_CONFIG[lead.score] ?? SCORE_CONFIG.Cold;

  const send = () => {
    if (!reason) return;
    setSent(true);
    setTimeout(() => { setSent(false); setReason(""); setNote(""); }, 2200);
  };

  const PRIORITIES = [
    { l: "Normal",   color: "#111111" },
    { l: "Urgent",   color: "var(--warning)" },
    { l: "Critical", color: "var(--danger)" },
  ] as const;

  return (
    <div style={{ maxWidth: 560 }}>
      {/* Warning banner */}
      <div style={{ padding: "10px 14px", background: "var(--warning-light)", border: "1px solid var(--warning-border)", borderRadius: "var(--radius-md)", marginBottom: 14, display: "flex", gap: 10 }}>
        <AlertTriangle size={15} style={{ color: "var(--warning)", flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--warning)", margin: "0 0 2px" }}>Escalate to Manager</p>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
            Flag for discount approvals, high-value opportunities, or situations beyond your authority.
          </p>
        </div>
      </div>

      {/* Lead summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div style={{ padding: "10px 12px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px" }}>Lead</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 1px" }}>{lead.name}</p>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>{lead.service}</p>
        </div>
        <div style={{ padding: "10px 12px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px" }}>Status</p>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>{lead.status}</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: scorec.bg, color: scorec.text }}>{lead.score}</span>
          </div>
        </div>
      </div>

      {/* Reason */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5, display: "block" }}>Reason *</label>
        <select value={reason} onChange={e => setReason(e.target.value)} style={{ width: "100%", fontSize: 12, padding: "8px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text-primary)", cursor: "pointer", fontFamily: "inherit", outline: "none" }}>
          <option value="">Select reason...</option>
          {ESCALATION_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Priority */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5, display: "block" }}>Priority</label>
        <div style={{ display: "flex", gap: 6 }}>
          {PRIORITIES.map(p => (
            <button key={p.l} onClick={() => setPriority(p.l)} style={{ flex: 1, padding: "7px 0", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 600, cursor: "pointer", background: priority === p.l ? p.color : "var(--surface-2)", color: priority === p.l ? "#fff" : "var(--text-secondary)", border: `1px solid ${priority === p.l ? p.color : "var(--border-strong)"}`, transition: "all .12s" }}>
              {p.l}
            </button>
          ))}
        </div>
      </div>

      {/* Context */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5, display: "block" }}>Context for Manager</label>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Budget discussed, what the student said, what you've already tried..." rows={4} style={{ width: "100%", fontSize: 12, padding: "8px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-strong)", resize: "none", color: "var(--text-primary)", background: "var(--surface)", boxSizing: "border-box", lineHeight: 1.55, outline: "none", fontFamily: "inherit" }} />
      </div>

      <button onClick={send} disabled={!reason} style={{ width: "100%", padding: "10px 0", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 700, border: "none", cursor: reason ? "pointer" : "not-allowed", background: sent ? "var(--success-light)" : reason ? "var(--danger)" : "var(--surface-2)", color: sent ? "var(--success)" : reason ? "#fff" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all .15s" }}>
        {sent ? <><CheckCircle2 size={14} />Escalation Sent!</> : <><Send size={13} />Send to Manager</>}
      </button>
    </div>
  );
}