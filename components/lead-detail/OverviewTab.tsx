"use client";
import { useState } from "react";
import {
  Check, Activity, ChevronDown, ChevronUp, StickyNote, CalendarDays, Tag,
  CheckCircle2, MessageSquare, Zap, User, TrendingUp,
} from "lucide-react";
import { Lead, LeadStatus } from "./types";
import { STATUS_CONFIG, LOST_REASONS, COURSE_OPTIONS, ACTIVITY_COLORS, ACTIVITY_LABELS } from "./constants";
import IntelPanel from "./IntelPanel";
import CounselingForm from "./CounselingForm";

// ─── SHARED UI ────────────────────────────────────────────────────
interface SCardProps { title: string; icon?: React.ReactNode; accent?: string; children: React.ReactNode; }
function SCard({ title, icon, accent = "#9CA3AF", children }: SCardProps) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ padding: "9px 14px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 6 }}>
        {icon && <span style={{ color: accent }}>{icon}</span>}
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "#4B5563" }}>{title}</span>
      </div>
      <div style={{ padding: "12px 14px" }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value, mono, last }: { label: string; value: string; mono?: boolean; last?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: last ? "none" : "1px solid #F9FAFB" }}>
      <span style={{ fontSize: 12, color: "#6B7280" }}>{label}</span>
      <span style={{ fontSize: 12, color: "#111827", fontWeight: 500, fontFamily: mono ? "monospace" : undefined }}>{value}</span>
    </div>
  );
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────
interface OverviewTabProps {
  lead: Lead;
  currentStatus: LeadStatus;
  onStatusChange: (status: LeadStatus) => void;
}

export default function OverviewTab({ lead, currentStatus, onStatusChange }: OverviewTabProps) {
  const intel = lead.intelligence ?? {};
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [noteSaved, setNoteSaved] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [noteAdded, setNoteAdded] = useState(false);
  const [selectedLostReason, setSelectedLostReason] = useState(lead.lostReason ?? "");
  const [statusSaved, setStatusSaved] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>(lead.courseInterests ?? []);
  const [showAllAct, setShowAllAct] = useState(false);

  const saveNote = () => { setNoteSaved(true); setTimeout(() => setNoteSaved(false), 1800); };
  const addNote = () => {
    if (!noteInput.trim()) return;
    setNoteAdded(true);
    setTimeout(() => { setNoteAdded(false); setNoteInput(""); }, 1800);
  };
  const updateStatus = () => {
    setStatusSaved(true);
    setTimeout(() => setStatusSaved(false), 1800);
  };

  const displayedAct = showAllAct ? lead.activity : lead.activity.slice(0, 5);
  const sc = STATUS_CONFIG[currentStatus];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>

      {/* ── LEFT ── */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
        <IntelPanel intel={intel} />

        <SCard title="Lead Information" icon={<User size={12} />}>
          <InfoRow label="Lead ID"       value={lead.id}           mono />
          <InfoRow label="Source"        value={lead.source}            />
          <InfoRow label="City"          value={lead.city}              />
          <InfoRow label="Assigned To"   value={lead.assignedTo}        />
          <InfoRow label="Created"       value={lead.createdAt}    mono />
          {lead.followUpDate && <InfoRow label="Next Follow-up" value={lead.followUpDate} mono />}
          <InfoRow label="Priority"      value={lead.priority}     last />
        </SCard>

        <SCard title="Lead Qualification" icon={<TrendingUp size={12} />} accent="#2563EB">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            {([
              { label: "Intake Timeline",  value: lead.intakeTimeline  ?? "—" },
              { label: "Education",        value: lead.education        ?? "—" },
              { label: "Engagement Level", value: lead.engagementLevel  ?? "—" },
              { label: "Budget Readiness", value: lead.budgetReadiness  ?? "—" },
            ] as const).map(r => (
              <div key={r.label} style={{ padding: "10px 12px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #F0F0F0" }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" as const, letterSpacing: "0.05em", margin: "0 0 3px" }}>{r.label}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0 }}>{r.value}</p>
              </div>
            ))}
          </div>
          {typeof lead.leadScore === "number" && (
            <div style={{ padding: "10px 12px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #F0F0F0", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#4B5563" }}>Lead Score</span>
              <div style={{ flex: 1, height: 5, background: "#E5E7EB", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${lead.leadScore}%`, background: lead.leadScore >= 70 ? "#059669" : lead.leadScore >= 40 ? "#D97706" : "#9CA3AF", borderRadius: 99 }} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 900, color: lead.leadScore >= 70 ? "#059669" : lead.leadScore >= 40 ? "#D97706" : "#6B7280" }}>
                {lead.leadScore}
              </span>
            </div>
          )}
        </SCard>

        <CounselingForm lead={lead} />

        <SCard title="Course Interests" icon={<Tag size={12} />} accent="#7C3AED">
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" as const, marginBottom: 10 }}>
            {(lead.courseInterests ?? []).length > 0
              ? (lead.courseInterests ?? []).map(c => (
                  <span key={c} style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 7, background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE" }}>{c}</span>
                ))
              : <span style={{ fontSize: 12, color: "#9CA3AF" }}>None selected</span>
            }
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" as const }}>
            {COURSE_OPTIONS.map(c => {
              const sel = selectedCourses.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCourses(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])}
                  style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 6, cursor: "pointer", border: `1.5px solid ${sel ? "#7C3AED" : "#E5E7EB"}`, background: sel ? "#FAF5FF" : "#fff", color: sel ? "#7C3AED" : "#374151" }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </SCard>

        {lead.followUps.length > 0 && (
          <SCard title="Follow-up Schedule" icon={<CalendarDays size={12} />} accent="#059669">
            {lead.followUps.map(fu => (
              <div key={fu.id} style={{ padding: "8px 0", borderBottom: "1px solid #F9FAFB", display: "flex", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 4, flexShrink: 0, background: fu.status === "Completed" ? "#059669" : fu.status === "Missed" ? "#EF4444" : "#D97706" }} />
                <div>
                  <div style={{ display: "flex", gap: 7, marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{fu.date} · {fu.time}</span>
                    <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 99, background: fu.status === "Completed" ? "#ECFDF5" : fu.status === "Missed" ? "#FEF2F2" : "#FFFBEB", color: fu.status === "Completed" ? "#059669" : fu.status === "Missed" ? "#B91C1C" : "#B45309" }}>
                      {fu.status}
                    </span>
                  </div>
                  {fu.remarks && <p style={{ fontSize: 11, color: "#1F2937", margin: 0 }}>{fu.remarks}</p>}
                </div>
              </div>
            ))}
          </SCard>
        )}

        {lead.lostReason && (
          <div style={{ padding: "12px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10 }}>
            <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.06em", color: "#B91C1C", margin: "0 0 5px" }}>Lost Reason</p>
            <p style={{ fontSize: 13, color: "#7F1D1D", lineHeight: 1.5, margin: 0 }}>{lead.lostReason}</p>
          </div>
        )}
      </div>

      {/* ── RIGHT ── */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>

        {/* Update Status */}
        <SCard title="Update Status" icon={<Zap size={12} />} accent="#F59E0B">
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 7 }}>
            <select
              value={currentStatus}
              onChange={e => onStatusChange(e.target.value as LeadStatus)}
              style={{ width: "100%", fontSize: 12, padding: "9px 10px", borderRadius: 8, border: `1px solid ${sc.border}`, background: sc.bg, color: sc.text, cursor: "pointer", fontWeight: 700 }}
            >
              {(["New","Contacted","Qualified","Proposal Sent","Negotiation","Enrolled","Not Interested","Lost"] as LeadStatus[]).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {(currentStatus === "Lost" || currentStatus === "Not Interested") && (
              <select
                value={selectedLostReason}
                onChange={e => setSelectedLostReason(e.target.value)}
                style={{ width: "100%", fontSize: 12, padding: "9px 10px", borderRadius: 8, border: "1px solid #FECACA", background: "#FEF2F2", color: "#B91C1C", cursor: "pointer" }}
              >
                <option value="">Select lost reason...</option>
                {LOST_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            )}
            <button
              onClick={updateStatus}
              style={{ padding: "9px 0", borderRadius: 8, fontSize: 12, fontWeight: 700, background: statusSaved ? "#ECFDF5" : "#111827", color: statusSaved ? "#059669" : "#fff", border: statusSaved ? "1px solid #A7F3D0" : "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
            >
              {statusSaved ? <><CheckCircle2 size={13} />Status Saved!</> : "Save Status"}
            </button>
          </div>
        </SCard>

        {/* Rep Notes */}
        <SCard title="Rep Notes" icon={<StickyNote size={12} />} accent="#D97706">
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={5}
            placeholder="Add notes..."
            style={{ width: "100%", fontSize: 12, borderRadius: 8, padding: "9px 10px", resize: "vertical" as const, lineHeight: 1.6, boxSizing: "border-box" as const, background: "#F9FAFB", border: `1px solid ${noteSaved ? "#A7F3D0" : "#E5E7EB"}`, color: "#111827", outline: "none" }}
          />
          <button
            onClick={saveNote}
            style={{ marginTop: 7, display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, padding: "7px 13px", borderRadius: 7, background: noteSaved ? "#ECFDF5" : "#fff", color: noteSaved ? "#065F46" : "#374151", border: `1px solid ${noteSaved ? "#A7F3D0" : "#E5E7EB"}`, cursor: "pointer" }}
          >
            {noteSaved ? <><Check size={12} strokeWidth={2.5} />Saved!</> : "Save Notes"}
          </button>
        </SCard>

        {/* Quick Note */}
        <SCard title="Add Quick Note" icon={<MessageSquare size={12} />}>
          <textarea
            value={noteInput}
            onChange={e => setNoteInput(e.target.value)}
            rows={3}
            placeholder="Quick note..."
            style={{ width: "100%", fontSize: 12, borderRadius: 8, padding: "8px 10px", resize: "none" as const, boxSizing: "border-box" as const, background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#111827", outline: "none" }}
          />
          <button
            onClick={addNote}
            disabled={!noteInput.trim()}
            style={{ marginTop: 7, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 700, background: noteAdded ? "#ECFDF5" : noteInput.trim() ? "#2563EB" : "#F3F4F6", color: noteAdded ? "#059669" : noteInput.trim() ? "#fff" : "#9CA3AF", border: "none", cursor: noteInput.trim() ? "pointer" : "not-allowed" }}
          >
            {noteAdded ? <><CheckCircle2 size={13} />Added!</> : "Add Note"}
          </button>
        </SCard>

        {/* Recent Activity */}
        <SCard title="Recent Activity" icon={<Activity size={12} />}>
          {lead.activity.length === 0 ? (
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>No activity recorded.</p>
          ) : (
            <>
              <ol style={{ position: "relative" as const, borderLeft: "2px solid #F0F0F0", marginLeft: 4, padding: 0, listStyle: "none" as const }}>
                {displayedAct.map((item, i) => {
                  const color = ACTIVITY_COLORS[item.type] ?? "#374151";
                  return (
                    <li key={i} style={{ position: "relative" as const, paddingBottom: 12, paddingLeft: 14 }}>
                      <span style={{ position: "absolute" as const, left: -4, top: 4, width: 7, height: 7, borderRadius: "50%", background: color, border: "2px solid #fff" }} />
                      <p style={{ fontSize: 9, fontWeight: 800, color, margin: "0 0 1px", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>{ACTIVITY_LABELS[item.type]}</p>
                      <p style={{ fontSize: 11, color: "#1F2937", lineHeight: 1.4, margin: "0 0 1px" }}>{item.text}</p>
                      <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0 }}>{item.time}</p>
                    </li>
                  );
                })}
              </ol>
              {lead.activity.length > 5 && (
                <button
                  onClick={() => setShowAllAct(v => !v)}
                  style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#2563EB", background: "transparent", border: "none", cursor: "pointer", padding: "3px 0" }}
                >
                  {showAllAct ? <><ChevronUp size={11} />Show less</> : <><ChevronDown size={11} />Show all {lead.activity.length}</>}
                </button>
              )}
            </>
          )}
        </SCard>
      </div>
    </div>
  );
}