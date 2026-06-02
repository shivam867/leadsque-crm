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
  { label: "Connected",  icon: <PhoneCall size={12} />,   result: "Connected"     as const, color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
  { label: "No Answer",  icon: <PhoneMissed size={12} />, result: "Not Connected" as const, color: "#374151", bg: "#F3F4F6", border: "#D1D5DB" },
  { label: "Busy",       icon: <Clock size={12} />,       result: "Busy"          as const, color: "#B45309", bg: "#FFFBEB", border: "#FDE68A" },
  { label: "Wrong #",    icon: <Ban size={12} />,         result: "Wrong Number"  as const, color: "#BE123C", bg: "#FEF2F2", border: "#FECACA" },
] as const;

const ACTIVITY_TYPES = [
  { type: "whatsapp" as const, label: "WhatsApp",  icon: <MessageCircle size={13} />, color: "#059669", placeholder: "Message sent..." },
  { type: "email"    as const, label: "Email",     icon: <AtSign size={13} />,        color: "#0891B2", placeholder: "Email content..." },
  { type: "meeting"  as const, label: "Meeting",   icon: <Users size={13} />,         color: "#7C3AED", placeholder: "Meeting notes..." },
  { type: "sms"      as const, label: "SMS",       icon: <MessageSquare size={13} />, color: "#374151", placeholder: "SMS sent..." },
  { type: "note"     as const, label: "Note",      icon: <Edit3 size={13} />,         color: "#D97706", placeholder: "Add a note..." },
];

const AVATAR_PALETTE = [
  { bg: "#DBEAFE", text: "#1D4ED8" },
  { bg: "#DCFCE7", text: "#15803D" },
  { bg: "#FED7AA", text: "#C2410C" },
  { bg: "#E9D5FF", text: "#7E22CE" },
];

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

// ─── Divider ────────────────────────────────────────────────────
function Divider() {
  return <div style={{ height: 1, background: "#F0F0F0", margin: "14px 0" }} />;
}

// ─── Section label ──────────────────────────────────────────────
function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "#9CA3AF", margin: "0 0 8px" }}>
      {children}
    </p>
  );
}

// ─── Pipeline — only shows current stage name, dot row still useful for position ──
function PipelineStrip({ current }: { current: LeadStatus }) {
  const idx = ORDERED_STAGES.indexOf(current);
  const isTerminal = current === "Lost" || current === "Not Interested";

  if (isTerminal) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "#FEF2F2", borderRadius: 8, alignSelf: "flex-start" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#EF4444", flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "#BE123C" }}>{current}</span>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[current] ?? STATUS_CONFIG["New"];
  const progress = idx / (ORDERED_STAGES.length - 1); // 0–1

  return (
    <div>
      {/* Track + dots */}
      <div style={{ position: "relative", height: 12, marginBottom: 6 }}>
        {/* Background track */}
        <div style={{ position: "absolute", top: 5, left: 6, right: 6, height: 2, background: "#E5E7EB", borderRadius: 99 }} />
        {/* Filled track */}
        <div style={{
          position: "absolute", top: 5, left: 6,
          width: `calc(${progress * 100}% - 12px * ${progress})`,
          height: 2, background: "#CBD5E1", borderRadius: 99, transition: "width .3s",
        }} />
        {/* Dots */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex" }}>
          {ORDERED_STAGES.map((stage, i) => {
            const done   = i < idx;
            const active = i === idx;
            return (
              <div key={stage} style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <div style={{
                  width: active ? 12 : 7, height: active ? 12 : 7,
                  borderRadius: "50%", marginTop: active ? 0 : 2.5,
                  background: done ? "#94A3B8" : active ? cfg.text : "#E2E8F0",
                  boxShadow: active ? `0 0 0 3px ${cfg.text}25` : "none",
                  flexShrink: 0, zIndex: 1, position: "relative",
                  transition: "all .2s",
                }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Only show current stage label — centered under its dot */}
      <div style={{ display: "flex" }}>
        {ORDERED_STAGES.map((stage, i) => {
          const active = i === idx;
          return (
            <div key={stage} style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              {active && (
                <span style={{
                  fontSize: 9, fontWeight: 800, color: cfg.text,
                  textTransform: "uppercase", letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                }}>
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

// ─── Main component ──────────────────────────────────────────────
export default function LeadDetailPanel({
  lead, onClose, onOpenFullPage, avatarIndex = 0,
}: {
  lead: Lead; onClose: () => void; onOpenFullPage: (lead: Lead) => void; avatarIndex?: number;
}) {
  const [tab, setTab] = useState<Tab>("log");

  // Log call state
  const [callOutcome, setCallOutcome] = useState<typeof CALL_OUTCOMES[number] | null>(null);
  const [callRemarks, setCallRemarks] = useState("");
  const [callLogged, setCallLogged]   = useState(false);

  // Follow-up state
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");
  const [followUpSaved, setFollowUpSaved] = useState(false);

  // Stage state
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>(lead.status);
  const [stageSaved, setStageSaved] = useState(false);

  // Notes tab
  const [noteText, setNoteText]   = useState(lead.notes ?? "");
  const [noteSaved, setNoteSaved] = useState(false);

  // Activity log tab
  const [selectedActivityType, setSelectedActivityType] = useState(ACTIVITY_TYPES[0]);
  const [activityText, setActivityText] = useState("");
  const [activityLogged, setActivityLogged] = useState(false);

  // Local activity feed (prepended to lead.activity for display)
  const [localActivity, setLocalActivity] = useState<ActivityEntry[]>([]);

  const av     = AVATAR_PALETTE[avatarIndex % 4];
  const sc     = STATUS_CONFIG[selectedStatus] ?? STATUS_CONFIG["New"];
  const scorec = SCORE_CONFIG[lead.score] ?? SCORE_CONFIG.Cold;

  // All activity = local (newest) + original
  const allActivity: ActivityEntry[] = [
    ...localActivity,
    ...lead.activity.map((a, i) => ({
      id: `orig-${i}`,
      type: a.type as ActivityEntry["type"],
      text: a.text,
      time: a.time,
      by: a.by ?? "System",
    })),
  ];

  function addToTimeline(entry: Omit<ActivityEntry, "id">) {
    setLocalActivity(prev => [{ ...entry, id: String(Date.now()) }, ...prev]);
  }

  const logCall = () => {
    if (!callOutcome) return;
    addToTimeline({
      type: "call",
      text: `${callOutcome.label}${callRemarks ? ` — ${callRemarks}` : ""}`,
      time: now(),
      by: "Aanya Sharma",
    });
    setCallLogged(true);
    setTimeout(() => { setCallLogged(false); setCallOutcome(null); setCallRemarks(""); }, 1800);
  };

  const saveFollowUp = () => {
    if (!followUpDate) return;
    addToTimeline({
      type: "followup",
      text: `Follow-up set for ${followUpDate}${followUpTime ? " at " + followUpTime : ""}${followUpNote ? " — " + followUpNote : ""}`,
      time: now(),
      by: "Aanya Sharma",
    });
    setFollowUpSaved(true);
    setTimeout(() => { setFollowUpSaved(false); setFollowUpDate(""); setFollowUpTime(""); setFollowUpNote(""); }, 1800);
  };

  const saveStage = () => {
    addToTimeline({
      type: "status",
      text: `Status updated → ${selectedStatus}`,
      time: now(),
      by: "Aanya Sharma",
    });
    setStageSaved(true);
    setTimeout(() => setStageSaved(false), 1800);
  };

  const saveNote = () => {
    if (!noteText.trim()) return;
    addToTimeline({
      type: "note",
      text: noteText.trim(),
      time: now(),
      by: "Aanya Sharma",
    });
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1800);
  };

  const logActivity = () => {
    if (!activityText.trim()) return;
    addToTimeline({
      type: selectedActivityType.type,
      text: activityText.trim(),
      time: now(),
      by: "Aanya Sharma",
    });
    setActivityLogged(true);
    setTimeout(() => { setActivityLogged(false); setActivityText(""); }, 1800);
  };

  return (
    <aside style={{
      width: 400, flexShrink: 0,
      borderLeft: "1px solid #E5E7EB",
      background: "#fff",
      display: "flex", flexDirection: "column",
      height: "100%", overflow: "hidden",
    }}>

      {/* ══════════ HEADER ══════════ */}
      <div style={{ padding: "15px 16px 13px", borderBottom: "1px solid #F0F0F0", flexShrink: 0 }}>

        {/* Name row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: av.bg, color: av.text,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 800,
          }}>
            {getInitials(lead.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: "#111827", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>
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
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: "#FFF1F2", color: "#BE123C" }}>↑ High</span>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#C4C4C4", padding: 4, borderRadius: 6, display: "flex", flexShrink: 0 }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#374151"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#C4C4C4"}>
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Pipeline strip — only current label shows */}
        <div style={{ marginBottom: 10 }}>
          <PipelineStrip current={selectedStatus} />
        </div>

        {/* Contact grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 10px", marginBottom: 10 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#374151", overflow: "hidden" }}>
            <Phone size={10} style={{ color: "#9CA3AF", flexShrink: 0 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.phone}</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#374151" }}>
            <MapPin size={10} style={{ color: "#9CA3AF", flexShrink: 0 }} />{lead.city}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#374151", overflow: "hidden" }}>
            <BookOpen size={10} style={{ color: "#9CA3AF", flexShrink: 0 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.service}</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#6B7280" }}>
            <Mail size={10} style={{ color: "#9CA3AF", flexShrink: 0 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.source}</span>
          </span>
        </div>

        {/* Score + follow-up row */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 11 }}>
          {typeof lead.leadScore === "number" && (
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 7, padding: "5px 9px", background: "#F9FAFB", borderRadius: 7, border: "1px solid #F0F0F0" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF" }}>Score</span>
              <div style={{ flex: 1, height: 4, background: "#E5E7EB", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${lead.leadScore}%`, background: lead.leadScore >= 70 ? "#059669" : lead.leadScore >= 40 ? "#D97706" : "#9CA3AF", borderRadius: 99 }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: lead.leadScore >= 70 ? "#059669" : lead.leadScore >= 40 ? "#D97706" : "#374151" }}>
                {lead.leadScore}
              </span>
            </div>
          )}
          {lead.followUpDate && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 9px", background: "#FFFBEB", borderRadius: 7, border: "1px solid #FDE68A", flexShrink: 0 }}>
              <CalendarDays size={10} style={{ color: "#B45309" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#B45309" }}>{lead.followUpDate}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <button onClick={() => onOpenFullPage(lead)} style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          padding: "9px 0", borderRadius: 9, fontSize: 12, fontWeight: 700,
          background: "#111827", color: "#fff", border: "none", cursor: "pointer", transition: "background .15s",
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#1F2937"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#111827"}>
          View Full Profile <ChevronRight size={13} strokeWidth={2.5} />
        </button>
      </div>

      {/* ══════════ TABS ══════════ */}
      <div style={{ display: "flex", borderBottom: "1px solid #F0F0F0", background: "#FAFAFA", flexShrink: 0 }}>
        {([
          { key: "log",      label: "Log Call",   icon: <Phone size={12} />      },
          { key: "notes",    label: "Notes",      icon: <StickyNote size={12} /> },
          { key: "activity", label: "Timeline",   icon: <Activity size={12} />   },
        ] as { key: Tab; label: string; icon: React.ReactNode }[]).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            padding: "11px 4px", fontSize: 12, fontWeight: tab === t.key ? 700 : 500,
            border: "none", cursor: "pointer", transition: "all .15s",
            borderBottom: tab === t.key ? "2px solid #111827" : "2px solid transparent",
            color: tab === t.key ? "#111827" : "#9CA3AF",
            background: "transparent",
          }}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ══════════ BODY ══════════ */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>

        {/* ─────── LOG CALL ─────── */}
        {tab === "log" && (
          <div>
            {/* 1. Update stage */}
            <SLabel>Update Stage</SLabel>
            <div style={{ position: "relative", marginBottom: 8 }}>
              <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as LeadStatus)}
                style={{ width: "100%", fontSize: 13, padding: "9px 32px 9px 11px", borderRadius: 9, border: "1px solid #E5E7EB", background: "#fff", color: "#111827", appearance: "none", cursor: "pointer", fontWeight: 500 }}>
                {(["New","Contacted","Qualified","Proposal Sent","Negotiation","Enrolled","Not Interested","Lost"] as LeadStatus[]).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
            </div>
            <button onClick={saveStage} style={{
              width: "100%", padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer",
              background: stageSaved ? "#ECFDF5" : "#F3F4F6",
              color: stageSaved ? "#059669" : "#374151",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all .15s",
            }}>
              {stageSaved ? <><CheckCircle2 size={13} />Stage Updated → Timeline</> : <><Zap size={13} />Save Stage</>}
            </button>

            <Divider />

            {/* 2. Call outcome — single row, icon + label stacked */}
            <SLabel>Call Outcome</SLabel>
            <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
              {CALL_OUTCOMES.map(o => {
                const sel = callOutcome?.result === o.result;
                return (
                  <button key={o.result} onClick={() => setCallOutcome(sel ? null : o)} style={{
                    flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                    padding: "9px 4px", borderRadius: 9, fontSize: 10, fontWeight: 700, cursor: "pointer",
                    background: sel ? o.bg : "#F9FAFB",
                    color: sel ? o.color : "#6B7280",
                    border: `1.5px solid ${sel ? o.border : "#E5E7EB"}`,
                    transition: "all .15s",
                  }}>
                    <span style={{ color: sel ? o.color : "#9CA3AF" }}>{o.icon}</span>
                    {o.label}
                  </button>
                );
              })}
            </div>
            <textarea value={callRemarks} onChange={e => setCallRemarks(e.target.value)}
              placeholder="What was discussed..." rows={2}
              style={taStyle} />
            <button onClick={logCall} disabled={!callOutcome} style={{
              width: "100%", padding: "9px 0", borderRadius: 9, fontSize: 12, fontWeight: 700,
              border: "none", cursor: callOutcome ? "pointer" : "not-allowed",
              background: callLogged ? "#ECFDF5" : callOutcome ? "#2563EB" : "#F3F4F6",
              color: callLogged ? "#059669" : callOutcome ? "#fff" : "#9CA3AF",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all .15s",
              marginTop: 8,
            }}>
              {callLogged ? <><CheckCircle2 size={13} />Logged → Timeline</> : <><Phone size={13} />Log Call</>}
            </button>

            <Divider />

            {/* 3. Schedule follow-up */}
            <SLabel>Schedule Follow-up</SLabel>
            <div style={{ display: "flex", gap: 6, marginBottom: 7 }}>
              <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)}
                style={{ flex: 1, ...inputStyle }} />
              <input type="time" value={followUpTime} onChange={e => setFollowUpTime(e.target.value)}
                style={{ width: 95, ...inputStyle }} />
            </div>
            <textarea value={followUpNote} onChange={e => setFollowUpNote(e.target.value)}
              placeholder="Note for this follow-up..." rows={2}
              style={{ ...taStyle, marginBottom: 7 }} />
            <button onClick={saveFollowUp} disabled={!followUpDate} style={{
              width: "100%", padding: "9px 0", borderRadius: 9, fontSize: 12, fontWeight: 700, border: "none",
              cursor: followUpDate ? "pointer" : "not-allowed", transition: "all .15s",
              background: followUpSaved ? "#ECFDF5" : followUpDate ? "#F0F9FF" : "#F9FAFB",
              color: followUpSaved ? "#059669" : followUpDate ? "#0369A1" : "#9CA3AF",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            }}>
              {followUpSaved ? <><CheckCircle2 size={13} />Saved → Timeline</> : <><CalendarDays size={13} />Set Follow-up</>}
            </button>
          </div>
        )}

        {/* ─────── NOTES ─────── */}
        {tab === "notes" && (
          <div>
            <SLabel>Add / Edit Note</SLabel>
            <textarea rows={5} placeholder="Enter a note about this lead..."
              value={noteText} onChange={e => setNoteText(e.target.value)}
              style={{ ...taStyle, marginBottom: 8 }} />
            <button onClick={saveNote} disabled={!noteText.trim()} style={{
              width: "100%", padding: "10px 0", borderRadius: 9, fontSize: 12, fontWeight: 700, border: "none",
              cursor: noteText.trim() ? "pointer" : "not-allowed", transition: "all .15s",
              background: noteSaved ? "#ECFDF5" : noteText.trim() ? "#111827" : "#F3F4F6",
              color: noteSaved ? "#059669" : noteText.trim() ? "#fff" : "#9CA3AF",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            }}>
              {noteSaved ? <><CheckCircle2 size={13} />Saved → Timeline</> : <><StickyNote size={13} />Save Note</>}
            </button>

            {/* Counseling snapshot */}
            {lead.counselingNote && (
              <>
                <Divider />
                <SLabel>Counseling Form</SLabel>
                <div style={{ background: "#F9FAFB", border: "1px solid #F0F0F0", borderRadius: 10, overflow: "hidden" }}>
                  {[
                    { label: "Program",    value: lead.counselingNote.targetProgram      },
                    { label: "Engagement", value: lead.counselingNote.engagementLevel    },
                    { label: "Budget",     value: lead.counselingNote.budget             },
                    { label: "Experience", value: lead.counselingNote.previousExperience },
                  ].map((row, i, arr) => (
                    <div key={row.label} style={{
                      display: "flex", justifyContent: "space-between", padding: "8px 12px",
                      borderBottom: i < arr.length - 1 ? "1px solid #F0F0F0" : "none",
                    }}>
                      <span style={{ fontSize: 12, color: "#6B7280" }}>{row.label}</span>
                      <span style={{ fontSize: 12, color: "#111827", fontWeight: 700, textAlign: "right", maxWidth: "58%" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                {lead.counselingNote.painPoints && (
                  <div style={{ marginTop: 8, padding: "9px 12px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 9 }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: "#B45309", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>Pain Points</p>
                    <p style={{ fontSize: 12, color: "#78350F", margin: 0, lineHeight: 1.5 }}>{lead.counselingNote.painPoints}</p>
                  </div>
                )}
              </>
            )}

            {lead.parentName && (
              <>
                <Divider />
                <SLabel>Sponsor / Parent</SLabel>
                <div style={{ padding: "9px 12px", background: "#F9FAFB", border: "1px solid #F0F0F0", borderRadius: 9 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>{lead.parentName}</p>
                  {lead.parentPhone && <p style={{ fontSize: 12, color: "#374151", margin: 0, fontFamily: "monospace" }}>{lead.parentPhone}</p>}
                </div>
              </>
            )}

            {lead.lostReason && (
              <>
                <Divider />
                <SLabel>Lost Reason</SLabel>
                <div style={{ padding: "9px 12px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 9 }}>
                  <p style={{ fontSize: 12, color: "#7F1D1D", lineHeight: 1.5, margin: 0 }}>{lead.lostReason}</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* ─────── TIMELINE ─────── */}
        {tab === "activity" && (
          <div>
            {/* Log any activity */}
            <SLabel>Log Activity</SLabel>

            {/* Activity type selector */}
            <div style={{ display: "flex", gap: 5, marginBottom: 9, flexWrap: "wrap" }}>
              {ACTIVITY_TYPES.map(at => {
                const sel = selectedActivityType.type === at.type;
                return (
                  <button key={at.type} onClick={() => setSelectedActivityType(at)} style={{
                    display: "flex", alignItems: "center", gap: 5, padding: "6px 10px",
                    borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer",
                    background: sel ? at.color + "15" : "#F9FAFB",
                    color: sel ? at.color : "#6B7280",
                    border: `1.5px solid ${sel ? at.color + "40" : "#E5E7EB"}`,
                    transition: "all .15s",
                  }}>
                    <span style={{ color: sel ? at.color : "#9CA3AF" }}>{at.icon}</span>
                    {at.label}
                  </button>
                );
              })}
            </div>

            <textarea
              value={activityText}
              onChange={e => setActivityText(e.target.value)}
              placeholder={selectedActivityType.placeholder}
              rows={3}
              style={{ ...taStyle, marginBottom: 8 }}
            />

            <button onClick={logActivity} disabled={!activityText.trim()} style={{
              width: "100%", padding: "9px 0", borderRadius: 9, fontSize: 12, fontWeight: 700, border: "none",
              cursor: activityText.trim() ? "pointer" : "not-allowed", transition: "all .15s",
              background: activityLogged ? "#ECFDF5" : activityText.trim() ? selectedActivityType.color : "#F3F4F6",
              color: activityLogged ? "#059669" : activityText.trim() ? "#fff" : "#9CA3AF",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            }}>
              {activityLogged
                ? <><CheckCircle2 size={13} />Added to Timeline!</>
                : <><Send size={13} />Log {selectedActivityType.label}</>}
            </button>

            <Divider />

            {/* Timeline feed */}
            <SLabel>Activity Timeline ({allActivity.length})</SLabel>
            {allActivity.length === 0
              ? <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", padding: "24px 0" }}>No activity yet.</p>
              : (
                <ol style={{ position: "relative", borderLeft: "2px solid #F0F0F0", marginLeft: 6, padding: 0, listStyle: "none" }}>
                  {allActivity.map((item, i) => {
                    const color = ACTIVITY_COLORS[item.type] ?? "#374151";
                    const isNew = item.id.startsWith(String(Math.floor(Date.now() / 1000)));
                    return (
                      <li key={item.id} style={{ position: "relative", paddingBottom: 18, paddingLeft: 16 }}>
                        <span style={{ position: "absolute", left: -5, top: 5, width: 8, height: 8, borderRadius: "50%", background: color, border: "2px solid #fff" }} />
                        <div style={{ padding: "9px 11px", background: "#F9FAFB", border: "1px solid #F0F0F0", borderRadius: 9 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                              {ACTIVITY_LABELS[item.type] ?? item.type}
                            </span>
                            <span style={{ fontSize: 9, color: "#9CA3AF" }}>{item.time}</span>
                          </div>
                          <p style={{ fontSize: 12, color: "#374151", margin: 0, lineHeight: 1.45 }}>{item.text}</p>
                          <p style={{ fontSize: 10, color: "#9CA3AF", margin: "3px 0 0" }}>by {item.by}</p>
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
  border: "1px solid #E5E7EB", color: "#111827", background: "#fff", outline: "none",
  boxSizing: "border-box",
};
const taStyle: React.CSSProperties = {
  width: "100%", fontSize: 12, padding: "8px 10px", borderRadius: 8,
  border: "1px solid #E5E7EB", resize: "none", color: "#374151",
  background: "#fff", boxSizing: "border-box", lineHeight: 1.5, outline: "none",
};