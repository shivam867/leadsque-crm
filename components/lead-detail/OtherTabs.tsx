"use client";
import { useState } from "react";
import { PhoneCall, PhoneMissed, Ban, CheckCircle2, AlertTriangle, Send } from "lucide-react";
import { Lead, LeadStatus } from "./types";
import { STATUS_CONFIG, SCORE_CONFIG, ESCALATION_REASONS, ACTIVITY_COLORS, ACTIVITY_LABELS } from "./constants";

// ─── CALL LOGS TAB ────────────────────────────────────────────────
export function CallLogsTab({ lead }: { lead: Lead }) {
  const connected = lead.callLogs.filter(c => c.result === "Connected").length;

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {([
          { label: `${lead.callLogs.length} Total`,            c: "#1D4ED8", bg: "#EFF6FF", b: "#BFDBFE" },
          { label: `${connected} Connected`,                    c: "#059669", bg: "#ECFDF5", b: "#A7F3D0" },
          { label: `${lead.callLogs.length - connected} Missed`,c: "#374151", bg: "#F3F4F6", b: "#E5E7EB" },
        ] as const).map(x => (
          <span key={x.label} style={{ fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 99, background: x.bg, color: x.c, border: `1px solid ${x.b}` }}>
            {x.label}
          </span>
        ))}
      </div>

      {lead.callLogs.length === 0 ? (
        <div style={{ textAlign: "center" as const, padding: "50px 0", color: "#9CA3AF", fontSize: 13 }}>No call logs yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
          {lead.callLogs.map(log => {
            const rc = log.result === "Connected" ? "#059669" : log.result === "Busy" ? "#B45309" : "#B91C1C";
            const RI = log.result === "Connected" ? PhoneCall : log.result === "Not Connected" ? PhoneMissed : Ban;
            return (
              <div key={log.id} style={{ padding: "13px 16px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, display: "flex", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${rc}18`, color: rc, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <RI size={16} strokeWidth={2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: rc }}>{log.result}</span>
                    <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "monospace" }}>{log.date} · {log.time}</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginBottom: log.remarks ? 4 : 0 }}>
                    {log.duration && <span style={{ fontSize: 12, color: "#374151" }}>{log.duration}</span>}
                    <span style={{ fontSize: 11, color: "#6B7280" }}>by {log.by}</span>
                  </div>
                  {log.remarks && <p style={{ fontSize: 12, color: "#1F2937", margin: 0, lineHeight: 1.5 }}>{log.remarks}</p>}
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
        <div style={{ textAlign: "center" as const, padding: "50px 0", color: "#9CA3AF", fontSize: 13 }}>No activity yet.</div>
      ) : (
        <ol style={{ position: "relative" as const, borderLeft: "2px solid #E5E7EB", marginLeft: 6, padding: 0, listStyle: "none" as const }}>
          {lead.activity.map((item, i) => {
            const color = ACTIVITY_COLORS[item.type] ?? "#374151";
            return (
              <li key={i} style={{ position: "relative" as const, paddingBottom: 16, paddingLeft: 20 }}>
                <span style={{ position: "absolute" as const, left: -5, top: 4, width: 10, height: 10, borderRadius: "50%", background: color, border: "2px solid #F5F5F7" }} />
                <div style={{ padding: "10px 14px", background: "#fff", borderRadius: 9, border: "1px solid #E5E7EB" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color, margin: 0, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
                      {ACTIVITY_LABELS[item.type]}
                    </p>
                    <p style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "monospace", margin: 0 }}>{item.time}</p>
                  </div>
                  <p style={{ fontSize: 13, color: "#1F2937", lineHeight: 1.5, margin: "0 0 3px" }}>{item.text}</p>
                  {item.by && <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0 }}>by {item.by}</p>}
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

  return (
    <div style={{ maxWidth: 580 }}>
      <div style={{ padding: "13px 16px", background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, marginBottom: 16, display: "flex", gap: 12 }}>
        <AlertTriangle size={18} style={{ color: "#C2410C", flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#C2410C", margin: "0 0 3px" }}>Escalate to Manager</p>
          <p style={{ fontSize: 12, color: "#78350F", margin: 0, lineHeight: 1.5 }}>
            Flag this lead for manager attention — discount approvals, high-value opportunities, or situations beyond your authority.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div style={{ padding: "12px 14px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 9 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: "0.05em", margin: "0 0 8px" }}>Lead</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>{lead.name}</p>
          <p style={{ fontSize: 12, color: "#374151", margin: 0 }}>{lead.service}</p>
        </div>
        <div style={{ padding: "12px 14px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 9 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: "0.05em", margin: "0 0 8px" }}>Status</p>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" as const }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>{lead.status}</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: scorec.bg, color: scorec.text }}>{lead.score}</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 6, display: "block" }}>Reason *</label>
        <select
          value={reason}
          onChange={e => setReason(e.target.value)}
          style={{ width: "100%", fontSize: 13, padding: "10px 14px", borderRadius: 9, border: "1px solid #E5E7EB", background: "#fff", color: "#111827", cursor: "pointer" }}
        >
          <option value="">Select reason...</option>
          {ESCALATION_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 6, display: "block" }}>Priority</label>
        <div style={{ display: "flex", gap: 7 }}>
          {([{ l: "Normal", ab: "#111827" }, { l: "Urgent", ab: "#B45309" }, { l: "Critical", ab: "#B91C1C" }] as const).map(p => (
            <button
              key={p.l}
              onClick={() => setPriority(p.l)}
              style={{ flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", background: priority === p.l ? p.ab : "#F9FAFB", color: priority === p.l ? "#fff" : "#374151", border: `1.5px solid ${priority === p.l ? p.ab : "#E5E7EB"}` }}
            >
              {p.l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 6, display: "block" }}>Context for Manager</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Budget discussed, what the student said, what you've already tried..."
          rows={4}
          style={{ width: "100%", fontSize: 12, padding: "10px 12px", borderRadius: 9, border: "1px solid #E5E7EB", resize: "none" as const, color: "#111827", background: "#fff", boxSizing: "border-box" as const, lineHeight: 1.55, outline: "none" }}
        />
      </div>

      <button
        onClick={send}
        disabled={!reason}
        style={{ width: "100%", padding: "11px 0", borderRadius: 9, fontSize: 13, fontWeight: 700, border: "none", cursor: reason ? "pointer" : "not-allowed", background: sent ? "#ECFDF5" : reason ? "#C2410C" : "#F3F4F6", color: sent ? "#059669" : reason ? "#fff" : "#9CA3AF", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
      >
        {sent ? <><CheckCircle2 size={15} />Escalation Sent!</> : <><Send size={13} />Send to Manager</>}
      </button>
    </div>
  );
}