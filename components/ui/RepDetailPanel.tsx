"use client";
import { useState } from "react";
import {
  X, Phone, TrendingUp, TrendingDown, Target,
  Award, AlertTriangle, Mic, Headphones,
  ChevronRight, Star, Clock, Users,
  MessageSquare, BarChart2, Zap,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

// ─── Extended SalesRep type ───────────────────────────────────────

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
  talkRatio: number;
  avgCallDuration: number;
  callsThisMonth: number;
  responseTime: number;
  strengths: string[];
  weaknesses: string[];
  topObjectionHandled: string;
  recentActivity: { date: string; action: string; outcome: string }[];
  monthlyWonTrend: number[];
}

// ─── Extended dummy data ──────────────────────────────────────────

export const salesRepsExtended: SalesRepExtended[] = [
  {
    id: "rep-1", name: "Aanya Sharma", avatar: "AS", role: "rep", team: "Alpha",
    leadsAssigned: 28, callsToday: 18, conversionRate: 34, wonThisMonth: 8,
    talkRatio: 52, avgCallDuration: 7.4, callsThisMonth: 112, responseTime: 9,
    strengths: ["Strong rapport building", "Handles objections well", "High follow-up discipline"],
    weaknesses: ["Tends to over-explain pricing", "Slow to qualify cold leads"],
    topObjectionHandled: "Price too high",
    recentActivity: [
      { date: "Today", action: "Called Rajiv Malhotra", outcome: "Interested" },
      { date: "Today", action: "Followed up with Sneha Das", outcome: "Follow-up" },
      { date: "Yesterday", action: "Closed Deepak Joshi", outcome: "Won" },
    ],
    monthlyWonTrend: [5, 6, 7, 6, 8, 8],
  },
  {
    id: "rep-2", name: "Rohan Mehta", avatar: "RM", role: "rep", team: "Alpha",
    leadsAssigned: 31, callsToday: 22, conversionRate: 28, wonThisMonth: 9,
    talkRatio: 68, avgCallDuration: 9.1, callsThisMonth: 143, responseTime: 14,
    strengths: ["High call volume", "Great energy on calls", "Product knowledge depth"],
    weaknesses: ["Talks too much (68% talk ratio)", "Poor listening signals", "Misses follow-up timing"],
    topObjectionHandled: "Need to think about it",
    recentActivity: [
      { date: "Today", action: "Called Anita Rao", outcome: "No answer" },
      { date: "Today", action: "Closed Vikram Bose", outcome: "Won" },
      { date: "Yesterday", action: "Called Pradeep Kumar", outcome: "Interested" },
    ],
    monthlyWonTrend: [7, 8, 9, 8, 7, 9],
  },
  {
    id: "rep-3", name: "Priya Nair", avatar: "PN", role: "rep", team: "Beta",
    leadsAssigned: 19, callsToday: 14, conversionRate: 41, wonThisMonth: 8,
    talkRatio: 44, avgCallDuration: 6.2, callsThisMonth: 89, responseTime: 6,
    strengths: ["Best conversion rate on team", "Excellent listener", "Concise & confident pitch"],
    weaknesses: ["Lower call volume", "Avoids difficult prospects", "Needs more pipeline"],
    topObjectionHandled: "Already have a solution",
    recentActivity: [
      { date: "Today", action: "Closed Meera Pillai", outcome: "Won" },
      { date: "Today", action: "Called Suresh Iyer", outcome: "Qualified" },
      { date: "Yesterday", action: "Sent proposal to Ravi Nambiar", outcome: "Follow-up" },
    ],
    monthlyWonTrend: [4, 5, 6, 7, 7, 8],
  },
  {
    id: "rep-4", name: "Kabir Singh", avatar: "KS", role: "rep", team: "Beta",
    leadsAssigned: 27, callsToday: 20, conversionRate: 22, wonThisMonth: 6,
    talkRatio: 61, avgCallDuration: 11.3, callsThisMonth: 128, responseTime: 22,
    strengths: ["Builds long relationships", "Strong with enterprise leads"],
    weaknesses: ["Lowest conversion on team", "Very slow response time", "Talks too long on calls", "Poor cold lead qualify rate"],
    topObjectionHandled: "Timing isn't right",
    recentActivity: [
      { date: "Today", action: "Called Harsh Vardhan", outcome: "No answer" },
      { date: "Today", action: "Called Nidhi Arora", outcome: "Interested" },
      { date: "2 days ago", action: "Lost Tarun Bhatia", outcome: "Lost" },
    ],
    monthlyWonTrend: [8, 7, 6, 5, 5, 6],
  },
  {
    id: "rep-5", name: "Meera Iyer", avatar: "MI", role: "rep", team: "Gamma",
    leadsAssigned: 22, callsToday: 16, conversionRate: 36, wonThisMonth: 8,
    talkRatio: 49, avgCallDuration: 7.8, callsThisMonth: 101, responseTime: 8,
    strengths: ["Balanced talk-to-listen", "Fast response time", "Great discovery questions"],
    weaknesses: ["Struggles with final close", "Sometimes over-nurtures warm leads"],
    topObjectionHandled: "Budget constraints",
    recentActivity: [
      { date: "Today", action: "Qualified Pooja Shetty", outcome: "Qualified" },
      { date: "Today", action: "Called Arnav Shah", outcome: "Follow-up" },
      { date: "Yesterday", action: "Closed Divya Menon", outcome: "Won" },
    ],
    monthlyWonTrend: [5, 6, 7, 8, 7, 8],
  },
  {
    id: "rep-6", name: "Aryan Gupta", avatar: "AG", role: "rep", team: "Alpha",
    leadsAssigned: 18, callsToday: 12, conversionRate: 31, wonThisMonth: 6,
    talkRatio: 55, avgCallDuration: 8.3, callsThisMonth: 78, responseTime: 11,
    strengths: ["Solid objection handling", "Consistent conversion"],
    weaknesses: ["Lowest lead volume on team", "Needs to increase call cadence", "Slow to pick up new leads"],
    topObjectionHandled: "Comparing with competitors",
    recentActivity: [
      { date: "Today", action: "Called Ishaan Kapoor", outcome: "Interested" },
      { date: "Yesterday", action: "Closed Sakshi Verma", outcome: "Won" },
      { date: "2 days ago", action: "Called Riya Chatterjee", outcome: "No answer" },
    ],
    monthlyWonTrend: [4, 4, 5, 6, 6, 6],
  },
  {
    id: "rep-7", name: "Divya Reddy", avatar: "DR", role: "rep", team: "Gamma",
    leadsAssigned: 21, callsToday: 15, conversionRate: 38, wonThisMonth: 7,
    talkRatio: 47, avgCallDuration: 6.9, callsThisMonth: 96, responseTime: 7,
    strengths: ["Excellent listen ratio", "Quick to identify buying signals", "Strong closing rate"],
    weaknesses: ["Needs to expand lead funnel", "Occasionally undersells add-ons"],
    topObjectionHandled: "Not the right time",
    recentActivity: [
      { date: "Today", action: "Closed Kiran Raj", outcome: "Won" },
      { date: "Today", action: "Called Namita Hegde", outcome: "Qualified" },
      { date: "Yesterday", action: "Called Varun Nair", outcome: "Follow-up" },
    ],
    monthlyWonTrend: [4, 5, 6, 6, 7, 7],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────

const AVATAR_PALETTE = [
  { bg: "#EFF6FF", text: "#1D4ED8" },
  { bg: "#F0FDF4", text: "#15803D" },
  { bg: "#FFF7ED", text: "#C2410C" },
  { bg: "#F5F3FF", text: "#6D28D9" },
  { bg: "#FDF2F8", text: "#9D174D" },
  { bg: "#ECFDF5", text: "#065F46" },
  { bg: "#FFFBEB", text: "#92400E" },
];

function getRatioColor(talkRatio: number): { bar: string; label: string; text: string } {
  if (talkRatio <= 50) return { bar: "#059669", label: "Excellent", text: "#065F46" };
  if (talkRatio <= 58) return { bar: "#D97706", label: "Acceptable", text: "#92400E" };
  return { bar: "#DC2626", label: "Too high", text: "#991B1B" };
}

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ flex: 1, height: 6, borderRadius: 99, background: "var(--border)", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 99, transition: "width 0.6s ease" }} />
    </div>
  );
}

function SparkLine({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 80, h = 28, pad = 3;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline points={pts.join(" ")} fill="none" stroke="#0369A1" strokeWidth="1.5" strokeLinejoin="round" />
      {values.map((v, i) => {
        const x = pad + (i / (values.length - 1)) * (w - pad * 2);
        const y = h - pad - ((v - min) / range) * (h - pad * 2);
        return <circle key={i} cx={x} cy={y} r="2" fill="#0369A1" />;
      })}
    </svg>
  );
}

const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];

const OUTCOME_COLORS: Record<string, { bg: string; text: string }> = {
  Won:       { bg: "#ECFDF5", text: "#065F46" },
  Interested:{ bg: "#EFF6FF", text: "#1D4ED8" },
  Qualified: { bg: "#F5F3FF", text: "#6D28D9" },
  "Follow-up":{ bg: "#FFFBEB", text: "#92400E" },
  "No answer":{ bg: "#F1F5F9", text: "#475569" },
  Lost:      { bg: "#FEF2F2", text: "#991B1B" },
};

// Status colors for lead pipeline chart
const STATUS_COLORS: Record<string, string> = {
  New: "#0369A1",
  Contacted: "#D97706",
  Qualified: "#7C3AED",
  Won: "#059669",
  Lost: "#DC2626",
};

// ─── Main Component ───────────────────────────────────────────────

export default function RepDetailPanel({
  rep,
  leadBreakdown,
  onClose,
}: {
  rep: SalesRepExtended;
  leadBreakdown?: { status: string; count: number }[];
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"overview" | "coaching">("overview");

  const av = AVATAR_PALETTE[(salesRepsExtended.findIndex(r => r.id === rep.id)) % AVATAR_PALETTE.length];
  const convColor = rep.conversionRate >= 35 ? "#059669" : rep.conversionRate >= 28 ? "#D97706" : "#DC2626";
  const ratio = getRatioColor(rep.talkRatio);
  const listenRatio = 100 - rep.talkRatio;

  // Prepare chart data
  const chartData = leadBreakdown ? leadBreakdown.map(item => ({
    name: item.status,
    count: item.count,
    color: STATUS_COLORS[item.status] || "#6B7280",
  })) : [];

  return (
    <aside
      style={{
        width: 360,
        flexShrink: 0,
        borderRight: "1px solid var(--border)",
        borderLeft: "1px solid var(--border)",   
        background: "var(--surface)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* ── HEADER ── */}
      <div style={{ padding: "14px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: 11, flexShrink: 0,
              background: av.bg, display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 13, color: av.text, border: "1px solid var(--border)",
              letterSpacing: "0.04em",
            }}
          >
            {rep.avatar}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", margin: 0, lineHeight: 1.2 }}>
              {rep.name}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: "3px 0 0" }}>
              Team {rep.team} · {rep.role}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)",
              cursor: "pointer", flexShrink: 0,
            }}
          >
            <X size={12} strokeWidth={2} />
          </button>
        </div>

        {/* Key stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
          {[
            { label: "Conv. Rate", value: `${rep.conversionRate}%`, color: convColor },
            { label: "Won / Mo.", value: rep.wonThisMonth, color: "#059669" },
            { label: "Calls Today", value: rep.callsToday, color: "var(--text-primary)" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                textAlign: "center", padding: "8px 6px", borderRadius: 8,
                background: "var(--surface-2)", border: "1px solid var(--border)",
              }}
            >
              <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color }}>{value}</p>
              <p style={{ margin: "2px 0 0", fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-secondary)" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* UPDATED TAB SWITCHER – simple underlined options, not buttons */}
        <div style={{ display: "flex", gap: 20, borderBottom: "1px solid var(--border)", marginTop: 14 }}>
          {(["overview", "coaching"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: "none",
                border: "none",
                padding: "6px 0 8px 0",
                fontSize: 13,
                fontWeight: tab === t ? 700 : 500,
                color: tab === t ? "var(--accent)" : "var(--text-secondary)",
                cursor: "pointer",
                borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent",
                transition: "color 0.1s, border-color 0.1s",
                textTransform: "capitalize",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── SCROLLABLE BODY ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {tab === "overview" && (
          <>
            {/* Lead Pipeline Chart */}
            {chartData.length > 0 && (
              <Section label="Lead pipeline">
                <div style={{ height: 180, width: "100%", marginBottom: 6 }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 10, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fontWeight: 500 }} width={65} />
                      <Tooltip
                        formatter={(value) => [`${value} leads`, "Count"]}
                        contentStyle={{ fontSize: 11, borderRadius: 8, borderColor: "var(--border)" }}
                      />
                      <Bar dataKey="count" fill="#0369A1" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                  {chartData.map(({ name, count, color }) => (
                    <div key={name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                      <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>{name}: {count}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Talk-to-listen ratio */}
            <Section label="Talk-to-listen ratio">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Mic size={12} style={{ color: "#DC2626", flexShrink: 0 }} />
                <MiniBar pct={rep.talkRatio} color={ratio.bar} />
                <span style={{ fontSize: 12, fontWeight: 700, color: ratio.text, minWidth: 30, textAlign: "right" }}>
                  {rep.talkRatio}%
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Headphones size={12} style={{ color: "#0369A1", flexShrink: 0 }} />
                <MiniBar pct={listenRatio} color="#0369A1" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0369A1", minWidth: 30, textAlign: "right" }}>
                  {listenRatio}%
                </span>
              </div>
              <div
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "6px 10px", borderRadius: 8,
                  background: rep.talkRatio <= 50 ? "#ECFDF5" : rep.talkRatio <= 58 ? "#FFFBEB" : "#FEF2F2",
                  border: `1px solid ${rep.talkRatio <= 50 ? "#A7F3D0" : rep.talkRatio <= 58 ? "#FDE68A" : "#FECACA"}`,
                }}
              >
                <span style={{ fontSize: 11, color: ratio.text, fontWeight: 600 }}>
                  {ratio.label} ratio
                </span>
                <span style={{ fontSize: 10, color: ratio.text }}>
                  Ideal: 45–55% talk
                </span>
              </div>
            </Section>

            {/* Avg call duration & response time */}
            <Section label="Call metrics">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                <MetricBox
                  icon={<Clock size={12} />}
                  label="Avg call"
                  value={`${rep.avgCallDuration}m`}
                  sub="duration"
                  color={rep.avgCallDuration > 10 ? "#D97706" : "#059669"}
                />
                <MetricBox
                  icon={<Zap size={12} />}
                  label={`${rep.responseTime}m`}
                  value=""
                  sub="avg response"
                  color={rep.responseTime > 15 ? "#DC2626" : rep.responseTime > 10 ? "#D97706" : "#059669"}
                />
                <MetricBox
                  icon={<Phone size={12} />}
                  label={`${rep.callsThisMonth}`}
                  value=""
                  sub="calls / month"
                  color="var(--text-primary)"
                />
                <MetricBox
                  icon={<Users size={12} />}
                  label={`${rep.leadsAssigned}`}
                  value=""
                  sub="leads assigned"
                  color="var(--text-primary)"
                />
              </div>
            </Section>

            {/* Won trend sparkline */}
            <Section label="Won trend — last 6 months">
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 4 }}>
                <div>
                  {months.map((m, i) => (
                    <div key={m} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 10, color: "var(--text-secondary)", width: 24 }}>{m}</span>
                      <MiniBar pct={(rep.monthlyWonTrend[i] / 12) * 100} color="#0369A1" />
                      <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-primary)", width: 14, textAlign: "right" }}>
                        {rep.monthlyWonTrend[i]}
                      </span>
                    </div>
                  ))}
                </div>
                <SparkLine values={rep.monthlyWonTrend} />
              </div>
            </Section>

            {/* Top objection */}
            <Section label="Top objection handled">
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                  borderRadius: 8, background: "#EFF6FF", border: "1px solid #BFDBFE",
                }}
              >
                <MessageSquare size={13} style={{ color: "#1D4ED8", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#1E3A8A", fontWeight: 600 }}>{rep.topObjectionHandled}</span>
              </div>
            </Section>

            {/* Recent activity */}
            <Section label="Recent activity" last>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {rep.recentActivity.map((a, i) => {
                  const oc = OUTCOME_COLORS[a.outcome] ?? { bg: "#F1F5F9", text: "#475569" };
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
                        borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {a.action}
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: 10, color: "var(--text-secondary)" }}>{a.date}</p>
                      </div>
                      <span
                        style={{
                          fontSize: 10, fontWeight: 700, padding: "3px 7px", borderRadius: 99,
                          background: oc.bg, color: oc.text, flexShrink: 0,
                        }}
                      >
                        {a.outcome}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Section>
          </>
        )}

        {tab === "coaching" && (
          <>
            {/* Strengths */}
            <Section label="Strengths">
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {rep.strengths.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <Star size={11} style={{ color: "#059669", flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 12, color: "var(--text-primary)", lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Weaknesses */}
            <Section label="Areas to improve">
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {rep.weaknesses.map((w, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <AlertTriangle size={11} style={{ color: "#D97706", flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 12, color: "var(--text-primary)", lineHeight: 1.5 }}>{w}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Talk ratio coaching card */}
            <Section label="Talk ratio coaching">
              <div
                style={{
                  background: rep.talkRatio > 58 ? "#FEF2F2" : "#ECFDF5",
                  border: `1px solid ${rep.talkRatio > 58 ? "#FECACA" : "#A7F3D0"}`,
                  borderRadius: 10, padding: "11px 12px",
                }}
              >
                <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: rep.talkRatio > 58 ? "#991B1B" : "#065F46" }}>
                  {rep.talkRatio > 58
                    ? `${rep.name} talks ${rep.talkRatio - 50}% more than ideal`
                    : `${rep.name} has a healthy listen ratio`}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: rep.talkRatio > 58 ? "#991B1B" : "#065F46", lineHeight: 1.5 }}>
                  {rep.talkRatio > 58
                    ? "Coach to ask more open-ended discovery questions. Encourage 2-second pauses after prospect speaks before responding."
                    : "Continue encouraging active listening and discovery questions. Great model for the rest of the team."}
                </p>
              </div>
            </Section>

            {/* Quick coaching actions */}
            <Section label="Actions" last>
              {[
                { icon: <MessageSquare size={11} />, label: "Send coaching note", color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" },
                { icon: <Phone size={11} />, label: "Schedule 1:1 call", color: "#065F46", bg: "#ECFDF5", border: "#A7F3D0" },
                { icon: <BarChart2 size={11} />, label: "View full performance report", color: "#374151", bg: "var(--surface-2)", border: "var(--border)" },
              ].map(({ icon, label, color, bg, border }) => (
                <button
                  key={label}
                  onClick={() => alert(`${label} for ${rep.name}`)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 8,
                    padding: "9px 12px", borderRadius: 8, marginBottom: 6,
                    background: bg, border: `1px solid ${border}`,
                    color, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    textAlign: "left", transition: "opacity 0.12s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                >
                  {icon}
                  {label}
                  <ChevronRight size={10} style={{ marginLeft: "auto" }} />
                </button>
              ))}
            </Section>
          </>
        )}
      </div>
    </aside>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────

function Section({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ padding: "12px 14px", borderBottom: last ? "none" : "1px solid var(--border)" }}>
      <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
        {label}
      </p>
      {children}
    </div>
  );
}

// ─── MetricBox ────────────────────────────────────────────────────

function MetricBox({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{ padding: "8px 10px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4, color: "var(--text-secondary)" }}>
        {icon}
        <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{sub}</span>
      </div>
      <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color }}>{label || value}</p>
    </div>
  );
}