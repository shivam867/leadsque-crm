"use client";
import { useState } from "react";
import type { Lead, LeadStatus } from "@/data/dummy";
import {
  ArrowLeft, Phone, Mail, MapPin, Calendar, User, Sparkles,
  Check, Activity, LayoutGrid, Brain, ExternalLink, Zap, Target,
  ChevronRight, Copy, Clock, Languages, Shield, Swords,
} from "lucide-react";

const STAGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  New: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  Contacted: { bg: "#F8FAFC", text: "#475569", border: "#CBD5E1" },
  Interested: { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  "Follow-up": { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
  Qualified: { bg: "#FAF5FF", text: "#7E22CE", border: "#DDD6FE" },
  Won: { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" },
  Lost: { bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3" },
  Spam: { bg: "#F9FAFB", text: "#6B7280", border: "#E5E7EB" },
};
const SCORE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Hot: { bg: "#FFF1F2", text: "#BE123C", dot: "#F87171" },
  Warm: { bg: "#FFFBEB", text: "#B45309", dot: "#FCD34D" },
  Medium: { bg: "#FFFBEB", text: "#B45309", dot: "#FCD34D" },
  Cold: { bg: "#EFF6FF", text: "#1D4ED8", dot: "#93C5FD" },
};
const ACTIVITY_COLORS: Record<string, string> = {
  call: "#2563EB", note: "#D97706", status: "#7C3AED", followup: "#059669", email: "#0891B2",
};
const ACTIVITY_LABELS: Record<string, string> = {
  call: "Call", note: "Note", status: "Status change", followup: "Follow-up set", email: "Email",
};
const AVATAR_PALETTE = [
  { bg: "#EFF6FF", text: "#1D4ED8", ring: "#BFDBFE" },
  { bg: "#F0FDF4", text: "#15803D", ring: "#BBF7D0" },
  { bg: "#FFFBEB", text: "#B45309", ring: "#FDE68A" },
  { bg: "#FAF5FF", text: "#7E22CE", ring: "#DDD6FE" },
];

const KNOWN_LANGS = ["Hindi", "English", "Tamil", "Telugu", "Gujarati", "Marathi", "Bengali", "Malayalam", "Kannada", "Punjabi", "Odia"];
const LANG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Hindi: { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
  English: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  Tamil: { bg: "#FDF4FF", text: "#7E22CE", border: "#E9D5FF" },
  Telugu: { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" },
  Gujarati: { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
  Marathi: { bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3" },
  Malayalam: { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  default: { bg: "#F1F5F9", text: "#475569", border: "#CBD5E1" },
};
function extractLangBadges(pref: string): string[] {
  return KNOWN_LANGS.filter(l => pref.toLowerCase().includes(l.toLowerCase()));
}
function getLangColor(lang: string) {
  return LANG_COLORS[lang] ?? LANG_COLORS.default;
}

type Tab = "overview" | "activity";
function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2);
}
function getOpeningLine(lead: Lead): string {
  if (lead.aiSummary.suggestedOpeningLine) return lead.aiSummary.suggestedOpeningLine;
  if (lead.status === "Won") return `Hi ${lead.name.split(" ")[0]}! Welcome to Pinnacle IAS — excited to have you on board. Let's get your onboarding sorted today!`;
  if (lead.status === "Qualified") return `Hello ${lead.name.split(" ")[0]} ji, aapki seat confirm karne ke liye call kar raha/rahi hoon — aaj payment complete kar sakte hain?`;
  return `Hello ${lead.name.split(" ")[0]} ji! Main Pinnacle IAS se bol raha/rahi hoon — aapne recently hamare ${lead.service} ke baare mein inquiry ki thi, kya abhi 5 minute baat ho sakti hai?`;
}

export default function LeadFullPage({
  lead, onBack, onOpenCallIntelligence, avatarIndex = 0,
}: {
  lead: Lead; onBack: () => void; onOpenCallIntelligence: (lead: Lead) => void; avatarIndex?: number;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [currentStage] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [noteSaved, setNoteSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const palette = AVATAR_PALETTE[avatarIndex % AVATAR_PALETTE.length];
  const sc = STAGE_COLORS[currentStage] ?? STAGE_COLORS.Spam;
  const scorec = SCORE_COLORS[lead.score] ?? SCORE_COLORS.Cold;
  const ai = lead.aiSummary;
  const probColor = ai.dealProbability >= 70 ? "#059669" : ai.dealProbability >= 40 ? "#D97706" : "#DC2626";

  const saveNote = () => { lead.notes = notes; setNoteSaved(true); setTimeout(() => setNoteSaved(false), 1800); };
  const copyPhone = () => { navigator.clipboard.writeText(lead.phone); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const langBadges = ai.languagePreference ? extractLangBadges(ai.languagePreference) : [];
  const hasNewFields = !!(ai.competitorIntel || ai.handlingObjections || ai.languagePreference);

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)", display: "flex", flexDirection: "column" }}>

      {/* ── Nav Bar ── */}
      <div style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: "0.5px solid var(--border)", background: "var(--surface)", position: "sticky", top: 0, zIndex: 10, flexShrink: 0 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500, color: "#6B7280", background: "transparent", border: "none", cursor: "pointer", padding: "6px 10px", borderRadius: 8 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6B7280"; }}>
          <ArrowLeft size={14} strokeWidth={2} /> Back to Leads
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "monospace" }}>{lead.id}</span>
          <button onClick={() => onOpenCallIntelligence(lead)} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 8, cursor: "pointer", background: "#1D4ED8", color: "#fff", border: "none" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#1E40AF"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#1D4ED8"; }}>
            <Brain size={13} strokeWidth={2} /> Call Intelligence <ExternalLink size={11} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* ── Hero ── */}
        <div style={{ padding: "24px 24px 0", background: "var(--surface)", borderBottom: "0.5px solid var(--border)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>

            {/* Avatar + name row */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0, background: palette.bg, border: `0.5px solid ${palette.ring}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, color: palette.text }}>
                {getInitials(lead.name)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                  <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{lead.name}</h1>
                  <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 20, background: sc.bg, color: sc.text, border: `0.5px solid ${sc.border}` }}>{currentStage}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 20, background: scorec.bg, color: scorec.text, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: scorec.dot }} />{lead.score}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <MetaItem icon={<MapPin size={12} />} text={lead.city} />
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <MetaItem icon={<Phone size={12} />} text={lead.phone} mono />
                    <button onClick={copyPhone} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, padding: "2px 6px", borderRadius: 5, cursor: "pointer", background: copied ? "#ECFDF5" : "var(--surface-2)", color: copied ? "#059669" : "#9CA3AF", border: `0.5px solid ${copied ? "#A7F3D0" : "var(--border)"}` }}>
                      {copied ? <Check size={9} strokeWidth={3} /> : <Copy size={9} strokeWidth={2} />}
                    </button>
                  </div>
                  {lead.email && <MetaItem icon={<Mail size={12} />} text={lead.email} />}
                  <MetaItem icon={<User size={12} />} text={`Assigned to ${lead.assignedTo}`} />
                  <MetaItem icon={<Calendar size={12} />} text={`Created ${lead.createdAt}`} />
                </div>
              </div>
              {/* Deal probability */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 18px", borderRadius: 14, background: "var(--surface-2)", border: "0.5px solid var(--border)", flexShrink: 0 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: probColor, lineHeight: 1 }}>{ai.dealProbability}%</span>
                <span style={{ fontSize: 9, color: "#9CA3AF", marginTop: 2, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Deal Probability</span>
                <div style={{ height: 3, background: "#E5E7EB", borderRadius: 99, overflow: "hidden", width: 72, marginTop: 8 }}>
                  <div style={{ height: "100%", width: `${ai.dealProbability}%`, background: probColor, borderRadius: 99 }} />
                </div>
              </div>
            </div>

            {/* ── Action Strip (3 columns, primary AI actions) ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", border: "0.5px solid var(--border)", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
              {/* Suggested Opening */}
              <div style={{ padding: "16px 20px", borderRight: "0.5px solid var(--border)", background: "#EFF6FF" }}>
                <ActionLabel icon={<Zap size={11} />} label="Suggested Opening" color="#2563EB" />
                <p style={{ fontSize: 13, color: "var(--text-secondary)", fontStyle: "italic", lineHeight: 1.65, margin: 0 }}>
                  &ldquo;{getOpeningLine(lead)}&rdquo;
                </p>
              </div>
              {/* Pre-Call Brief */}
              <div style={{ padding: "16px 20px", borderRight: "0.5px solid var(--border)", background: "#FFFBEB" }}>
                <ActionLabel icon={<Target size={11} />} label="Pre-Call Brief" color="#B45309" />
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{ai.summary}</p>
              </div>
              {/* Best Time to Call */}
              <div style={{ padding: "16px 20px", background: "#F0FDF4" }}>
                <ActionLabel icon={<Clock size={11} />} label="Best Time to Call" color="#059669" />
                <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px" }}>{ai.bestTimeToCall}</p>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 5, fontSize: 12, color: "#2563EB" }}>
                  <Sparkles size={10} strokeWidth={2} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ lineHeight: 1.5 }}>{ai.nextAction}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", borderBottom: "0.5px solid var(--border)", background: "var(--surface)", paddingLeft: 24 }}>
          {(["overview", "activity"] as Tab[]).map(t => {
            const isActive = tab === t;
            const icons: Record<Tab, React.ReactNode> = { overview: <LayoutGrid size={13} />, activity: <Activity size={13} /> };
            const labels: Record<Tab, string> = { overview: "Overview", activity: "Activity" };
            return (
              <button key={t} onClick={() => setTab(t)} style={{ padding: "10px 16px", fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? "#2563EB" : "#9CA3AF", background: "transparent", cursor: "pointer", border: "none", borderBottom: `2px solid ${isActive ? "#2563EB" : "transparent"}`, display: "flex", alignItems: "center", gap: 6 }}>
                {icons[t]}{labels[t]}
              </button>
            );
          })}
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "20px 24px 32px", boxSizing: "border-box" as const }}>

          {tab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* ── Intel cards row (only if any exist) ── */}
              {hasNewFields && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                  {ai.competitorIntel && (
                    <IntelCard icon={<Swords size={12} />} label="Competitor Intel" color="#4F46E5">
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{ai.competitorIntel}</p>
                    </IntelCard>
                  )}
                  {ai.handlingObjections && (
                    <IntelCard icon={<Shield size={12} />} label="Handling Objections" color="#0369A1">
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0 }}>{ai.handlingObjections}</p>
                    </IntelCard>
                  )}
                  {ai.languagePreference && (
                    <IntelCard icon={<Languages size={12} />} label="Language Preference" color="#0369A1">
                      <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>Comfortable communicating in:</p>
                      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                        {langBadges.length > 0
                          ? langBadges.map((lang, i) => {
                            const lc = getLangColor(lang);
                            return <span key={i} style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: lc.bg, color: lc.text, border: `0.5px solid ${lc.border}` }}>{lang}</span>;
                          })
                          : <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{ai.languagePreference}</span>
                        }
                      </div>
                    </IntelCard>
                  )}
                </div>
              )}

              {/* ── Details + AI key points ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                {/* Left 2/3: contact + enquiry */}
                <div style={{ gridColumn: "1 / 3", display: "flex", flexDirection: "column", gap: 14 }}>
                  <SectionCard title="Contact Details">
                    <InfoRow label="Phone" value={lead.phone} mono />
                    <InfoRow label="Email" value={lead.email ?? "—"} />
                    <InfoRow label="City" value={lead.city} />
                    <InfoRow label="Source" value={lead.source} />
                    <InfoRow label="Assigned" value={lead.assignedTo} />
                  </SectionCard>
                  <SectionCard title="Enquiry Details">
                    <InfoRow label="Course" value={lead.service} />
                    <InfoRow label="Priority" value={lead.priority} />
                    <InfoRow label="Created" value={lead.createdAt} />
                    {lead.followUpDate && <InfoRow label="Follow-up" value={lead.followUpDate} highlight />}
                  </SectionCard>
                  {/* Notes */}
                  <div style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "14px 16px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "#6B7280", marginBottom: 10, marginTop: 0 }}>Notes</p>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={5} placeholder="Add a note…"
                      style={{ width: "100%", fontSize: 13, borderRadius: 8, padding: "10px 12px", resize: "vertical" as const, lineHeight: 1.6, boxSizing: "border-box" as const, background: "var(--surface)", border: `0.5px solid ${noteSaved ? "#A7F3D0" : "var(--border-strong)"}`, color: "var(--text-primary)", outline: "none" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "#BFDBFE")}
                      onBlur={e => (e.currentTarget.style.borderColor = noteSaved ? "#A7F3D0" : "var(--border-strong)")} />
                    <button onClick={saveNote} style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "7px 14px", borderRadius: 8, fontWeight: 500, background: noteSaved ? "#ECFDF5" : "var(--surface)", color: noteSaved ? "#065F46" : "var(--text-secondary)", border: `0.5px solid ${noteSaved ? "#A7F3D0" : "var(--border-strong)"}`, cursor: "pointer" }}>
                      {noteSaved && <Check size={12} strokeWidth={2.5} />}
                      {noteSaved ? "Saved!" : "Save note"}
                    </button>
                  </div>
                </div>

                {/* Right 1/3: AI key points */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "14px 16px", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "#6B7280", margin: 0 }}>AI Key Points</p>
                      <Sparkles size={13} style={{ color: "#2563EB" }} />
                    </div>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 9 }}>
                      {ai.keyPoints.map((pt, i) => (
                        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                          <span style={{ width: 18, height: 18, borderRadius: 5, background: "#EFF6FF", color: "#2563EB", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                          <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => onOpenCallIntelligence(lead)}
                      style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, cursor: "pointer", background: "var(--surface)", border: "0.5px solid var(--border)", color: "var(--text-primary)", fontSize: 12, fontWeight: 500, width: "100%" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#EFF6FF"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--surface)"; }}>
                      <Brain size={15} style={{ color: "#2563EB" }} />
                      <div style={{ textAlign: "left" as const, flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Full Call Intelligence</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>Transcript · Tags · Coaching</p>
                      </div>
                      <ChevronRight size={14} style={{ color: "#9CA3AF" }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Activity Tab ── */}
          {tab === "activity" && (
            <div style={{ maxWidth: 640 }}>
              {lead.activity.length === 0
                ? <div style={{ padding: "64px 0", textAlign: "center" as const, fontSize: 13, color: "#9CA3AF" }}>No activity recorded yet.</div>
                : (
                  <ol style={{ position: "relative" as const, borderLeft: "1.5px solid var(--border)", marginLeft: 8, padding: 0, listStyle: "none" }}>
                    {lead.activity.map((item, i) => {
                      const color = ACTIVITY_COLORS[item.type] ?? "#374151";
                      return (
                        <li key={i} style={{ position: "relative" as const, paddingBottom: 24, paddingLeft: 24 }}>
                          <span style={{ position: "absolute" as const, left: -5, top: 4, width: 10, height: 10, borderRadius: "50%", background: color, border: "2px solid var(--surface)" }} />
                          <p style={{ fontSize: 11, fontWeight: 600, color, marginBottom: 2 }}>{ACTIVITY_LABELS[item.type] ?? item.type}</p>
                          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 3 }}>{item.text}</p>
                          <p style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "monospace" }}>{item.time}</p>
                        </li>
                      );
                    })}
                  </ol>
                )
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Primitives ────────────────────────────────────────────────────
function ActionLabel({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
      <span style={{ color }}>{icon}</span>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color }}>{label}</span>
    </div>
  );
}
function IntelCard({ icon, label, color, children }: { icon: React.ReactNode; label: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
        <span style={{ color }}>{icon}</span>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color }}>{label}</span>
      </div>
      {children}
    </div>
  );
}
function MetaItem({ icon, text, mono }: { icon: React.ReactNode; text: string; mono?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6B7280" }}>
      <span style={{ color: "#9CA3AF" }}>{icon}</span>
      <span style={{ fontFamily: mono ? "monospace" : undefined, fontSize: mono ? 12 : undefined }}>{text}</span>
    </div>
  );
}
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", borderBottom: "0.5px solid var(--border)" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "#6B7280", margin: 0 }}>{title}</p>
      </div>
      {children}
    </div>
  );
}
function InfoRow({ label, value, mono, highlight }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", borderBottom: "0.5px solid var(--border)", background: "var(--surface)" }}>
      <span style={{ fontSize: 13, color: "#6B7280" }}>{label}</span>
      <span style={{ fontSize: 13, color: highlight ? "#2563EB" : "var(--text-secondary)", fontFamily: mono ? "monospace" : undefined, fontWeight: highlight ? 600 : 400 }}>{value}</span>
    </div>
  );
}