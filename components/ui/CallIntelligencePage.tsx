"use client";
import { useState } from "react";
import type { Lead } from "@/data/dummy";
import {
  ArrowLeft, Brain, Tag, Mic, Zap, Target, Clock,
  User, Users, AlertCircle, CheckCircle2,
  XCircle, BarChart2, ChevronDown, ChevronUp,
  Sparkles, PhoneCall, TrendingUp,
} from "lucide-react";

// ── Color maps ──────────────────────────────────────────────────
const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "EMI MENTIONED":         { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
  "PRICING":               { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  "COMPETITOR MENTIONED":  { bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3" },
  "EXTERNAL DEPENDENCIES": { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  "FOLLOW-UP REQUIRED":    { bg: "#FAF5FF", text: "#7E22CE", border: "#DDD6FE" },
  "DEMO REQUESTED":        { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" },
};
const SIGNAL_COLORS: Record<"high" | "medium" | "low", { bg: string; text: string; border: string }> = {
  high:   { bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3" },
  medium: { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
  low:    { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
};

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2);
}
function getStructuralTags(lead: Lead): string[] {
  const tags: string[] = [];
  const all = [lead.notes, ...lead.conversation.map(m => m.text), lead.aiSummary.summary].join(" ").toLowerCase();
  if (all.includes("emi") || all.includes("installment")) tags.push("EMI MENTIONED");
  if (all.includes("₹") || all.includes("fee") || all.includes("budget") || all.includes("price")) tags.push("PRICING");
  if (all.includes("vajiram") || all.includes("chanakya") || all.includes("studyiq") || all.includes("competitor")) tags.push("COMPETITOR MENTIONED");
  if (all.includes("parent") || all.includes("papa") || all.includes("father") || all.includes("mother")) tags.push("EXTERNAL DEPENDENCIES");
  if (lead.followUpDate) tags.push("FOLLOW-UP REQUIRED");
  if (all.includes("demo") || all.includes("free session") || all.includes("counseling")) tags.push("DEMO REQUESTED");
  return tags.length > 0 ? tags : ["PRICING", "FOLLOW-UP REQUIRED"];
}
function getEmotionalSignals(lead: Lead): { label: string; level: "high" | "medium" | "low" }[] {
  const signals: { label: string; level: "high" | "medium" | "low" }[] = [];
  const all = [lead.notes, lead.aiSummary.summary].join(" ").toLowerCase();
  if (lead.aiSummary.sentiment === "Positive") signals.push({ label: "High Interest", level: "high" });
  if (all.includes("budget") || all.includes("expensive") || lead.score === "Cold") signals.push({ label: "Price Sensitivity", level: "medium" });
  if (all.includes("hesit") || all.includes("confusion") || all.includes("unclear")) signals.push({ label: "Hesitation", level: "medium" });
  if (all.includes("urgent") || all.includes("june 1") || all.includes("asap")) signals.push({ label: "Time Urgency", level: "high" });
  if (signals.length === 0) signals.push({ label: "Neutral Interest", level: "low" });
  return signals;
}
function getTalkRatio(lead: Lead): { rep: number; client: number } {
  const r = lead.conversation.filter(m => m.sender === "rep").length;
  const c = lead.conversation.filter(m => m.sender === "client").length;
  const t = r + c || 1;
  return { rep: Math.round((r / t) * 100), client: Math.round((c / t) * 100) };
}
function getParentInsights(lead: Lead): string[] {
  const insights: string[] = [];
  const all = [lead.notes, ...lead.conversation.map(m => m.text)].join(" ").toLowerCase();
  if (all.includes("parent") || all.includes("papa") || all.includes("father") || all.includes("mother")) insights.push("Parental involvement is a factor in the decision");
  if (all.includes("budget") || all.includes("fee") || all.includes("₹")) insights.push("Concern about pricing/fee structure expressed");
  if (all.includes("hostel") || all.includes("relocation") || all.includes("delhi shift")) insights.push("Logistical concerns about relocation or study location");
  if (all.includes("vajiram") || all.includes("chanakya") || all.includes("studyiq")) insights.push("Comparing with competitor institutes — needs differentiation");
  if (insights.length === 0) {
    insights.push("No parental hesitations detected in current conversation");
    insights.push("Student appears to be an independent decision maker");
  }
  return insights;
}
function getSuggestedOpening(lead: Lead): string {
  const name = lead.name.split(" ")[0];
  if (lead.status === "Won") return `Hi ${name}! Really glad you joined Pinnacle IAS. Let's get your onboarding complete today!`;
  if (lead.status === "Qualified") return `Hi ${name} ji, main aapki enrollment confirm karne ke liye call kar raha/rahi hoon — kya aaj payment complete kar sakte hain?`;
  if (lead.aiSummary.dealProbability >= 70) return `Hello ${name} ji, aapne recently hamare ${lead.service} mein interest dikhaya tha — main aaj ek quick follow-up ke liye call kar raha/rahi hoon!`;
  return `Hi ${name}, I'm excited to discuss how we can support your ${lead.service} preparation journey!`;
}

// ── Card & Section primitives ────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "var(--surface)", border: "0.5px solid var(--border)",
      borderRadius: 14, padding: "18px 20px",
      display: "flex", flexDirection: "column", ...style,
    }}>
      {children}
    </div>
  );
}
function SectionLabel({ icon, label, badge, accentColor }: {
  icon: React.ReactNode; label: string; badge?: string; accentColor?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
      <span style={{ color: accentColor ?? "#6B7280" }}>{icon}</span>
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: accentColor ?? "#6B7280" }}>
        {label}
      </span>
      {badge && (
        <span style={{
          marginLeft: 6, fontSize: 10, padding: "2px 8px", borderRadius: 20,
          background: "#EFF6FF", color: "#2563EB", border: "0.5px solid #BFDBFE", fontWeight: 600,
        }}>
          {badge}
        </span>
      )}
    </div>
  );
}

export default function CallIntelligencePage({ lead, onBack }: { lead: Lead; onBack: () => void }) {
  const [transcriptExpanded, setTranscriptExpanded] = useState(false);
  const tags = getStructuralTags(lead);
  const signals = getEmotionalSignals(lead);
  const talkRatio = getTalkRatio(lead);
  const parentInsights = getParentInsights(lead);
  const ai = lead.aiSummary;

  const probColor = ai.dealProbability >= 70 ? "#059669" : ai.dealProbability >= 40 ? "#D97706" : "#DC2626";

  const counselorStrengths = [
    "Clearly explained course structure and pricing",
    "Acknowledged the student's background and tailored pitch",
    "Offered follow-up at a confirmed specific time",
  ];
  const counselorImprovements = [
    "Could allow more space for student questions",
    "Talk ratio is Rep-heavy — practice active listening",
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)", display: "flex", flexDirection: "column" }}>

      {/* ── Nav ── */}
      <div style={{
        height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", borderBottom: "0.5px solid var(--border)",
        background: "var(--surface)", position: "sticky", top: 0, zIndex: 10, flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500,
          color: "#6B7280", background: "transparent", border: "none", cursor: "pointer",
          padding: "6px 10px", borderRadius: 8,
        }}>
          <ArrowLeft size={14} strokeWidth={2} /> Back to Lead
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Brain size={16} style={{ color: "#2563EB" }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Call Intelligence</span>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "6px 14px",
          borderRadius: 8, background: "var(--surface-2)", border: "0.5px solid var(--border)",
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7, background: "#EFF6FF",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, color: "#1D4ED8",
          }}>
            {getInitials(lead.name)}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{lead.name}</span>
          <span style={{ color: "#9CA3AF", fontFamily: "monospace", fontSize: 11 }}>— {lead.phone}</span>
        </div>
      </div>

      {/* ── Subtitle ── */}
      <div style={{ padding: "10px 32px", borderBottom: "0.5px solid var(--border)", background: "var(--surface-2)" }}>
        <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>
          Behavioral coaching · Structural tags · Emotional signals · Speaker-clarified transcript
        </p>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, padding: "28px 32px", maxWidth: 1280, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>

          {/* ══════════════════ LEFT COLUMN ══════════════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* 1. Pre-Call Brief */}
            <Card style={{ background: "#EFF6FF", border: "0.5px solid #BFDBFE" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                <Sparkles size={14} style={{ color: "#1D4ED8" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1D4ED8" }}>Pre-Call Brief · AI Generated</span>
                <span style={{
                  marginLeft: "auto", fontSize: 11, fontWeight: 700,
                  padding: "3px 10px", borderRadius: 20,
                  background: ai.dealProbability >= 70 ? "#ECFDF5" : ai.dealProbability >= 40 ? "#FFFBEB" : "#FFF1F2",
                  color: ai.dealProbability >= 70 ? "#065F46" : ai.dealProbability >= 40 ? "#B45309" : "#BE123C",
                }}>
                  {ai.dealProbability >= 70 ? "HIGH URGENCY" : ai.dealProbability >= 40 ? "MEDIUM URGENCY" : "LOW URGENCY"}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "11px 13px" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#1D4ED8", margin: "0 0 5px" }}>EMOTIONAL STATE</p>
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: "3px 8px", borderRadius: 20,
                    background: ai.sentiment === "Positive" ? "#ECFDF5" : ai.sentiment === "Negative" ? "#FFF1F2" : "#FFFBEB",
                    color: ai.sentiment === "Positive" ? "#065F46" : ai.sentiment === "Negative" ? "#BE123C" : "#B45309",
                  }}>
                    {ai.sentiment === "Positive" ? "Highly Interested" : ai.sentiment === "Negative" ? "Disengaged" : "Somewhat Interested"}
                  </span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "11px 13px" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#1D4ED8", margin: "0 0 5px" }}>DEAL PROBABILITY</p>
                  <span style={{ fontSize: 22, fontWeight: 800, color: probColor }}>{ai.dealProbability}%</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "11px 13px" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#1D4ED8", margin: "0 0 5px" }}>LANGUAGE PREF</p>
                  <span style={{ fontSize: 12, color: "#1E3A8A", fontWeight: 500 }}>Hindi-English</span>
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#2563EB", margin: "0 0 6px" }}>SUGGESTED OPENING LINE</p>
                <p style={{ fontSize: 13, color: "#1E3A8A", lineHeight: 1.6, margin: 0, fontStyle: "italic", fontWeight: 500 }}>
                  &ldquo;{getSuggestedOpening(lead)}&rdquo;
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#1E3A8A" }}>
                <Clock size={12} />
                <span><strong>Best Time to Call:</strong> {ai.bestTimeToCall}</span>
              </div>
            </Card>

            {/* 2. Structural Tags + Emotional Signals */}
            <Card>
              <SectionLabel icon={<Tag size={13} />} label="Structural Tags Detected" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                {tags.map(tag => {
                  const c = TAG_COLORS[tag] ?? { bg: "#F9FAFB", text: "#6B7280", border: "#E5E7EB" };
                  return (
                    <span key={tag} style={{
                      fontSize: 11, fontWeight: 600, padding: "5px 11px", borderRadius: 6,
                      background: c.bg, color: c.text, border: `0.5px solid ${c.border}`,
                      letterSpacing: "0.04em",
                    }}>
                      {tag}
                    </span>
                  );
                })}
              </div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#9CA3AF", margin: "0 0 8px" }}>
                Emotional Signals
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {signals.map(s => {
                  const c = SIGNAL_COLORS[s.level];
                  return (
                    <span key={s.label} style={{
                      fontSize: 11, fontWeight: 600, padding: "5px 11px", borderRadius: 6,
                      background: c.bg, color: c.text, border: `0.5px solid ${c.border}`,
                      display: "flex", alignItems: "center", gap: 5,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.text }} />
                      {s.label}
                    </span>
                  );
                })}
              </div>
            </Card>

            {/* 3. Counselor + Parent — side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Card>
                <SectionLabel icon={<BarChart2 size={13} />} label="Counselor Analysis" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  <div style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#9CA3AF", margin: "0 0 4px" }}>Tone</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#D97706", margin: 0 }}>Informative but pushy</p>
                  </div>
                  <div style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#9CA3AF", margin: "0 0 6px" }}>Talk Ratio</p>
                    <div style={{ height: 5, background: "#E5E7EB", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${talkRatio.rep}%`, background: "#2563EB", borderRadius: 99 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                      <span style={{ fontSize: 10, color: "#2563EB", fontWeight: 600 }}>{talkRatio.rep}% Rep</span>
                      <span style={{ fontSize: 10, color: "#6B7280", fontWeight: 600 }}>{talkRatio.client}% Lead</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#059669", margin: "0 0 8px" }}>Strengths</p>
                {counselorStrengths.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 6 }}>
                    <CheckCircle2 size={13} style={{ color: "#059669", marginTop: 1, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#DC2626", margin: "12px 0 8px" }}>Areas to Improve</p>
                {counselorImprovements.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 6 }}>
                    <XCircle size={13} style={{ color: "#DC2626", marginTop: 1, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </Card>

              <Card>
                <SectionLabel icon={<Users size={13} />} label="Parent & Hesitations" />
                <div style={{ display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
                  {parentInsights.map((pt, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#2563EB", flexShrink: 0, marginTop: 6 }} />
                      <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>{pt}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "0.5px solid var(--border)", paddingTop: 12, marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, letterSpacing: "0.04em" }}>SIGNALS DETECTED</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#2563EB", background: "#EFF6FF", padding: "3px 10px", borderRadius: 20, border: "0.5px solid #BFDBFE" }}>
                    {parentInsights.length}
                  </span>
                </div>
              </Card>
            </div>

            {/* 4. Transcript — collapsed by default */}
            <Card>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: transcriptExpanded ? 16 : 0 }}>
                <SectionLabel icon={<Mic size={13} />} label="Call Transcript" badge="Speaker-clarified" />
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, color: "#9CA3AF" }}>{lead.conversation.length} turns</span>
                  <button
                    onClick={() => setTranscriptExpanded(v => !v)}
                    style={{
                      display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 500,
                      color: transcriptExpanded ? "#1D4ED8" : "#6B7280",
                      background: transcriptExpanded ? "#EFF6FF" : "var(--surface-2)",
                      border: `0.5px solid ${transcriptExpanded ? "#BFDBFE" : "var(--border-strong)"}`,
                      borderRadius: 7, cursor: "pointer", padding: "5px 10px",
                      transition: "all 0.15s",
                    }}
                  >
                    {transcriptExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {transcriptExpanded ? "Collapse" : "Show Transcript"}
                  </button>
                </div>
              </div>

              {!transcriptExpanded && (
                <div style={{
                  padding: "10px 14px", borderRadius: 9, background: "var(--surface-2)",
                  border: "0.5px solid var(--border)", fontSize: 12, color: "#6B7280",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <Mic size={12} style={{ flexShrink: 0 }} />
                  <span>
                    {lead.conversation.length === 0
                      ? "No transcript available for this lead."
                      : `${lead.conversation.length} turns recorded — click "Show Transcript" to expand.`
                    }
                  </span>
                </div>
              )}

              {transcriptExpanded && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 520, overflowY: "auto", paddingRight: 4 }}>
                  {lead.conversation.length === 0 ? (
                    <p style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center", padding: "32px 0" }}>
                      No call transcript available for this lead yet.
                    </p>
                  ) : lead.conversation.map((msg, i) => {
                    const isRep = msg.sender === "rep";
                    return (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                          background: isRep ? "#EFF6FF" : "#F9FAFB",
                          border: `0.5px solid ${isRep ? "#BFDBFE" : "#E5E7EB"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 9, fontWeight: 700, color: isRep ? "#1D4ED8" : "#6B7280",
                        }}>
                          {getInitials(msg.name)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: isRep ? "#1D4ED8" : "#374151" }}>
                              {isRep ? "Counselor" : "Parent / Student"}
                            </span>
                            <span style={{ fontSize: 10, color: "#9CA3AF" }}>{msg.time}</span>
                          </div>
                          <div style={{
                            fontSize: 13, lineHeight: 1.6, padding: "9px 13px", borderRadius: 10,
                            background: isRep ? "var(--surface-2)" : "var(--surface)",
                            border: "0.5px solid var(--border)", color: "var(--text-primary)",
                          }}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* ══════════════════ RIGHT COLUMN ══════════════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Call Summary */}
            <Card>
              <SectionLabel icon={<PhoneCall size={13} />} label="Call Summary" />
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>{ai.summary}</p>
            </Card>

            {/* Action Items */}
            <Card>
              <SectionLabel icon={<CheckCircle2 size={13} />} label="Action Items" accentColor="#059669" />
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {ai.keyPoints.map((pt, i) => (
                  <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                      background: "#ECFDF5", color: "#059669", fontSize: 10, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>{pt}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommended Next Action */}
            <Card style={{ background: "#EFF6FF", border: "0.5px solid #BFDBFE" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <Target size={13} style={{ color: "#1D4ED8" }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#1D4ED8" }}>
                  Recommended Next Action
                </span>
              </div>
              <p style={{ fontSize: 13, color: "#1E3A8A", lineHeight: 1.6, margin: 0 }}>{ai.nextAction}</p>
            </Card>

            {/* Lead Context */}
            <Card>
              <SectionLabel icon={<User size={13} />} label="Lead Context" />
              <div style={{ borderRadius: 10, overflow: "hidden", border: "0.5px solid var(--border)" }}>
                {[
                  ["Lead Name",     lead.name],
                  ["Course",        lead.service],
                  ["City",          lead.city],
                  ["Lead Source",   lead.source],
                  ["Assigned To",   lead.assignedTo],
                  ["Lead Score",    lead.score],
                  ["Follow-up",     lead.followUpDate ?? "—"],
                ].map(([label, value]) => (
                  <div key={label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 12px", borderBottom: "0.5px solid var(--border)",
                    background: "var(--surface)",
                  }}>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{value}</span>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}