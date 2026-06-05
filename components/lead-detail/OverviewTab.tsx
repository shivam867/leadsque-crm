"use client";
import { useState } from "react";
import {
  Check, StickyNote, CalendarDays,
  CheckCircle2, MessageSquare, Zap, User, TrendingUp,
  Target, MessageSquare as LangIcon, Plus, X,
} from "lucide-react";
import { Lead, LeadStatus } from "./types";
import { STATUS_CONFIG, LOST_REASONS, ACTIVITY_COLORS, ACTIVITY_LABELS } from "./constants";
import CounselingForm from "./CounselingForm";
import { ObjectionEntry } from "./types";

/* ─── Card primitive ─── */
interface SCardProps { title: string; icon?: React.ReactNode; accent?: string; children: React.ReactNode; noPad?: boolean; }
function SCard({ title, icon, accent = "var(--border-strong)", children, noPad }: SCardProps) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 6, background: "var(--surface-2)", borderLeft: `3px solid ${accent}` }}>
        {icon && <span style={{ color: accent, display: "flex", alignItems: "center" }}>{icon}</span>}
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "var(--text-muted)" }}>{title}</span>
      </div>
      <div style={noPad ? {} : { padding: "12px" }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value, mono, last }: { label: string; value: string; mono?: boolean; last?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: last ? "none" : "1px solid var(--surface-3)" }}>
      <span style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500, fontFamily: mono ? "monospace" : undefined, textAlign: "right" as const, marginLeft: 12 }}>{value}</span>
    </div>
  );
}

interface OverviewTabProps {
  lead: Lead;
  currentStatus: LeadStatus;
  onStatusChange: (status: LeadStatus) => void;
}

export default function OverviewTab({ lead, currentStatus, onStatusChange }: OverviewTabProps) {
  const intel = lead.intelligence ?? {};

  // Status
  const [selectedLostReason, setSelectedLostReason] = useState(lead.lostReason ?? "");
  const [statusSaved, setStatusSaved] = useState(false);
  const updateStatus = () => { setStatusSaved(true); setTimeout(() => setStatusSaved(false), 1800); };
  const sc = STATUS_CONFIG[currentStatus];

  // Notes
  const [notes, setNotes]         = useState(lead.notes ?? "");
  const [noteSaved, setNoteSaved] = useState(false);
  const saveNote = () => { setNoteSaved(true); setTimeout(() => setNoteSaved(false), 1800); };

  // Quick note
  const [noteInput, setNoteInput] = useState("");
  const [noteAdded, setNoteAdded] = useState(false);
  const addNote = () => { if (!noteInput.trim()) return; setNoteAdded(true); setTimeout(() => { setNoteAdded(false); setNoteInput(""); }, 1800); };

  // Objections (inline, not via IntelPanel)
  const [objEdit, setObjEdit]       = useState(false);
  const [objections, setObjections] = useState<ObjectionEntry[]>(intel.handlingObjections ?? []);

  // Language
  const [langs, setLangs]   = useState<string[]>(intel.languagePreference ?? []);
  const [langIn, setLangIn] = useState("");

  const scoreColor = (s: number) => s >= 70 ? "var(--success)" : s >= 40 ? "var(--warning)" : "var(--text-muted)";

  const INPUT: React.CSSProperties = {
    width: "100%", fontSize: 12, padding: "6px 9px",
    borderRadius: 4, border: "1px solid var(--border-strong)",
    background: "var(--surface)", color: "var(--text-primary)",
    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px", gap: 14, alignItems: "start" }}>

      {/* ══ COL 1: Counseling Form → Lead Info → Qualification ══ */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>

        <CounselingForm lead={lead} />

        <SCard title="Lead Information" icon={<User size={11} />} accent="#111111">
          <InfoRow label="Lead ID"     value={lead.id}        mono />
          <InfoRow label="Source"      value={lead.source}         />
          <InfoRow label="City"        value={lead.city}           />
          <InfoRow label="Assigned To" value={lead.assignedTo}     />
          <InfoRow label="Created"     value={lead.createdAt} mono />
          {lead.followUpDate && <InfoRow label="Follow-up" value={lead.followUpDate} mono />}
          <InfoRow label="Priority"    value={lead.priority}  last />
        </SCard>

        {lead.lostReason && (
          <div style={{ padding: "10px 12px", background: "var(--danger-light)", border: "1px solid var(--danger-border)", borderRadius: "var(--radius-md)" }}>
            <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.06em", color: "var(--danger)", margin: "0 0 3px" }}>Lost Reason</p>
            <p style={{ fontSize: 12, color: "var(--danger)", lineHeight: 1.5, margin: 0 }}>{lead.lostReason}</p>
          </div>
        )}
      </div>

      {/* ══ COL 2: Handling Objections → Language Preference ══ */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>

        {/* Handling Objections */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface-2)", borderLeft: "3px solid var(--warning)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Target size={11} style={{ color: "var(--warning)" }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "var(--text-muted)" }}>Handling Objections</span>
            </div>
            {objEdit ? (
              <div style={{ display: "flex", gap: 5 }}>
                <button onClick={() => setObjEdit(false)} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text-secondary)", cursor: "pointer" }}>Cancel</button>
                <button onClick={() => setObjEdit(false)} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, border: "none", background: "var(--warning)", color: "#fff", cursor: "pointer", fontWeight: 700 }}>Save</button>
              </div>
            ) : (
              <button onClick={() => setObjEdit(true)} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text-secondary)", cursor: "pointer" }}>Edit</button>
            )}
          </div>
          <div style={{ padding: "12px", display: "flex", flexDirection: "column" as const, gap: 8, maxHeight: 260, overflowY: "auto" as const, scrollbarWidth: "thin" as const }}>
            {objections.length === 0 && !objEdit && (
              <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, fontStyle: "italic" }}>No objections added yet.</p>
            )}
            {objections.map((obj, i) => (
              <div key={i} style={{ padding: "9px 11px", background: "var(--warning-light)", borderRadius: 6, border: "1px solid var(--warning-border)" }}>
                {objEdit ? (
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 5 }}>
                    <input value={obj.objection} onChange={e => { const o = [...objections]; o[i] = { ...o[i], objection: e.target.value }; setObjections(o); }} placeholder="Objection..." style={{ ...INPUT, fontWeight: 600 }} />
                    <input value={obj.response}  onChange={e => { const o = [...objections]; o[i] = { ...o[i], response:  e.target.value }; setObjections(o); }} placeholder="Response..."  style={INPUT} />
                    {objections.length > 1 && (
                      <button onClick={() => setObjections(objections.filter((_, j) => j !== i))} style={{ fontSize: 10, color: "var(--danger)", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" as const, padding: 0, fontWeight: 600 }}>Remove</button>
                    )}
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "var(--warning)", margin: "0 0 3px" }}>If: {obj.objection}</p>
                    <p style={{ fontSize: 11, color: "var(--text-primary)", margin: 0, lineHeight: 1.5 }}>→ {obj.response}</p>
                  </>
                )}
              </div>
            ))}
            {objEdit && (
              <button onClick={() => setObjections([...objections, { objection: "", response: "" }])} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--warning)", background: "transparent", border: "1px dashed var(--warning-border)", borderRadius: 5, padding: "5px 9px", cursor: "pointer", fontWeight: 600 }}>
                <Plus size={10} /> Add Objection
              </button>
            )}
          </div>
        </div>

        {/* Language Preference */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
          <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 6, background: "var(--surface-2)", borderLeft: "3px solid var(--info)" }}>
            <LangIcon size={11} style={{ color: "var(--info)" }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "var(--text-muted)" }}>Language Preference</span>
          </div>
          <div style={{ padding: "12px" }}>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: langs.length ? 10 : 0 }}>
              {langs.map(l => (
                <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 5, background: "var(--info-light)", color: "var(--info)", border: "1px solid var(--info-border)" }}>
                  {l}
                  <button onClick={() => setLangs(langs.filter(x => x !== l))} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--info)", padding: 0, display: "flex", alignItems: "center" }}>
                    <X size={9} />
                  </button>
                </span>
              ))}
            </div>
            <input
              value={langIn}
              onChange={e => setLangIn(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && langIn.trim()) { setLangs([...langs, langIn.trim()]); setLangIn(""); } }}
              placeholder="Type a language, press Enter"
              style={{ ...INPUT, width: "100%" }}
            />
          </div>
        </div>

        {lead.followUps.length > 0 && (
          <SCard title="Follow-up Schedule" icon={<CalendarDays size={11} />} accent="var(--success)">
            {lead.followUps.map((fu, i) => (
              <div key={fu.id} style={{ padding: "6px 0", borderBottom: i < lead.followUps.length - 1 ? "1px solid var(--border)" : "none", display: "flex", gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", marginTop: 4, flexShrink: 0, background: fu.status === "Completed" ? "var(--success)" : fu.status === "Missed" ? "var(--danger)" : "var(--warning)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 2, alignItems: "center", flexWrap: "wrap" as const }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)" }}>{fu.date} · {fu.time}</span>
                    <span style={{ fontSize: 9, fontWeight: 800, padding: "1px 5px", borderRadius: 99, background: fu.status === "Completed" ? "var(--success-light)" : fu.status === "Missed" ? "var(--danger-light)" : "var(--warning-light)", color: fu.status === "Completed" ? "var(--success)" : fu.status === "Missed" ? "var(--danger)" : "var(--warning)" }}>
                      {fu.status}
                    </span>
                  </div>
                  {fu.remarks && <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>{fu.remarks}</p>}
                </div>
              </div>
            ))}
          </SCard>
        )}

        <SCard title="Lead Qualification" icon={<TrendingUp size={11} />} accent="var(--accent)">
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 6, marginBottom: 10 }}>
            {([
              { label: "Intake Timeline",  value: lead.intakeTimeline  ?? "—" },
              { label: "Education",        value: lead.education        ?? "—" },
              { label: "Engagement Level", value: lead.engagementLevel  ?? "—" },
              { label: "Budget Readiness", value: lead.budgetReadiness  ?? "—" },
            ] as const).map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 9px", background: "var(--surface-2)", borderRadius: 5, border: "1px solid var(--border)" }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{r.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{r.value}</span>
              </div>
            ))}
          </div>
          {typeof lead.leadScore === "number" && (
            <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 9px", background: "var(--surface-2)", borderRadius: 5, border: "1px solid var(--border)" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", whiteSpace: "nowrap" as const }}>Lead Score</span>
              <div style={{ flex: 1, height: 4, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${lead.leadScore}%`, background: scoreColor(lead.leadScore), borderRadius: 99 }} />
              </div>
              <span style={{ fontSize: 15, fontWeight: 900, color: scoreColor(lead.leadScore) }}>{lead.leadScore}</span>
            </div>
          )}
        </SCard>
      </div>

      {/* ══ COL 3 (300px): Update Status → Rep Notes → Quick Note ══ */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>

        <SCard title="Update Status" icon={<Zap size={11} />} accent="var(--warning)">
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 7 }}>
            <select
              value={currentStatus}
              onChange={e => onStatusChange(e.target.value as LeadStatus)}
              style={{ width: "100%", fontSize: 12, padding: "7px 9px", borderRadius: "var(--radius-sm)", border: `1px solid ${sc.border}`, background: sc.bg, color: sc.text, cursor: "pointer", fontWeight: 700, fontFamily: "inherit", outline: "none" }}
            >
              {(["New","Contacted","Qualified","Proposal Sent","Negotiation","Enrolled","Not Interested","Lost"] as LeadStatus[]).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {(currentStatus === "Lost" || currentStatus === "Not Interested") && (
              <select
                value={selectedLostReason}
                onChange={e => setSelectedLostReason(e.target.value)}
                style={{ width: "100%", fontSize: 12, padding: "7px 9px", borderRadius: "var(--radius-sm)", border: "1px solid var(--danger-border)", background: "var(--danger-light)", color: "var(--danger)", cursor: "pointer", fontFamily: "inherit", outline: "none" }}
              >
                <option value="">Select lost reason...</option>
                {LOST_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            )}
            <button
              onClick={updateStatus}
              style={{ padding: "7px 0", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 700, background: statusSaved ? "var(--success-light)" : "#111111", color: statusSaved ? "var(--success)" : "#fff", border: statusSaved ? "1px solid var(--success-border)" : "1px solid #111", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all .15s" }}
            >
              {statusSaved ? <><CheckCircle2 size={13} />Saved!</> : "Save Status"}
            </button>
          </div>
        </SCard>

        <SCard title="Rep Notes" icon={<StickyNote size={11} />} accent="var(--warning)">
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={5}
            placeholder="Add notes..."
            style={{ width: "100%", fontSize: 12, borderRadius: "var(--radius-sm)", padding: "7px 9px", resize: "vertical" as const, lineHeight: 1.6, boxSizing: "border-box" as const, background: "var(--surface-2)", border: `1px solid ${noteSaved ? "var(--success-border)" : "var(--border)"}`, color: "var(--text-primary)", outline: "none", fontFamily: "inherit" }}
          />
          <button
            onClick={saveNote}
            style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: "var(--radius-sm)", background: noteSaved ? "var(--success-light)" : "var(--surface-2)", color: noteSaved ? "var(--success)" : "var(--text-secondary)", border: `1px solid ${noteSaved ? "var(--success-border)" : "var(--border-strong)"}`, cursor: "pointer", transition: "all .15s" }}
          >
            {noteSaved ? <><Check size={11} strokeWidth={2.5} />Saved!</> : "Save Notes"}
          </button>
        </SCard>

        <SCard title="Quick Note" icon={<MessageSquare size={11} />} accent="var(--accent)">
          <textarea
            value={noteInput}
            onChange={e => setNoteInput(e.target.value)}
            rows={4}
            placeholder="Type and add..."
            style={{ width: "100%", fontSize: 12, borderRadius: "var(--radius-sm)", padding: "7px 9px", resize: "none" as const, boxSizing: "border-box" as const, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none", fontFamily: "inherit" }}
          />
          <button
            onClick={addNote}
            disabled={!noteInput.trim()}
            style={{ marginTop: 6, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "7px 0", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 600, background: noteAdded ? "var(--success-light)" : noteInput.trim() ? "#111111" : "var(--surface-2)", color: noteAdded ? "var(--success)" : noteInput.trim() ? "#fff" : "var(--text-muted)", border: noteAdded ? "1px solid var(--success-border)" : "none", cursor: noteInput.trim() ? "pointer" : "not-allowed", transition: "all .15s" }}
          >
            {noteAdded ? <><CheckCircle2 size={13} />Added!</> : "Add Note"}
          </button>
        </SCard>

      </div>
    </div>
  );
}