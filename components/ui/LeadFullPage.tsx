"use client";
import { useState } from "react";
import type { Lead, LeadStatus } from "@/data/dummy";
import { STATUS_CONFIG, SCORE_CONFIG, LOST_REASONS, COURSE_OPTIONS } from "@/data/dummy";
import {
  ArrowLeft, Phone, Mail, MapPin, Check, Activity, Copy,
  Clock, ChevronDown, ChevronUp, PhoneCall, StickyNote,
  CalendarDays, UserCheck, PhoneMissed, Ban, Tag,
  CheckCircle2, MessageSquare, Zap, User, Layers,
  AlertTriangle, Send, TrendingUp,
} from "lucide-react";

const AVATAR_PALETTE = [
  { bg: "#DBEAFE", text: "#1D4ED8", ring: "#BFDBFE" },
  { bg: "#DCFCE7", text: "#15803D", ring: "#BBF7D0" },
  { bg: "#FED7AA", text: "#C2410C", ring: "#FED7AA" },
  { bg: "#E9D5FF", text: "#7E22CE", ring: "#DDD6FE" },
];

const ACTIVITY_COLORS: Record<string, string> = {
  call: "#2563EB", note: "#D97706", status: "#7C3AED",
  followup: "#059669", email: "#0891B2", whatsapp: "#25D366", meeting: "#374151",
};
const ACTIVITY_LABELS: Record<string, string> = {
  call: "Call", note: "Note", status: "Status change",
  followup: "Follow-up set", email: "Email", whatsapp: "WhatsApp", meeting: "Meeting",
};

const ORDERED_STAGES: LeadStatus[] = ["New", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Enrolled"];

const ESCALATION_REASONS = [
  "Needs discount approval",
  "Requesting refund or exception",
  "Budget negotiation required",
  "High-value lead — needs senior attention",
  "Repeated no-shows — needs intervention",
  "Complaint or grievance",
  "Other",
];

type Tab = "overview" | "calls" | "activity" | "escalate";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

// ─── Full pipeline stepper — wider, labels always visible ───────
function PipelineStepper({ current }: { current: LeadStatus }) {
  const currentIdx = ORDERED_STAGES.indexOf(current);
  const isTerminal = current === "Lost" || current === "Not Interested";

  if (isTerminal) {
    return (
      <div style={{ padding: "12px 24px 16px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 99 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#B91C1C" }}>Lead {current}</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px 32px 20px", background: "#fff" }}>
      <div style={{ position: "relative" }}>
        {/* Track background */}
        <div style={{ position: "absolute", top: 16, left: 16, right: 16, height: 3, background: "#E5E7EB", borderRadius: 99 }} />
        {/* Track fill */}
        {currentIdx > 0 && (
          <div style={{
            position: "absolute", top: 16, left: 16,
            width: `calc(${(currentIdx / (ORDERED_STAGES.length - 1)) * 100}% - 32px * ${currentIdx / (ORDERED_STAGES.length - 1)})`,
            height: 3, background: "linear-gradient(90deg, #2563EB, #3B82F6)", borderRadius: 99,
          }} />
        )}

        {/* Dots + labels */}
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
          {ORDERED_STAGES.map((stage, i) => {
            const done   = i < currentIdx;
            const active = i === currentIdx;
            const future = i > currentIdx;
            const cfg    = STATUS_CONFIG[stage];

            return (
              <div key={stage} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                {/* Circle */}
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: done ? "#2563EB" : active ? "#fff" : "#fff",
                  border: done ? "none" : active ? `3px solid ${cfg.text}` : "2.5px solid #E5E7EB",
                  boxShadow: active ? `0 0 0 5px ${cfg.text}18, 0 2px 8px ${cfg.text}20` : done ? "0 2px 6px rgba(37,99,235,0.25)" : "none",
                  transition: "all .25s",
                  zIndex: 1, position: "relative",
                }}>
                  {done
                    ? <Check size={14} style={{ color: "#fff" }} strokeWidth={3} />
                    : active
                    ? <div style={{ width: 10, height: 10, borderRadius: "50%", background: cfg.text }} />
                    : <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#D1D5DB" }} />
                  }
                </div>

                {/* Label */}
                <div style={{ textAlign: "center" }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: active ? 800 : done ? 600 : 400,
                    color: active ? cfg.text : done ? "#374151" : "#9CA3AF",
                    display: "block", whiteSpace: "nowrap",
                    lineHeight: 1.3,
                  }}>
                    {stage}
                  </span>
                  {active && (
                    <span style={{ fontSize: 9, color: cfg.text, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.8 }}>
                      Current
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, icon, children, accent }: {
  title: string; icon?: React.ReactNode; children: React.ReactNode; accent?: string;
}) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "11px 16px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 7 }}>
        {icon && <span style={{ color: accent ?? "#9CA3AF" }}>{icon}</span>}
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "#4B5563" }}>{title}</span>
      </div>
      <div style={{ padding: "12px 16px" }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value, mono, last }: { label: string; value: string; mono?: boolean; last?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: last ? "none" : "1px solid #F9FAFB" }}>
      <span style={{ fontSize: 13, color: "#4B5563" }}>{label}</span>
      <span style={{ fontSize: 13, color: "#111827", fontFamily: mono ? "monospace" : undefined, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default function LeadFullPage({ lead, onBack, avatarIndex = 0 }: {
  lead: Lead; onBack: () => void; avatarIndex?: number;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [noteSaved, setNoteSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>(lead.status);
  const [selectedLostReason, setSelectedLostReason] = useState(lead.lostReason ?? "");
  const [statusSaved, setStatusSaved] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [noteAdded, setNoteAdded] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>(lead.courseInterests ?? []);
  const [escalationReason, setEscalationReason] = useState("");
  const [escalationNote, setEscalationNote] = useState("");
  const [escalationPriority, setEscalationPriority] = useState("Normal");
  const [escalationSent, setEscalationSent] = useState(false);

  const palette  = AVATAR_PALETTE[avatarIndex % 4];
  const sc       = STATUS_CONFIG[selectedStatus] ?? STATUS_CONFIG["New"];
  const scorec   = SCORE_CONFIG[lead.score] ?? SCORE_CONFIG.Cold;
  const displayedActivity = showAllActivity ? lead.activity : lead.activity.slice(0, 6);
  const connectedCalls = lead.callLogs.filter(c => c.result === "Connected").length;
  const totalCalls = lead.callLogs.length;

  const saveNote    = () => { lead.notes = notes; setNoteSaved(true); setTimeout(() => setNoteSaved(false), 1800); };
  const addNote     = () => { if (!noteInput.trim()) return; setNoteAdded(true); setTimeout(() => { setNoteAdded(false); setNoteInput(""); }, 1800); };
  const copyPhone   = () => { navigator.clipboard.writeText(lead.phone); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const updateStatus = () => { setStatusSaved(true); setTimeout(() => setStatusSaved(false), 1800); };
  const sendEscalation = () => { if (!escalationReason) return; setEscalationSent(true); setTimeout(() => { setEscalationSent(false); setEscalationReason(""); setEscalationNote(""); }, 2200); };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F7", display: "flex", flexDirection: "column" }}>

      {/* ── Nav bar ── */}
      <div style={{
        height: 54, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", borderBottom: "1px solid #E5E7EB", background: "#fff",
        position: "sticky", top: 0, zIndex: 10, flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600,
          color: "#374151", background: "transparent", border: "1px solid #E5E7EB",
          cursor: "pointer", padding: "6px 14px", borderRadius: 8, transition: "all .15s",
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#F9FAFB"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
          <ArrowLeft size={14} strokeWidth={2.5} /> Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, fontFamily: "monospace", color: "#9CA3AF" }}>{lead.id}</span>
          <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 99, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
            {selectedStatus}
          </span>
          <a href={`tel:${lead.phone}`}>
            <button style={{
              display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700,
              padding: "7px 18px", borderRadius: 9, background: "#111827", color: "#fff", border: "none", cursor: "pointer",
            }}>
              <Phone size={13} /> Call Now
            </button>
          </a>
        </div>
      </div>

      {/* ── Hero block ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
        {/* Identity strip */}
        <div style={{ padding: "20px 28px 16px", display: "flex", alignItems: "flex-start", gap: 18 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18, flexShrink: 0,
            background: palette.bg, color: palette.text,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em",
            boxShadow: `0 0 0 4px ${palette.ring}`,
          }}>
            {getInitials(lead.name)}
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 6px", letterSpacing: "-0.03em" }}>{lead.name}</h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
              <button onClick={copyPhone} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#374151", background: "transparent", border: "none", cursor: "pointer", padding: 0, fontFamily: "monospace" }}>
                <Phone size={13} style={{ color: "#9CA3AF" }} />{lead.phone}
                {copied ? <Check size={11} style={{ color: "#059669" }} /> : <Copy size={11} style={{ color: "#C4C4C4" }} />}
              </button>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#374151" }}>
                <Mail size={13} style={{ color: "#9CA3AF" }} />{lead.email}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#374151" }}>
                <MapPin size={13} style={{ color: "#9CA3AF" }} />{lead.city}
              </span>
            </div>
          </div>

          {/* Score + badge cluster */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 99, background: scorec.bg, color: scorec.text }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: scorec.dot }} />{lead.score}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 99, background: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB" }}>
                {lead.service}
              </span>
            </div>
            {typeof lead.leadScore === "number" && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F9FAFB", padding: "7px 14px", borderRadius: 99, border: "1px solid #E5E7EB" }}>
                <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>Lead Score</span>
                <div style={{ width: 90, height: 5, background: "#E5E7EB", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${lead.leadScore}%`, borderRadius: 99, background: lead.leadScore >= 70 ? "#059669" : lead.leadScore >= 40 ? "#D97706" : "#9CA3AF" }} />
                </div>
                <span style={{ fontSize: 16, fontWeight: 900, color: lead.leadScore >= 70 ? "#059669" : lead.leadScore >= 40 ? "#D97706" : "#6B7280", minWidth: 28, textAlign: "right" }}>{lead.leadScore}</span>
              </div>
            )}
          </div>
        </div>

        {/* Pipeline stepper — full width, no truncation */}
        <PipelineStepper current={selectedStatus} />
      </div>

      {/* ── Tab bar ── */}
      <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 28px" }}>
        {([
          { key: "overview",  label: "Overview",    icon: <Layers size={14} />        },
          { key: "calls",     label: "Call Logs",   icon: <PhoneCall size={14} />     },
          { key: "activity",  label: "Activity",    icon: <Activity size={14} />      },
          { key: "escalate",  label: "Escalate",    icon: <AlertTriangle size={14} /> },
        ] as { key: Tab; label: string; icon: React.ReactNode }[]).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "13px 18px",
            fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
            borderBottom: tab === t.key ? "2.5px solid #111827" : "2.5px solid transparent",
            color: tab === t.key ? "#111827" : "#9CA3AF",
            background: "transparent", transition: "all .15s",
          }}>
            {t.icon}{t.label}
            {t.key === "escalate" && (
              <span style={{ fontSize: 9, fontWeight: 800, padding: "1px 6px", borderRadius: 99, background: "#FEF2F2", color: "#B91C1C", marginLeft: 2 }}>!</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

        {/* ════════ OVERVIEW ════════ */}
        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, maxWidth: 1140 }}>

            {/* ── Left column ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Lead info */}
              <SectionCard title="Lead Information" icon={<User size={13} />}>
                <InfoRow label="Lead ID"     value={lead.id}         mono />
                <InfoRow label="Source"      value={lead.source}          />
                <InfoRow label="City"        value={lead.city}            />
                <InfoRow label="Assigned To" value={lead.assignedTo}      />
                <InfoRow label="Created"     value={lead.createdAt}  mono />
                {lead.followUpDate && <InfoRow label="Next Follow-up" value={lead.followUpDate} mono />}
                <InfoRow label="Priority"    value={lead.priority}   last />
              </SectionCard>

              {/* Qualification */}
              <SectionCard title="Lead Qualification" icon={<TrendingUp size={13} />} accent="#2563EB">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                  {[
                    { label: "Intake Timeline", value: lead.intakeTimeline ?? "—" },
                    { label: "Education",        value: lead.education ?? "—"       },
                    { label: "Engagement Level", value: lead.engagementLevel ?? "—" },
                    { label: "Budget Readiness", value: lead.budgetReadiness ?? "—" },
                  ].map(row => (
                    <div key={row.label} style={{ padding: "11px 13px", background: "#F9FAFB", borderRadius: 10, border: "1px solid #F0F0F0" }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>{row.label}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>{row.value}</p>
                    </div>
                  ))}
                </div>
                {typeof lead.leadScore === "number" && (
                  <div style={{ padding: "12px 14px", background: "#F9FAFB", borderRadius: 10, border: "1px solid #F0F0F0", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#4B5563", textTransform: "uppercase", letterSpacing: "0.05em" }}>Lead Score</span>
                    <div style={{ flex: 1, height: 6, background: "#E5E7EB", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${lead.leadScore}%`, background: lead.leadScore >= 70 ? "#059669" : lead.leadScore >= 40 ? "#D97706" : "#9CA3AF", borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 22, fontWeight: 900, color: lead.leadScore >= 70 ? "#059669" : lead.leadScore >= 40 ? "#D97706" : "#6B7280", minWidth: 36, textAlign: "right" }}>{lead.leadScore}</span>
                  </div>
                )}
              </SectionCard>

              {/* Course interests */}
              <SectionCard title="Course Interests" icon={<Tag size={13} />} accent="#7C3AED">
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  {(lead.courseInterests ?? []).length > 0
                    ? (lead.courseInterests ?? []).map(c => (
                        <span key={c} style={{ fontSize: 12, fontWeight: 700, padding: "4px 11px", borderRadius: 8, background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE" }}>{c}</span>
                      ))
                    : <span style={{ fontSize: 13, color: "#9CA3AF" }}>None selected</span>
                  }
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Update interests:</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {COURSE_OPTIONS.map(c => {
                    const sel = selectedCourses.includes(c);
                    return (
                      <button key={c}
                        onClick={() => setSelectedCourses(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                        style={{
                          fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 7, cursor: "pointer",
                          border: `1.5px solid ${sel ? "#7C3AED" : "#E5E7EB"}`,
                          background: sel ? "#FAF5FF" : "#fff", color: sel ? "#7C3AED" : "#374151", transition: "all .15s",
                        }}>
                        {c}
                      </button>
                    );
                  })}
                </div>
              </SectionCard>

              {/* Counseling form */}
              {lead.counselingNote && (
                <SectionCard title="Counseling Form" icon={<UserCheck size={13} />} accent="#059669">
                  {[
                    { label: "Target Program",    value: lead.counselingNote.targetProgram      },
                    { label: "Course Interest",   value: lead.counselingNote.courseInterest     },
                    { label: "Engagement Level",  value: lead.counselingNote.engagementLevel    },
                    { label: "Prev. Experience",  value: lead.counselingNote.previousExperience },
                    { label: "Budget",            value: lead.counselingNote.budget             },
                  ].map((row, i, arr) => <InfoRow key={row.label} label={row.label} value={row.value} last={i === arr.length - 1} />)}
                  {lead.counselingNote.painPoints && (
                    <div style={{ marginTop: 10, padding: "11px 13px", background: "#FFFBEB", borderRadius: 9, border: "1px solid #FDE68A" }}>
                      <p style={{ fontSize: 10, fontWeight: 800, color: "#B45309", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pain Points</p>
                      <p style={{ fontSize: 13, color: "#78350F", margin: 0, lineHeight: 1.55 }}>{lead.counselingNote.painPoints}</p>
                    </div>
                  )}
                  <p style={{ fontSize: 11, color: "#9CA3AF", margin: "8px 0 0", fontFamily: "monospace" }}>By {lead.counselingNote.createdBy} · {lead.counselingNote.createdAt}</p>
                </SectionCard>
              )}

              {/* Sponsor / parent */}
              {lead.parentName && (
                <SectionCard title="Sponsor / Parent" icon={<User size={13} />}>
                  <InfoRow label="Name"  value={lead.parentName} />
                  {lead.parentPhone && <InfoRow label="Phone" value={lead.parentPhone} mono last />}
                </SectionCard>
              )}

              {/* Lost reason */}
              {lead.lostReason && (
                <div style={{ padding: "14px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#B91C1C", margin: "0 0 6px" }}>Lost Reason</p>
                  <p style={{ fontSize: 14, color: "#7F1D1D", lineHeight: 1.5, margin: 0 }}>{lead.lostReason}</p>
                </div>
              )}

              {/* Follow-up schedule */}
              {lead.followUps.length > 0 && (
                <SectionCard title="Follow-up Schedule" icon={<CalendarDays size={13} />} accent="#059669">
                  {lead.followUps.map(fu => (
                    <div key={fu.id} style={{ padding: "10px 0", borderBottom: "1px solid #F9FAFB", display: "flex", gap: 12 }}>
                      <div style={{ width: 9, height: 9, borderRadius: "50%", marginTop: 4, flexShrink: 0, background: fu.status === "Completed" ? "#059669" : fu.status === "Missed" ? "#EF4444" : "#D97706" }} />
                      <div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 2 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{fu.date} · {fu.time}</span>
                          <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 99, background: fu.status === "Completed" ? "#ECFDF5" : fu.status === "Missed" ? "#FEF2F2" : "#FFFBEB", color: fu.status === "Completed" ? "#059669" : fu.status === "Missed" ? "#B91C1C" : "#B45309" }}>{fu.status}</span>
                        </div>
                        {fu.remarks && <p style={{ fontSize: 12, color: "#1F2937", margin: 0 }}>{fu.remarks}</p>}
                      </div>
                    </div>
                  ))}
                </SectionCard>
              )}
            </div>

            {/* ── Right column ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Update status */}
              <SectionCard title="Update Status" icon={<Zap size={13} />} accent="#F59E0B">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ position: "relative" }}>
                    <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as LeadStatus)}
                      style={{ width: "100%", fontSize: 13, padding: "10px 32px 10px 12px", borderRadius: 9, border: "1px solid #E5E7EB", background: "#fff", color: "#111827", appearance: "none", cursor: "pointer" }}>
                      {(["New","Contacted","Qualified","Proposal Sent","Negotiation","Enrolled","Not Interested","Lost"] as LeadStatus[]).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
                  </div>
                  {(selectedStatus === "Lost" || selectedStatus === "Not Interested") && (
                    <div style={{ position: "relative" }}>
                      <select value={selectedLostReason} onChange={e => setSelectedLostReason(e.target.value)}
                        style={{ width: "100%", fontSize: 13, padding: "10px 32px 10px 12px", borderRadius: 9, border: "1px solid #FECACA", background: "#FEF2F2", color: "#B91C1C", appearance: "none", cursor: "pointer" }}>
                        <option value="">Select lost reason...</option>
                        {LOST_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#B91C1C", pointerEvents: "none" }} />
                    </div>
                  )}
                  <button onClick={updateStatus} style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", borderRadius: 9, fontSize: 13, fontWeight: 700,
                    background: statusSaved ? "#ECFDF5" : "#111827", color: statusSaved ? "#059669" : "#fff",
                    border: statusSaved ? "1px solid #A7F3D0" : "none", cursor: "pointer", transition: "all .15s",
                  }}>
                    {statusSaved ? <><CheckCircle2 size={14} />Status Saved!</> : "Save Status"}
                  </button>
                </div>
              </SectionCard>

              {/* Rep notes */}
              <SectionCard title="Rep Notes" icon={<StickyNote size={13} />} accent="#D97706">
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={6} placeholder="Add notes..."
                  style={{ width: "100%", fontSize: 13, borderRadius: 9, padding: "10px 12px", resize: "vertical" as const, lineHeight: 1.6, boxSizing: "border-box" as const, background: "#F9FAFB", border: `1px solid ${noteSaved ? "#A7F3D0" : "#E5E7EB"}`, color: "#111827", outline: "none" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#BFDBFE")}
                  onBlur={e => (e.currentTarget.style.borderColor = noteSaved ? "#A7F3D0" : "#E5E7EB")}
                />
                <button onClick={saveNote} style={{
                  marginTop: 8, display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700,
                  padding: "8px 16px", borderRadius: 8, background: noteSaved ? "#ECFDF5" : "#fff",
                  color: noteSaved ? "#065F46" : "#374151", border: `1px solid ${noteSaved ? "#A7F3D0" : "#E5E7EB"}`, cursor: "pointer",
                }}>
                  {noteSaved ? <><Check size={13} strokeWidth={2.5} />Saved!</> : "Save Notes"}
                </button>
              </SectionCard>

              {/* Quick note */}
              <SectionCard title="Add Quick Note" icon={<MessageSquare size={13} />}>
                <textarea value={noteInput} onChange={e => setNoteInput(e.target.value)} rows={3} placeholder="Quick note..."
                  style={{ width: "100%", fontSize: 13, borderRadius: 9, padding: "9px 12px", resize: "none", boxSizing: "border-box" as const, background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#111827", outline: "none" }}
                />
                <button onClick={addNote} disabled={!noteInput.trim()} style={{
                  marginTop: 8, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "9px 0", borderRadius: 9, fontSize: 13, fontWeight: 700,
                  background: noteAdded ? "#ECFDF5" : noteInput.trim() ? "#2563EB" : "#F3F4F6",
                  color: noteAdded ? "#059669" : noteInput.trim() ? "#fff" : "#9CA3AF",
                  border: "none", cursor: noteInput.trim() ? "pointer" : "not-allowed",
                }}>
                  {noteAdded ? <><CheckCircle2 size={14} />Added!</> : "Add Note"}
                </button>
              </SectionCard>

              {/* Recent activity */}
              <SectionCard title="Recent Activity" icon={<Activity size={13} />}>
                {lead.activity.length === 0
                  ? <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>No activity recorded.</p>
                  : <>
                      <ol style={{ position: "relative" as const, borderLeft: "2px solid #F0F0F0", marginLeft: 4, padding: 0, listStyle: "none" }}>
                        {displayedActivity.map((item, i) => {
                          const color = ACTIVITY_COLORS[item.type] ?? "#374151";
                          return (
                            <li key={i} style={{ position: "relative" as const, paddingBottom: 14, paddingLeft: 16 }}>
                              <span style={{ position: "absolute" as const, left: -5, top: 4, width: 8, height: 8, borderRadius: "50%", background: color, border: "2px solid #fff" }} />
                              <p style={{ fontSize: 10, fontWeight: 800, color, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{ACTIVITY_LABELS[item.type] ?? item.type}</p>
                              <p style={{ fontSize: 12, color: "#1F2937", lineHeight: 1.45, margin: "0 0 1px" }}>{item.text}</p>
                              <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0 }}>{item.time}</p>
                            </li>
                          );
                        })}
                      </ol>
                      {lead.activity.length > 6 && (
                        <button onClick={() => setShowAllActivity(v => !v)}
                          style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2563EB", background: "transparent", border: "none", cursor: "pointer", padding: "4px 0" }}>
                          {showAllActivity ? <><ChevronUp size={12} />Show less</> : <><ChevronDown size={12} />Show all {lead.activity.length}</>}
                        </button>
                      )}
                    </>
                }
              </SectionCard>
            </div>
          </div>
        )}

        {/* ════════ CALL LOGS ════════ */}
        {tab === "calls" && (
          <div style={{ maxWidth: 720 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {[
                { label: `${totalCalls} Total`,             color: "#1D4ED8", bg: "#EFF6FF",  border: "#BFDBFE" },
                { label: `${connectedCalls} Connected`,     color: "#059669", bg: "#ECFDF5",  border: "#A7F3D0" },
                { label: `${totalCalls - connectedCalls} Missed`, color: "#374151", bg: "#F3F4F6", border: "#E5E7EB" },
              ].map(c => (
                <span key={c.label} style={{ fontSize: 13, fontWeight: 700, padding: "6px 16px", borderRadius: 99, background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
                  {c.label}
                </span>
              ))}
            </div>
            {lead.callLogs.length === 0
              ? <div style={{ padding: "60px 0", textAlign: "center" as const }}>
                  <PhoneCall size={28} style={{ color: "#D1D5DB", margin: "0 auto 10px" }} />
                  <p style={{ fontSize: 14, color: "#9CA3AF" }}>No call logs yet.</p>
                </div>
              : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {lead.callLogs.map(log => {
                    const rc = log.result === "Connected" ? "#059669" : log.result === "Busy" ? "#B45309" : log.result === "Wrong Number" ? "#B91C1C" : "#374151";
                    const ResultIcon = log.result === "Connected" ? PhoneCall : log.result === "Not Connected" ? PhoneMissed : log.result === "Busy" ? Clock : Ban;
                    return (
                      <div key={log.id} style={{ padding: "15px 18px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, display: "flex", gap: 14 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 11, background: rc + "18", color: rc, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <ResultIcon size={17} strokeWidth={2} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: rc }}>{log.result}</span>
                            <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "monospace" }}>{log.date} · {log.time}</span>
                          </div>
                          <div style={{ display: "flex", gap: 12, marginBottom: log.remarks ? 5 : 0 }}>
                            {log.duration && <span style={{ fontSize: 13, color: "#374151" }}>{log.duration}</span>}
                            <span style={{ fontSize: 12, color: "#6B7280" }}>by {log.by}</span>
                          </div>
                          {log.remarks && <p style={{ fontSize: 13, color: "#1F2937", margin: 0, lineHeight: 1.5 }}>{log.remarks}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
            }
          </div>
        )}

        {/* ════════ ACTIVITY ════════ */}
        {tab === "activity" && (
          <div style={{ maxWidth: 640 }}>
            {lead.activity.length === 0
              ? <div style={{ padding: "60px 0", textAlign: "center" as const, fontSize: 14, color: "#9CA3AF" }}>No activity recorded yet.</div>
              : <ol style={{ position: "relative" as const, borderLeft: "2px solid #E5E7EB", marginLeft: 8, padding: 0, listStyle: "none" }}>
                  {lead.activity.map((item, i) => {
                    const color = ACTIVITY_COLORS[item.type] ?? "#374151";
                    return (
                      <li key={i} style={{ position: "relative" as const, paddingBottom: 20, paddingLeft: 24 }}>
                        <span style={{ position: "absolute" as const, left: -6, top: 3, width: 12, height: 12, borderRadius: "50%", background: color, border: "2px solid #F5F5F7" }} />
                        <div style={{ padding: "12px 16px", background: "#fff", borderRadius: 11, border: "1px solid #E5E7EB" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <p style={{ fontSize: 11, fontWeight: 800, color, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{ACTIVITY_LABELS[item.type] ?? item.type}</p>
                            <p style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "monospace", margin: 0 }}>{item.time}</p>
                          </div>
                          <p style={{ fontSize: 14, color: "#1F2937", lineHeight: 1.5, margin: "0 0 4px" }}>{item.text}</p>
                          {item.by && <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>by {item.by}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ol>
            }
          </div>
        )}

        {/* ════════ ESCALATE ════════ */}
        {tab === "escalate" && (
          <div style={{ maxWidth: 640 }}>
            <div style={{ padding: "16px 20px", background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 12, marginBottom: 20, display: "flex", gap: 14 }}>
              <AlertTriangle size={20} style={{ color: "#C2410C", flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#C2410C", margin: "0 0 4px" }}>Escalate to Manager</p>
                <p style={{ fontSize: 13, color: "#78350F", margin: 0, lineHeight: 1.5 }}>
                  Flag this lead for manager attention — discount approvals, high-value opportunities, complaints, or situations beyond your authority.
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              <div style={{ padding: "14px 16px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 11 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px" }}>Lead</p>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, background: palette.bg, color: palette.text, flexShrink: 0 }}>
                    {getInitials(lead.name)}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>{lead.name}</p>
                    <p style={{ fontSize: 12, color: "#374151", margin: 0 }}>{lead.service}</p>
                  </div>
                </div>
              </div>
              <div style={{ padding: "14px 16px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 11 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px" }}>Current Status</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: STATUS_CONFIG[lead.status]?.bg, color: STATUS_CONFIG[lead.status]?.text, border: `1px solid ${STATUS_CONFIG[lead.status]?.border}` }}>{lead.status}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: scorec.bg, color: scorec.text }}>{lead.score}</span>
                </div>
                {typeof lead.leadScore === "number" && (
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 5, background: "#E5E7EB", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${lead.leadScore}%`, background: lead.leadScore >= 70 ? "#059669" : "#D97706", borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#374151" }}>{lead.leadScore}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 7, display: "block" }}>Reason *</label>
              <div style={{ position: "relative" }}>
                <select value={escalationReason} onChange={e => setEscalationReason(e.target.value)}
                  style={{ width: "100%", fontSize: 14, padding: "11px 32px 11px 14px", borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", color: "#111827", appearance: "none", cursor: "pointer" }}>
                  <option value="">Select reason...</option>
                  {ESCALATION_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown size={15} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 7, display: "block" }}>Priority</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { label: "Normal",   activeBg: "#111827" },
                  { label: "Urgent",   activeBg: "#B45309" },
                  { label: "Critical", activeBg: "#B91C1C" },
                ].map(p => (
                  <button key={p.label} onClick={() => setEscalationPriority(p.label)} style={{
                    flex: 1, padding: "9px 0", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all .15s",
                    background: escalationPriority === p.label ? p.activeBg : "#F9FAFB",
                    color: escalationPriority === p.label ? "#fff" : "#374151",
                    border: `1.5px solid ${escalationPriority === p.label ? p.activeBg : "#E5E7EB"}`,
                  }}>{p.label}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 7, display: "block" }}>Context for Manager</label>
              <textarea value={escalationNote} onChange={e => setEscalationNote(e.target.value)}
                placeholder="Budget discussed, what the student said, what you've already tried..."
                rows={4}
                style={{ width: "100%", fontSize: 13, padding: "11px 14px", borderRadius: 10, border: "1px solid #E5E7EB", resize: "none", color: "#111827", background: "#fff", boxSizing: "border-box" as const, lineHeight: 1.55, outline: "none" }}
              />
            </div>

            <button onClick={sendEscalation} disabled={!escalationReason} style={{
              width: "100%", padding: "13px 0", borderRadius: 11, fontSize: 14, fontWeight: 700,
              border: "none", cursor: escalationReason ? "pointer" : "not-allowed", transition: "all .15s",
              background: escalationSent ? "#ECFDF5" : escalationReason ? "#C2410C" : "#F3F4F6",
              color: escalationSent ? "#059669" : escalationReason ? "#fff" : "#9CA3AF",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {escalationSent ? <><CheckCircle2 size={17} />Escalation Sent!</> : <><Send size={15} />Send to Manager</>}
            </button>

            {escalationSent && (
              <div style={{ marginTop: 14, padding: "14px 18px", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 11, textAlign: "center" as const }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#065F46", margin: "0 0 3px" }}>Manager Notified</p>
                <p style={{ fontSize: 12, color: "#374151", margin: 0 }}>Your manager will review and follow up shortly.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}