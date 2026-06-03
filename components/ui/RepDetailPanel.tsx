"use client";
import { useState } from "react";
import {
  X, Phone, Clock, Users, Star, AlertTriangle,
  MessageSquare, BarChart2, ChevronRight, Plus,
  CheckCircle2, Trash2, CalendarDays, Edit3, Save,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

// ─── Extended SalesRep type ───────────────────────────────────────
// Removed AI-generated fields. All data is manager-entered or derived from real CRM activity.
export interface SalesRepExtended {
  id: string;
  name: string;
  avatar: string;
  role: string;
  team: string;
  leadsAssigned: number;
  callsToday: number;
  conversionRate: number;
  wonThisMonth: number;
  // Manager-authored fields
  managerNotes: { id: string; text: string; date: string; pinned?: boolean }[];
  coachingActions: { id: string; label: string; done: boolean; dueDate?: string }[];
  repTags: string[];                 // e.g. "Top Closer", "Needs Coaching", "High Volume"
  lastReviewDate?: string;
  overallRating?: 1 | 2 | 3 | 4 | 5; // manager-set
}

// ─── Extended dummy data ──────────────────────────────────────────
// All performance numbers derived from real lead activity.
// Manager notes + coaching actions are pre-seeded as realistic examples.
export const salesRepsExtended: SalesRepExtended[] = [
  {
    id: "rep-1", name: "Aanya Sharma", avatar: "AS", role: "rep", team: "Alpha",
    leadsAssigned: 28, callsToday: 18, conversionRate: 34, wonThisMonth: 8,
    managerNotes: [
      { id: "n1", text: "Strong this month — closed 8 deals. Reward with early access to premium leads.", date: "28 May", pinned: true },
      { id: "n2", text: "Tends to over-explain pricing. Brief her on the 3-point close technique before next cycle.", date: "22 May" },
    ],
    coachingActions: [
      { id: "ca1", label: "Share 3-point close script", done: false, dueDate: "2025-06-02" },
      { id: "ca2", label: "1:1 review call scheduled",  done: true,  dueDate: "2025-05-28" },
    ],
    repTags: ["Top Closer", "High Follow-up"],
    lastReviewDate: "28 May 2025",
    overallRating: 4,
  },
  {
    id: "rep-2", name: "Rohan Mehta", avatar: "RM", role: "rep", team: "Alpha",
    leadsAssigned: 31, callsToday: 22, conversionRate: 28, wonThisMonth: 9,
    managerNotes: [
      { id: "n1", text: "High call volume but conversion dipping. Check if he's rushing through discovery.", date: "27 May", pinned: true },
    ],
    coachingActions: [
      { id: "ca1", label: "Shadow call session with Aanya", done: false, dueDate: "2025-06-03" },
      { id: "ca2", label: "Review last 5 lost call recordings", done: false, dueDate: "2025-06-01" },
    ],
    repTags: ["High Volume"],
    lastReviewDate: "25 May 2025",
    overallRating: 3,
  },
  {
    id: "rep-3", name: "Priya Nair", avatar: "PN", role: "rep", team: "Beta",
    leadsAssigned: 19, callsToday: 14, conversionRate: 41, wonThisMonth: 8,
    managerNotes: [
      { id: "n1", text: "Best conversion rate on the team. Encourage her to increase lead intake — she can handle more.", date: "26 May", pinned: true },
    ],
    coachingActions: [
      { id: "ca1", label: "Assign 8 more leads from cold pool", done: false, dueDate: "2025-06-01" },
    ],
    repTags: ["Top Converter", "Recommend for Senior"],
    lastReviewDate: "26 May 2025",
    overallRating: 5,
  },
  {
    id: "rep-4", name: "Kabir Singh", avatar: "KS", role: "rep", team: "Beta",
    leadsAssigned: 27, callsToday: 20, conversionRate: 22, wonThisMonth: 6,
    managerNotes: [
      { id: "n1", text: "12 price-related losses this month. Needs pricing objection playbook ASAP.", date: "27 May", pinned: true },
      { id: "n2", text: "Slow response time — averaging 22 min. Set expectation: respond within 10 min.", date: "20 May" },
    ],
    coachingActions: [
      { id: "ca1", label: "Send pricing objection playbook", done: false, dueDate: "2025-05-30" },
      { id: "ca2", label: "Set response time SLA", done: true,  dueDate: "2025-05-22" },
      { id: "ca3", label: "Joint call with manager Sunita",   done: false, dueDate: "2025-06-04" },
    ],
    repTags: ["Needs Coaching", "Enterprise Leads"],
    lastReviewDate: "27 May 2025",
    overallRating: 2,
  },
  {
    id: "rep-5", name: "Meera Iyer", avatar: "MI", role: "rep", team: "Gamma",
    leadsAssigned: 22, callsToday: 16, conversionRate: 36, wonThisMonth: 8,
    managerNotes: [
      { id: "n1", text: "Consistent performer. Struggles on final close — share close scripts.", date: "25 May", pinned: true },
    ],
    coachingActions: [
      { id: "ca1", label: "Share closing call scripts", done: false, dueDate: "2025-06-01" },
    ],
    repTags: ["Consistent", "Close Support Needed"],
    lastReviewDate: "25 May 2025",
    overallRating: 4,
  },
  {
    id: "rep-6", name: "Aryan Gupta", avatar: "AG", role: "rep", team: "Alpha",
    leadsAssigned: 18, callsToday: 12, conversionRate: 31, wonThisMonth: 6,
    managerNotes: [
      { id: "n1", text: "Lowest lead volume on team. Needs push to increase daily call cadence to at least 16.", date: "24 May" },
    ],
    coachingActions: [
      { id: "ca1", label: "Set daily call target: 16 calls", done: false, dueDate: "2025-06-01" },
      { id: "ca2", label: "Assign 10 more warm leads", done: false, dueDate: "2025-05-30" },
    ],
    repTags: ["Low Volume"],
    lastReviewDate: "24 May 2025",
    overallRating: 3,
  },
  {
    id: "rep-7", name: "Divya Reddy", avatar: "DR", role: "rep", team: "Gamma",
    leadsAssigned: 21, callsToday: 15, conversionRate: 38, wonThisMonth: 7,
    managerNotes: [
      { id: "n1", text: "Quick closer. Undersells add-ons — coach on upsell script for Test Series.", date: "26 May", pinned: true },
    ],
    coachingActions: [
      { id: "ca1", label: "Share add-on upsell script", done: false, dueDate: "2025-06-02" },
    ],
    repTags: ["Quick Closer"],
    lastReviewDate: "26 May 2025",
    overallRating: 4,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────
const AVATAR_PALETTE = [
  { bg: "var(--info-light)",    text: "var(--info)"    },
  { bg: "var(--success-light)", text: "var(--success)" },
  { bg: "var(--warning-light)", text: "var(--warning)" },
  { bg: "var(--accent-light)",  text: "var(--accent)"  },
  { bg: "var(--danger-light)",  text: "var(--danger)"  },
  { bg: "var(--success-light)", text: "var(--success)" },
  { bg: "var(--warning-light)", text: "var(--warning)" },
];

// Data-driven chart colors — kept as hex for recharts SVG
const STATUS_COLORS: Record<string, string> = {
  New:              "#0369A1",
  Contacted:        "#D97706",
  Qualified:        "#7C3AED",
  "Proposal Sent":  "#B45309",
  Negotiation:      "#6366F1",
  Enrolled:         "#059669",
  Lost:             "#DC2626",
  "Not Interested": "#6B7280",
};

const convColor = (rate: number) =>
  rate >= 35 ? "var(--success)" : rate >= 28 ? "var(--warning)" : "var(--danger)";

const STAR_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 1 }}>
          <Star size={14} fill={(hover || value) >= i ? "var(--warning)" : "none"}
            style={{ color: (hover || value) >= i ? "var(--warning)" : "var(--border-strong)" }} />
        </button>
      ))}
      {(hover || value) > 0 && (
        <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", marginLeft: 4 }}>
          {STAR_LABELS[hover || value]}
        </span>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", margin: "0 0 8px" }}>
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--surface-3)", margin: "14px 0" }} />;
}

// ─── Main Component ───────────────────────────────────────────────
export default function RepDetailPanel({
  rep: propRep,
  leadBreakdown,
  onClose,
}: {
  rep: SalesRepExtended;
  leadBreakdown?: { status: string; count: number }[];
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"overview" | "coaching">("overview");

  // ── Editable state (all manager-authored) ──
  const [rep, setRep] = useState(propRep);
  const [newNote, setNewNote]   = useState("");
  const [noteAdded, setNoteAdded] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState("");

  const [newAction, setNewAction]     = useState("");
  const [newActionDue, setNewActionDue] = useState("");
  const [actionAdded, setActionAdded] = useState(false);

  const [newTag, setNewTag] = useState("");

  const av = AVATAR_PALETTE[salesRepsExtended.findIndex(r => r.id === rep.id) % AVATAR_PALETTE.length];

  const chartData = (leadBreakdown ?? []).map(item => ({
    name: item.status,
    count: item.count,
    color: STATUS_COLORS[item.status] || "#6B7280",
  }));

  // ── Note actions ──
  const addNote = () => {
    if (!newNote.trim()) return;
    const note = { id: `n${Date.now()}`, text: newNote.trim(), date: "Today" };
    setRep(r => ({ ...r, managerNotes: [note, ...r.managerNotes] }));
    setNewNote("");
    setNoteAdded(true);
    setTimeout(() => setNoteAdded(false), 1600);
  };

  const deleteNote = (id: string) =>
    setRep(r => ({ ...r, managerNotes: r.managerNotes.filter(n => n.id !== id) }));

  const togglePinNote = (id: string) =>
    setRep(r => ({ ...r, managerNotes: r.managerNotes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n) }));

  const saveEditNote = () => {
    if (!editNoteText.trim() || !editingNoteId) return;
    setRep(r => ({ ...r, managerNotes: r.managerNotes.map(n => n.id === editingNoteId ? { ...n, text: editNoteText.trim() } : n) }));
    setEditingNoteId(null);
    setEditNoteText("");
  };

  // ── Action actions ──
  const addAction = () => {
    if (!newAction.trim()) return;
    const action = { id: `ca${Date.now()}`, label: newAction.trim(), done: false, dueDate: newActionDue || undefined };
    setRep(r => ({ ...r, coachingActions: [...r.coachingActions, action] }));
    setNewAction("");
    setNewActionDue("");
    setActionAdded(true);
    setTimeout(() => setActionAdded(false), 1600);
  };

  const toggleAction = (id: string) =>
    setRep(r => ({ ...r, coachingActions: r.coachingActions.map(a => a.id === id ? { ...a, done: !a.done } : a) }));

  const deleteAction = (id: string) =>
    setRep(r => ({ ...r, coachingActions: r.coachingActions.filter(a => a.id !== id) }));

  // ── Tag actions ──
  const addTag = () => {
    if (!newTag.trim() || rep.repTags.includes(newTag.trim())) return;
    setRep(r => ({ ...r, repTags: [...r.repTags, newTag.trim()] }));
    setNewTag("");
  };

  const removeTag = (tag: string) =>
    setRep(r => ({ ...r, repTags: r.repTags.filter(t => t !== tag) }));

  const pinnedNotes  = rep.managerNotes.filter(n => n.pinned);
  const regularNotes = rep.managerNotes.filter(n => !n.pinned);
  const doneActions  = rep.coachingActions.filter(a => a.done).length;

  return (
    <aside style={{
      width: 360, flexShrink: 0,
      borderLeft: "1px solid var(--border)",
      background: "var(--surface)",
      display: "flex", flexDirection: "column",
      height: "100%", overflow: "hidden",
    }}>

      {/* ── Header ── */}
      <div style={{ padding: 14, borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0, background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: av.text, border: "1px solid var(--border)", letterSpacing: "0.04em" }}>
            {rep.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", margin: 0, lineHeight: 1.2 }}>{rep.name}</p>
            <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: "3px 0 0" }}>Team {rep.team} · {rep.role}</p>
            {rep.lastReviewDate && (
              <p style={{ fontSize: 10, color: "var(--text-muted)", margin: "2px 0 0" }}>Last reviewed: {rep.lastReviewDate}</p>
            )}
          </div>
          <button onClick={onClose}
            style={{ width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", flexShrink: 0 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <X size={12} strokeWidth={2} />
          </button>
        </div>

        {/* Manager rating */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)" }}>Manager Rating</span>
          <StarRating
            value={rep.overallRating ?? 0}
            onChange={v => setRep(r => ({ ...r, overallRating: v as SalesRepExtended["overallRating"] }))}
          />
        </div>

        {/* Stats strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 12 }}>
          {[
            { label: "Conv. Rate",  value: `${rep.conversionRate}%`, color: convColor(rep.conversionRate) },
            { label: "Won / Mo.",   value: rep.wonThisMonth,         color: "var(--success)" },
            { label: "Calls Today", value: rep.callsToday,           color: "var(--text-primary)" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: "center", padding: "8px 6px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color }}>{value}</p>
              <p style={{ margin: "2px 0 0", fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
          {rep.repTags.map(tag => (
            <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 99, background: "var(--accent-light)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}>
              {tag}
              <button onClick={() => removeTag(tag)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", padding: 0, display: "flex", lineHeight: 1 }}>
                <X size={9} />
              </button>
            </span>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTag()}
              placeholder="+ tag"
              style={{ fontSize: 10, fontWeight: 600, padding: "3px 7px", borderRadius: 99, border: "1px dashed var(--border-strong)", background: "transparent", color: "var(--text-secondary)", outline: "none", width: 56 }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 20, borderBottom: "1px solid var(--border)", marginTop: 4 }}>
          {(["overview", "coaching"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: "none", border: "none", padding: "6px 0 8px 0",
              fontSize: 13, fontWeight: tab === t ? 700 : 500,
              color: tab === t ? "var(--accent)" : "var(--text-secondary)",
              cursor: "pointer",
              borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent",
              transition: "color .1s, border-color .1s",
              textTransform: "capitalize",
            }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* ════ OVERVIEW TAB ════ */}
        {tab === "overview" && (
          <>
            {/* Lead pipeline chart */}
            {chartData.length > 0 && (
              <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
                <SectionLabel>Lead Pipeline</SectionLabel>
                <div style={{ height: 180, width: "100%" }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 10, top: 4, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                      <XAxis type="number" tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fontWeight: 500, fill: "var(--text-secondary)" }} width={68} axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(v) => [`${v} leads`, "Count"]}
                        contentStyle={{ fontSize: 11, borderRadius: 8, borderColor: "var(--border)", background: "var(--surface)" }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Performance stats */}
            <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
              <SectionLabel>Performance</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {[
                  { label: "Conversion Rate", value: `${rep.conversionRate}%`, pct: rep.conversionRate, color: convColor(rep.conversionRate) },
                  { label: "Won This Month",  value: `${rep.wonThisMonth}`,    pct: (rep.wonThisMonth / 15) * 100, color: "var(--success)" },
                  { label: "Leads Assigned",  value: `${rep.leadsAssigned}`,  pct: (rep.leadsAssigned / 40) * 100, color: "var(--info)" },
                  { label: "Calls Today",     value: `${rep.callsToday}`,     pct: (rep.callsToday / 30) * 100, color: "var(--accent)" },
                ].map(s => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "var(--text-secondary)", minWidth: 110 }}>{s.label}</span>
                    <div style={{ flex: 1, height: 5, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(s.pct, 100)}%`, background: s.color, borderRadius: 99, transition: "width .5s" }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: s.color, minWidth: 28, textAlign: "right" }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coaching action progress summary */}
            <div style={{ padding: "12px 14px" }}>
              <SectionLabel>Coaching Progress</SectionLabel>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--surface-2)", borderRadius: 9, border: "1px solid var(--border)" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: doneActions === rep.coachingActions.length && rep.coachingActions.length > 0 ? "var(--success-light)" : "var(--surface-3)", border: `2px solid ${doneActions === rep.coachingActions.length && rep.coachingActions.length > 0 ? "var(--success)" : "var(--border-strong)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: doneActions === rep.coachingActions.length && rep.coachingActions.length > 0 ? "var(--success)" : "var(--text-secondary)" }}>
                    {doneActions}/{rep.coachingActions.length}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                    {doneActions === rep.coachingActions.length && rep.coachingActions.length > 0 ? "All actions complete!" : `${rep.coachingActions.length - doneActions} action${rep.coachingActions.length - doneActions !== 1 ? "s" : ""} pending`}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "2px 0 0" }}>
                    Switch to Coaching tab to manage
                  </p>
                </div>
                <button onClick={() => setTab("coaching")} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--accent)", display: "flex" }}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* ════ COACHING TAB ════ */}
        {tab === "coaching" && (
          <div style={{ padding: "14px" }}>

            {/* ─ Manager Notes ─ */}
            <SectionLabel>Manager Notes</SectionLabel>

            {/* Pinned notes */}
            {pinnedNotes.map(note => (
              <NoteCard key={note.id} note={note}
                isEditing={editingNoteId === note.id}
                editText={editNoteText}
                onEditChange={setEditNoteText}
                onEditStart={() => { setEditingNoteId(note.id); setEditNoteText(note.text); }}
                onEditSave={saveEditNote}
                onEditCancel={() => setEditingNoteId(null)}
                onTogglePin={() => togglePinNote(note.id)}
                onDelete={() => deleteNote(note.id)}
              />
            ))}
            {regularNotes.map(note => (
              <NoteCard key={note.id} note={note}
                isEditing={editingNoteId === note.id}
                editText={editNoteText}
                onEditChange={setEditNoteText}
                onEditStart={() => { setEditingNoteId(note.id); setEditNoteText(note.text); }}
                onEditSave={saveEditNote}
                onEditCancel={() => setEditingNoteId(null)}
                onTogglePin={() => togglePinNote(note.id)}
                onDelete={() => deleteNote(note.id)}
              />
            ))}
            {rep.managerNotes.length === 0 && (
              <p style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic", marginBottom: 8 }}>No notes yet.</p>
            )}

            {/* Add note */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: 10, background: "var(--surface-2)", borderRadius: 9, border: "1px dashed var(--border-strong)", marginBottom: 4 }}>
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                onKeyDown={e => e.key === "Enter" && e.metaKey && addNote()}
                placeholder="Add a manager note… (⌘+Enter to save)"
                rows={2}
                style={{ fontSize: 12, padding: "6px 8px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-primary)", resize: "none", outline: "none", lineHeight: 1.5, width: "100%", boxSizing: "border-box" }}
              />
              <button onClick={addNote} disabled={!newNote.trim()}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  padding: "7px 12px", borderRadius: 7, fontSize: 11, fontWeight: 700, border: "none", cursor: newNote.trim() ? "pointer" : "not-allowed",
                  background: noteAdded ? "var(--success-light)" : newNote.trim() ? "var(--text-primary)" : "var(--surface-3)",
                  color: noteAdded ? "var(--success)" : newNote.trim() ? "#fff" : "var(--text-muted)",
                  transition: "all .15s",
                }}>
                {noteAdded ? <><CheckCircle2 size={12} />Note Saved</> : <><Plus size={12} />Add Note</>}
              </button>
            </div>

            <Divider />

            {/* ─ Coaching Actions ─ */}
            <SectionLabel>Coaching Actions ({doneActions}/{rep.coachingActions.length} done)</SectionLabel>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
              {rep.coachingActions.map(action => (
                <div key={action.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "9px 10px", borderRadius: 8, background: action.done ? "var(--success-light)" : "var(--surface-2)", border: `1px solid ${action.done ? "var(--success-border)" : "var(--border)"}`, transition: "all .15s" }}>
                  <button onClick={() => toggleAction(action.id)} style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0, marginTop: 1, display: "flex" }}>
                    {action.done
                      ? <CheckCircle2 size={15} style={{ color: "var(--success)" }} />
                      : <div style={{ width: 15, height: 15, borderRadius: "50%", border: "1.5px solid var(--border-strong)" }} />
                    }
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: action.done ? "var(--success)" : "var(--text-primary)", margin: 0, textDecoration: action.done ? "line-through" : "none", lineHeight: 1.4 }}>
                      {action.label}
                    </p>
                    {action.dueDate && (
                      <p style={{ fontSize: 10, color: "var(--text-muted)", margin: "2px 0 0", display: "flex", alignItems: "center", gap: 3 }}>
                        <CalendarDays size={9} /> Due {action.dueDate}
                      </p>
                    )}
                  </div>
                  <button onClick={() => deleteAction(action.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", flexShrink: 0, display: "flex", padding: 0, opacity: 0.6 }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "0.6"}>
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add action */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: 10, background: "var(--surface-2)", borderRadius: 9, border: "1px dashed var(--border-strong)", marginBottom: 4 }}>
              <input
                value={newAction}
                onChange={e => setNewAction(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addAction()}
                placeholder="New coaching action…"
                style={{ fontSize: 12, padding: "7px 9px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-primary)", outline: "none", width: "100%", boxSizing: "border-box" }}
              />
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  type="date"
                  value={newActionDue}
                  onChange={e => setNewActionDue(e.target.value)}
                  style={{ flex: 1, fontSize: 11, padding: "6px 8px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-secondary)", outline: "none" }}
                />
                <button onClick={addAction} disabled={!newAction.trim()}
                  style={{
                    display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 7, fontSize: 11, fontWeight: 700, border: "none",
                    cursor: newAction.trim() ? "pointer" : "not-allowed", flexShrink: 0,
                    background: actionAdded ? "var(--success-light)" : newAction.trim() ? "var(--text-primary)" : "var(--surface-3)",
                    color: actionAdded ? "var(--success)" : newAction.trim() ? "#fff" : "var(--text-muted)",
                    transition: "all .15s",
                  }}>
                  {actionAdded ? <CheckCircle2 size={11} /> : <Plus size={11} />}
                  {actionAdded ? "Added" : "Add"}
                </button>
              </div>
            </div>

            <Divider />

            {/* ─ Quick actions ─ */}
            <SectionLabel>Quick Actions</SectionLabel>
            {[
              { icon: <MessageSquare size={11} />, label: "Send coaching message", color: "var(--info)",    bg: "var(--info-light)",    border: "var(--info-border)" },
              { icon: <Phone size={11} />,         label: "Schedule 1:1 call",    color: "var(--success)", bg: "var(--success-light)", border: "var(--success-border)" },
              { icon: <BarChart2 size={11} />,     label: "View full lead table",  color: "var(--text-secondary)", bg: "var(--surface-2)", border: "var(--border)" },
            ].map(({ icon, label, color, bg, border }) => (
              <button key={label} onClick={() => alert(`${label} for ${rep.name}`)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, marginBottom: 6, background: bg, border: `1px solid ${border}`, color, fontSize: 12, fontWeight: 600, cursor: "pointer", textAlign: "left", transition: "opacity .12s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.8"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}>
                {icon}{label}
                <ChevronRight size={10} style={{ marginLeft: "auto" }} />
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── NoteCard sub-component ───────────────────────────────────────
function NoteCard({ note, isEditing, editText, onEditChange, onEditStart, onEditSave, onEditCancel, onTogglePin, onDelete }: {
  note: { id: string; text: string; date: string; pinned?: boolean };
  isEditing: boolean;
  editText: string;
  onEditChange: (v: string) => void;
  onEditStart: () => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
}) {
  return (
    <div style={{ marginBottom: 6, padding: "9px 11px", borderRadius: 8, background: note.pinned ? "var(--warning-light)" : "var(--surface-2)", border: `1px solid ${note.pinned ? "var(--warning-border)" : "var(--border)"}`, transition: "all .15s" }}>
      {isEditing ? (
        <>
          <textarea
            value={editText}
            onChange={e => onEditChange(e.target.value)}
            rows={3}
            autoFocus
            style={{ fontSize: 12, padding: "5px 7px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-primary)", resize: "none", outline: "none", lineHeight: 1.5, width: "100%", boxSizing: "border-box", marginBottom: 6 }}
          />
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={onEditSave} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", background: "var(--text-primary)", color: "#fff" }}>
              <Save size={11} /> Save
            </button>
            <button onClick={onEditCancel} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text-secondary)", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 4 }}>
            {note.pinned && <AlertTriangle size={10} style={{ color: "var(--warning)", flexShrink: 0, marginTop: 2 }} />}
            <p style={{ fontSize: 12, color: "var(--text-primary)", lineHeight: 1.5, margin: 0, flex: 1 }}>{note.text}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{note.date}</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={onTogglePin} title={note.pinned ? "Unpin" : "Pin"} style={{ background: "none", border: "none", cursor: "pointer", color: note.pinned ? "var(--warning)" : "var(--text-muted)", display: "flex", padding: 0 }}>
                <Star size={11} fill={note.pinned ? "var(--warning)" : "none"} />
              </button>
              <button onClick={onEditStart} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 0 }}>
                <Edit3 size={11} />
              </button>
              <button onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", display: "flex", padding: 0, opacity: 0.6 }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "0.6"}>
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}