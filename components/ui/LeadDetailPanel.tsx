"use client";
import { useState } from "react";
import type { Lead, LeadStatus } from "@/data/dummy";
import { STATUS_CONFIG, SCORE_CONFIG } from "@/data/dummy";
import {
  X, Phone, PhoneMissed, Clock, Ban, CheckCircle2,
  MapPin, Mail, CalendarDays, ChevronRight,
  StickyNote, PhoneCall, Activity, ChevronDown,
  MessageSquare, BookOpen, Send, MessageCircle,
  AtSign, Users, Zap, Edit3,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────
interface ActivityEntry {
  id: string;
  type: "call" | "note" | "status" | "followup" | "whatsapp" | "email" | "meeting" | "sms";
  text: string;
  time: string;
  by: string;
}

const CALL_OUTCOMES = [
  { label: "Connected", icon: <PhoneCall size={12} />,   result: "Connected"     as const, color: "var(--success)", bg: "var(--success-light)", border: "var(--success-border)" },
  { label: "No Answer", icon: <PhoneMissed size={12} />, result: "Not Connected" as const, color: "var(--text-secondary)", bg: "var(--surface-2)", border: "var(--border)" },
  { label: "Busy",      icon: <Clock size={12} />,       result: "Busy"          as const, color: "var(--warning)", bg: "var(--warning-light)", border: "var(--warning-border)" },
  { label: "Wrong #",   icon: <Ban size={12} />,         result: "Wrong Number"  as const, color: "var(--danger)",  bg: "var(--danger-light)",  border: "var(--danger-border)" },
] as const;

const ACTIVITY_TYPES = [
  { type: "whatsapp" as const, label: "WhatsApp", icon: <MessageCircle size={13} />, color: "var(--success)", placeholder: "Message sent..." },
  { type: "email"    as const, label: "Email",    icon: <AtSign size={13} />,        color: "var(--info)",    placeholder: "Email content..." },
  { type: "meeting"  as const, label: "Meeting",  icon: <Users size={13} />,         color: "var(--accent)",  placeholder: "Meeting notes..." },
  { type: "sms"      as const, label: "SMS",      icon: <MessageSquare size={13} />, color: "var(--text-secondary)", placeholder: "SMS sent..." },
  { type: "note"     as const, label: "Note",     icon: <Edit3 size={13} />,         color: "var(--warning)", placeholder: "Add a note..." },
];

const AVATAR_PALETTE = [
  { bg: "var(--info-light)",    text: "var(--info)"    },
  { bg: "var(--success-light)", text: "var(--success)" },
  { bg: "var(--warning-light)", text: "var(--warning)" },
  { bg: "var(--accent-light)",  text: "var(--accent)"  },
];

// Activity timeline dot colors — intentional per-type semantic colors (hex for non-variable use in inline border)
const ACTIVITY_COLORS: Record<string, string> = {
  call: "#2563EB", note: "#D97706", status: "#7C3AED",
  followup: "#059669", email: "#0891B2", whatsapp: "#059669",
  meeting: "#7C3AED", sms: "#374151",
};

const ACTIVITY_LABELS: Record<string, string> = {
  call: "Call", note: "Note", status: "Status changed",
  followup: "Follow-up set", email: "Email", whatsapp: "WhatsApp",
  meeting: "Meeting", sms: "SMS",
};

const ORDERED_STAGES: LeadStatus[] = ["New","Contacted","Qualified","Proposal Sent","Negotiation","Enrolled"];
type Tab = "log" | "notes" | "activity";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function now() {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2,"0")} · ${d.toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}`;
}

function Divider() {
  return <div style={{ height: 1, background: "var(--surface-3)", margin: "14px 0" }} />;
}

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", margin: "0 0 8px" }}>
      {children}
    </p>
  );
}

// ─── Pipeline strip ──────────────────────────────────────────────
function PipelineStrip({ current }: { current: LeadStatus }) {
  const idx = ORDERED_STAGES.indexOf(current);
  const isTerminal = current === "Lost" || current === "Not Interested";

  if (isTerminal) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "var(--danger-light)", borderRadius: 8, alignSelf: "flex-start" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--danger)", flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--danger)" }}>{current}</span>
      </div>
    );
  }

  const cfg     = STATUS_CONFIG[current] ?? STATUS_CONFIG["New"];
  const progress = idx / (ORDERED_STAGES.length - 1);

  return (
    <div>
      <div style={{ position: "relative", height: 12, marginBottom: 6 }}>
        <div style={{ position: "absolute", top: 5, left: 6, right: 6, height: 2, background: "var(--border)", borderRadius: 99 }} />
        <div style={{ position: "absolute", top: 5, left: 6, width: `calc(${progress * 100}% - 12px * ${progress})`, height: 2, background: "var(--border-strong)", borderRadius: 99, transition: "width .3s" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex" }}>
          {ORDERED_STAGES.map((stage, i) => {
            const done   = i < idx;
            const active = i === idx;
            return (
              <div key={stage} style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <div style={{
                  width: active ? 12 : 7, height: active ? 12 : 7,
                  borderRadius: "50%", marginTop: active ? 0 : 2.5,
                  background: done ? "var(--border-strong)" : active ? cfg.text : "var(--border)",
                  boxShadow: active ? `0 0 0 3px ${cfg.text}25` : "none",
                  flexShrink: 0, zIndex: 1, position: "relative", transition: "all .2s",
                }} />
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex" }}>
        {ORDERED_STAGES.map((stage, i) => {
          const active = i === idx;
          return (
            <div key={stage} style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              {active && (
                <span style={{ fontSize: 9, fontWeight: 800, color: cfg.text, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                  {stage === "Proposal Sent" ? "Proposal" : stage}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────
export default function LeadDetailPanel({
  lead, onClose, onOpenFullPage, avatarIndex = 0,
}: {
  lead: Lead; onClose: () => void; onOpenFullPage: (lead: Lead) => void; avatarIndex?: number;
}) {
  const [tab, setTab] = useState<Tab>("log");

  const [callOutcome, setCallOutcome] = useState<typeof CALL_OUTCOMES[number] | null>(null);
  const [callRemarks, setCallRemarks] = useState("");
  const [callLogged, setCallLogged]   = useState(false);

  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");
  const [followUpSaved, setFollowUpSaved] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>(lead.status);
  const [stageSaved, setStageSaved] = useState(false);

  const [noteText, setNoteText]   = useState(lead.notes ?? "");
  const [noteSaved, setNoteSaved] = useState(false);

  const [selectedActivityType, setSelectedActivityType] = useState(ACTIVITY_TYPES[0]);
  const [activityText, setActivityText] = useState("");
  const [activityLogged, setActivityLogged] = useState(false);

  const [localActivity, setLocalActivity] = useState<ActivityEntry[]>([]);

  const av     = AVATAR_PALETTE[avatarIndex % 4];
  const sc     = STATUS_CONFIG[selectedStatus] ?? STATUS_CONFIG["New"];
  const scorec = SCORE_CONFIG[lead.score] ?? SCORE_CONFIG.Cold;
  const leadScoreColor = (s: number) => s >= 70 ? "var(--success)" : s >= 40 ? "var(--warning)" : "var(--text-muted)";

  const allActivity: ActivityEntry[] = [
    ...localActivity,
    ...lead.activity.map((a, i) => ({
      id: `orig-${i}`, type: a.type as ActivityEntry["type"], text: a.text, time: a.time, by: a.by ?? "System",
    })),
  ];

  function addToTimeline(entry: Omit<ActivityEntry, "id">) {
    setLocalActivity(prev => [{ ...entry, id: String(Date.now()) }, ...prev]);
  }

  const logCall = () => {
    if (!callOutcome) return;
    addToTimeline({ type: "call", text: `${callOutcome.label}${callRemarks ? ` — ${callRemarks}` : ""}`, time: now(), by: "Aanya Sharma" });
    setCallLogged(true);
    setTimeout(() => { setCallLogged(false); setCallOutcome(null); setCallRemarks(""); }, 1800);
  };

  const saveFollowUp = () => {
    if (!followUpDate) return;
    addToTimeline({ type: "followup", text: `Follow-up set for ${followUpDate}${followUpTime ? " at " + followUpTime : ""}${followUpNote ? " — " + followUpNote : ""}`, time: now(), by: "Aanya Sharma" });
    setFollowUpSaved(true);
    setTimeout(() => { setFollowUpSaved(false); setFollowUpDate(""); setFollowUpTime(""); setFollowUpNote(""); }, 1800);
  };

  const saveStage = () => {
    addToTimeline({ type: "status", text: `Status updated → ${selectedStatus}`, time: now(), by: "Aanya Sharma" });
    setStageSaved(true);
    setTimeout(() => setStageSaved(false), 1800);
  };

  const saveNote = () => {
    if (!noteText.trim()) return;
    addToTimeline({ type: "note", text: noteText.trim(), time: now(), by: "Aanya Sharma" });
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1800);
  };

  const logActivity = () => {
    if (!activityText.trim()) return;
    addToTimeline({ type: selectedActivityType.type, text: activityText.trim(), time: now(), by: "Aanya Sharma" });
    setActivityLogged(true);
    setTimeout(() => { setActivityLogged(false); setActivityText(""); }, 1800);
  };

  return (
    <aside style={{ width: 400, flexShrink: 0, borderLeft: "1px solid var(--border)", background: "var(--surface)", display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

      {/* ══ HEADER ══ */}
      <div style={{ padding: "13px 16px", borderBottom: "1px solid var(--surface-3)", flexShrink: 0 }}>

        {/* Action row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <button onClick={onClose}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer", color: "var(--text-secondary)", padding: 0, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, flexShrink: 0, transition: "all .15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}>
            <X size={14} strokeWidth={2} />
          </button>
          <button onClick={() => onOpenFullPage(lead)} title="View Full Profile"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", cursor: "pointer", color: "var(--text-secondary)", padding: 0, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, flexShrink: 0, transition: "all .15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--text-primary)"; (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "var(--text-primary)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}>
            <ChevronRight size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Name row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: av.bg, color: av.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>
            {getInitials(lead.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
              {lead.name}
            </p>
            <div style={{ display: "flex", gap: 5, marginTop: 4, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                {selectedStatus}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: scorec.bg, color: scorec.text, display: "inline-flex", alignItems: "center", gap: 3 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: scorec.dot }} />{lead.score}
              </span>
              {lead.priority === "High" && (
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: "var(--danger-light)", color: "var(--danger)" }}>↑ High</span>
              )}
            </div>
          </div>
        </div>

        {/* Pipeline */}
        <div style={{ marginBottom: 10 }}>
          <PipelineStrip current={selectedStatus} />
        </div>

        {/* Contact grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 10px", marginBottom: 10 }}>
          {[
            { icon: <Phone size={10} />,    value: lead.phone   },
            { icon: <MapPin size={10} />,   value: lead.city    },
            { icon: <BookOpen size={10} />, value: lead.service },
            { icon: <Mail size={10} />,     value: lead.source  },
          ].map((item, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-secondary)", overflow: "hidden" }}>
              <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{item.icon}</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.value}</span>
            </span>
          ))}
        </div>

        {/* Score + follow-up */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {typeof lead.leadScore === "number" && (
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 7, padding: "5px 9px", background: "var(--surface-2)", borderRadius: 7, border: "1px solid var(--border)" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)" }}>Score</span>
              <div style={{ flex: 1, height: 4, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${lead.leadScore}%`, background: leadScoreColor(lead.leadScore), borderRadius: 99 }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: leadScoreColor(lead.leadScore) }}>{lead.leadScore}</span>
            </div>
          )}
          {lead.followUpDate && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 9px", background: "var(--warning-light)", borderRadius: 7, border: "1px solid var(--warning-border)", flexShrink: 0 }}>
              <CalendarDays size={10} style={{ color: "var(--warning)" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--warning)" }}>{lead.followUpDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* ══ TABS ══ */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--surface-3)", background: "var(--surface-2)", flexShrink: 0 }}>
        {([
          { key: "log",      label: "Log Call", icon: <Phone size={12} />      },
          { key: "notes",    label: "Notes",    icon: <StickyNote size={12} /> },
          { key: "activity", label: "Timeline", icon: <Activity size={12} />   },
        ] as { key: Tab; label: string; icon: React.ReactNode }[]).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            padding: "11px 4px", fontSize: 12, fontWeight: tab === t.key ? 700 : 500,
            border: "none", cursor: "pointer", transition: "all .15s",
            borderBottom: tab === t.key ? "2px solid var(--text-primary)" : "2px solid transparent",
            color: tab === t.key ? "var(--text-primary)" : "var(--text-muted)",
            background: "transparent",
          }}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ══ BODY ══ */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>

        {/* ─ LOG CALL ─ */}
        {tab === "log" && (
          <div>
            <SLabel>Update Stage</SLabel>
            <div style={{ position: "relative", marginBottom: 8 }}>
              <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as LeadStatus)}
                style={{ width: "100%", fontSize: 13, padding: "9px 32px 9px 11px", borderRadius: 9, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-primary)", appearance: "none", cursor: "pointer", fontWeight: 500, outline: "none" }}>
                {(["New","Contacted","Qualified","Proposal Sent","Negotiation","Enrolled","Not Interested","Lost"] as LeadStatus[]).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
            </div>
            <button onClick={saveStage} style={{
              width: "100%", padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer",
              background: stageSaved ? "var(--success-light)" : "var(--surface-2)",
              color: stageSaved ? "var(--success)" : "var(--text-secondary)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all .15s",
            }}>
              {stageSaved ? <><CheckCircle2 size={13} />Stage Updated → Timeline</> : <><Zap size={13} />Save Stage</>}
            </button>

            <Divider />

            <SLabel>Call Outcome</SLabel>
            <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
              {CALL_OUTCOMES.map(o => {
                const sel = callOutcome?.result === o.result;
                return (
                  <button key={o.result} onClick={() => setCallOutcome(sel ? null : o)} style={{
                    flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                    padding: "9px 4px", borderRadius: 9, fontSize: 10, fontWeight: 700, cursor: "pointer",
                    background: sel ? o.bg : "var(--surface-2)",
                    color: sel ? o.color : "var(--text-muted)",
                    border: `1.5px solid ${sel ? o.border : "var(--border)"}`,
                    transition: "all .15s",
                  }}>
                    <span style={{ color: sel ? o.color : "var(--text-muted)" }}>{o.icon}</span>
                    {o.label}
                  </button>
                );
              })}
            </div>
            <textarea value={callRemarks} onChange={e => setCallRemarks(e.target.value)}
              placeholder="What was discussed..."
              rows={2} style={taStyle} />
            <button onClick={logCall} disabled={!callOutcome} style={{
              width: "100%", padding: "9px 0", borderRadius: 9, fontSize: 12, fontWeight: 700, border: "none",
              cursor: callOutcome ? "pointer" : "not-allowed",
              background: callLogged ? "var(--success-light)" : callOutcome ? "var(--accent)" : "var(--surface-2)",
              color: callLogged ? "var(--success)" : callOutcome ? "#fff" : "var(--text-muted)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all .15s", marginTop: 8,
            }}>
              {callLogged ? <><CheckCircle2 size={13} />Logged → Timeline</> : <><Phone size={13} />Log Call</>}
            </button>

            <Divider />

            <SLabel>Schedule Follow-up</SLabel>
            <div style={{ display: "flex", gap: 6, marginBottom: 7 }}>
              <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} style={{ flex: 1, ...inputStyle }} />
              <input type="time" value={followUpTime} onChange={e => setFollowUpTime(e.target.value)} style={{ width: 95, ...inputStyle }} />
            </div>
            <textarea value={followUpNote} onChange={e => setFollowUpNote(e.target.value)}
              placeholder="Note for this follow-up..." rows={2} style={{ ...taStyle, marginBottom: 7 }} />
            <button onClick={saveFollowUp} disabled={!followUpDate} style={{
              width: "100%", padding: "9px 0", borderRadius: 9, fontSize: 12, fontWeight: 700, border: "none",
              cursor: followUpDate ? "pointer" : "not-allowed", transition: "all .15s",
              background: followUpSaved ? "var(--success-light)" : followUpDate ? "var(--info-light)" : "var(--surface-2)",
              color: followUpSaved ? "var(--success)" : followUpDate ? "var(--info)" : "var(--text-muted)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            }}>
              {followUpSaved ? <><CheckCircle2 size={13} />Saved → Timeline</> : <><CalendarDays size={13} />Set Follow-up</>}
            </button>
          </div>
        )}

        {/* ─ NOTES ─ */}
        {tab === "notes" && (
          <div>
            <SLabel>Add / Edit Note</SLabel>
            <textarea rows={5} placeholder="Enter a note about this lead..."
              value={noteText} onChange={e => setNoteText(e.target.value)}
              style={{ ...taStyle, marginBottom: 8 }} />
            <button onClick={saveNote} disabled={!noteText.trim()} style={{
              width: "100%", padding: "10px 0", borderRadius: 9, fontSize: 12, fontWeight: 700, border: "none",
              cursor: noteText.trim() ? "pointer" : "not-allowed", transition: "all .15s",
              background: noteSaved ? "var(--success-light)" : noteText.trim() ? "var(--text-primary)" : "var(--surface-2)",
              color: noteSaved ? "var(--success)" : noteText.trim() ? "#fff" : "var(--text-muted)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            }}>
              {noteSaved ? <><CheckCircle2 size={13} />Saved → Timeline</> : <><StickyNote size={13} />Save Note</>}
            </button>

            {lead.counselingNote && (
              <>
                <Divider />
                <SLabel>Counseling Form</SLabel>
                <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                  {[
                    { label: "Program",    value: lead.counselingNote.targetProgram      },
                    { label: "Engagement", value: lead.counselingNote.engagementLevel    },
                    { label: "Budget",     value: lead.counselingNote.budget             },
                    { label: "Experience", value: lead.counselingNote.previousExperience },
                  ].map((row, i, arr) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderBottom: i < arr.length - 1 ? "1px solid var(--surface-3)" : "none" }}>
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{row.label}</span>
                      <span style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 700, textAlign: "right", maxWidth: "58%" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                {lead.counselingNote.painPoints && (
                  <div style={{ marginTop: 8, padding: "9px 12px", background: "var(--warning-light)", border: "1px solid var(--warning-border)", borderRadius: 9 }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: "var(--warning)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>Pain Points</p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>{lead.counselingNote.painPoints}</p>
                  </div>
                )}
              </>
            )}

            {lead.lostReason && (
              <>
                <Divider />
                <SLabel>Lost Reason</SLabel>
                <div style={{ padding: "9px 12px", background: "var(--danger-light)", border: "1px solid var(--danger-border)", borderRadius: 9 }}>
                  <p style={{ fontSize: 12, color: "var(--danger)", lineHeight: 1.5, margin: 0 }}>{lead.lostReason}</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* ─ TIMELINE ─ */}
        {tab === "activity" && (
          <div>
            <SLabel>Log Activity</SLabel>
            <div style={{ display: "flex", gap: 5, marginBottom: 9, flexWrap: "wrap" }}>
              {ACTIVITY_TYPES.map(at => {
                const sel = selectedActivityType.type === at.type;
                return (
                  <button key={at.type} onClick={() => setSelectedActivityType(at)} style={{
                    display: "flex", alignItems: "center", gap: 5, padding: "6px 10px",
                    borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer",
                    background: sel ? at.color + "15" : "var(--surface-2)",
                    color: sel ? at.color : "var(--text-muted)",
                    border: `1.5px solid ${sel ? at.color + "40" : "var(--border)"}`,
                    transition: "all .15s",
                  }}>
                    <span style={{ color: sel ? at.color : "var(--text-muted)" }}>{at.icon}</span>
                    {at.label}
                  </button>
                );
              })}
            </div>
            <textarea value={activityText} onChange={e => setActivityText(e.target.value)}
              placeholder={selectedActivityType.placeholder} rows={3} style={{ ...taStyle, marginBottom: 8 }} />
            <button onClick={logActivity} disabled={!activityText.trim()} style={{
              width: "100%", padding: "9px 0", borderRadius: 9, fontSize: 12, fontWeight: 700, border: "none",
              cursor: activityText.trim() ? "pointer" : "not-allowed", transition: "all .15s",
              background: activityLogged ? "var(--success-light)" : activityText.trim() ? selectedActivityType.color : "var(--surface-2)",
              color: activityLogged ? "var(--success)" : activityText.trim() ? "#fff" : "var(--text-muted)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            }}>
              {activityLogged
                ? <><CheckCircle2 size={13} />Added to Timeline!</>
                : <><Send size={13} />Log {selectedActivityType.label}</>}
            </button>

            <Divider />

            <SLabel>Activity Timeline ({allActivity.length})</SLabel>
            {allActivity.length === 0
              ? <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", padding: "24px 0" }}>No activity yet.</p>
              : (
                <ol style={{ position: "relative", borderLeft: "2px solid var(--surface-3)", marginLeft: 6, padding: 0, listStyle: "none" }}>
                  {allActivity.map(item => {
                    const color = ACTIVITY_COLORS[item.type] ?? "#374151";
                    return (
                      <li key={item.id} style={{ position: "relative", paddingBottom: 18, paddingLeft: 16 }}>
                        <span style={{ position: "absolute", left: -5, top: 5, width: 8, height: 8, borderRadius: "50%", background: color, border: "2px solid var(--surface)" }} />
                        <div style={{ padding: "9px 11px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 9 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                              {ACTIVITY_LABELS[item.type] ?? item.type}
                            </span>
                            <span style={{ fontSize: 9, color: "var(--text-muted)" }}>{item.time}</span>
                          </div>
                          <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.45 }}>{item.text}</p>
                          <p style={{ fontSize: 10, color: "var(--text-muted)", margin: "3px 0 0" }}>by {item.by}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )
            }
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Shared micro-styles ────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  fontSize: 12, padding: "8px 10px", borderRadius: 8,
  border: "1px solid var(--border)", color: "var(--text-primary)", background: "var(--surface)", outline: "none",
  boxSizing: "border-box",
};
const taStyle: React.CSSProperties = {
  width: "100%", fontSize: 12, padding: "8px 10px", borderRadius: 8,
  border: "1px solid var(--border)", resize: "none", color: "var(--text-secondary)",
  background: "var(--surface)", boxSizing: "border-box", lineHeight: 1.5, outline: "none",
};