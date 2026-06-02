"use client";
import { useState } from "react";
import {
  X, Phone, Clock, Users,
  ChevronRight, Star, AlertTriangle,
  MessageSquare, BarChart2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
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
  avgCallDuration: number;
  callsThisMonth: number;
  responseTime: number;
  strengths: string[];
  weaknesses: string[];
  recentActivity: { date: string; action: string; outcome: string }[];
  monthlyWonTrend: number[];
}

// ─── Extended dummy data ──────────────────────────────────────────
export const salesRepsExtended: SalesRepExtended[] = [
  {
    id: "rep-1", name: "Aanya Sharma", avatar: "AS", role: "rep", team: "Alpha",
    leadsAssigned: 28, callsToday: 18, conversionRate: 34, wonThisMonth: 8,
    avgCallDuration: 7.4, callsThisMonth: 112, responseTime: 9,
    strengths: ["Strong rapport building", "Handles objections well", "High follow-up discipline"],
    weaknesses: ["Tends to over-explain pricing", "Slow to qualify cold leads"],
    recentActivity: [
      { date: "Today",     action: "Called Rajiv Malhotra",   outcome: "Interested" },
      { date: "Today",     action: "Followed up Sneha Das",   outcome: "Follow-up"  },
      { date: "Yesterday", action: "Closed Deepak Joshi",     outcome: "Won"        },
    ],
    monthlyWonTrend: [5, 6, 7, 6, 8, 8],
  },
  {
    id: "rep-2", name: "Rohan Mehta", avatar: "RM", role: "rep", team: "Alpha",
    leadsAssigned: 31, callsToday: 22, conversionRate: 28, wonThisMonth: 9,
    avgCallDuration: 9.1, callsThisMonth: 143, responseTime: 14,
    strengths: ["High call volume", "Great energy on calls", "Product knowledge depth"],
    weaknesses: ["Poor listening signals", "Misses follow-up timing"],
    recentActivity: [
      { date: "Today",     action: "Called Anita Rao",        outcome: "No answer"  },
      { date: "Today",     action: "Closed Vikram Bose",      outcome: "Won"        },
      { date: "Yesterday", action: "Called Pradeep Kumar",    outcome: "Interested" },
    ],
    monthlyWonTrend: [7, 8, 9, 8, 7, 9],
  },
  {
    id: "rep-3", name: "Priya Nair", avatar: "PN", role: "rep", team: "Beta",
    leadsAssigned: 19, callsToday: 14, conversionRate: 41, wonThisMonth: 8,
    avgCallDuration: 6.2, callsThisMonth: 89, responseTime: 6,
    strengths: ["Best conversion rate on team", "Excellent listener", "Concise & confident pitch"],
    weaknesses: ["Lower call volume", "Avoids difficult prospects"],
    recentActivity: [
      { date: "Today",     action: "Closed Meera Pillai",     outcome: "Won"        },
      { date: "Today",     action: "Called Suresh Iyer",      outcome: "Qualified"  },
      { date: "Yesterday", action: "Sent proposal to Ravi",   outcome: "Follow-up"  },
    ],
    monthlyWonTrend: [4, 5, 6, 7, 7, 8],
  },
  {
    id: "rep-4", name: "Kabir Singh", avatar: "KS", role: "rep", team: "Beta",
    leadsAssigned: 27, callsToday: 20, conversionRate: 22, wonThisMonth: 6,
    avgCallDuration: 11.3, callsThisMonth: 128, responseTime: 22,
    strengths: ["Builds long relationships", "Strong with enterprise leads"],
    weaknesses: ["Lowest conversion on team", "Very slow response time", "Long calls"],
    recentActivity: [
      { date: "Today",     action: "Called Harsh Vardhan",    outcome: "No answer"  },
      { date: "Today",     action: "Called Nidhi Arora",      outcome: "Interested" },
      { date: "2 days ago", action: "Lost Tarun Bhatia",      outcome: "Lost"       },
    ],
    monthlyWonTrend: [8, 7, 6, 5, 5, 6],
  },
  {
    id: "rep-5", name: "Meera Iyer", avatar: "MI", role: "rep", team: "Gamma",
    leadsAssigned: 22, callsToday: 16, conversionRate: 36, wonThisMonth: 8,
    avgCallDuration: 7.8, callsThisMonth: 101, responseTime: 8,
    strengths: ["Balanced call style", "Fast response time", "Great discovery questions"],
    weaknesses: ["Struggles with final close", "Sometimes over-nurtures warm leads"],
    recentActivity: [
      { date: "Today",     action: "Qualified Pooja Shetty",  outcome: "Qualified"  },
      { date: "Today",     action: "Called Arnav Shah",       outcome: "Follow-up"  },
      { date: "Yesterday", action: "Closed Divya Menon",      outcome: "Won"        },
    ],
    monthlyWonTrend: [5, 6, 7, 8, 7, 8],
  },
  {
    id: "rep-6", name: "Aryan Gupta", avatar: "AG", role: "rep", team: "Alpha",
    leadsAssigned: 18, callsToday: 12, conversionRate: 31, wonThisMonth: 6,
    avgCallDuration: 8.3, callsThisMonth: 78, responseTime: 11,
    strengths: ["Solid objection handling", "Consistent conversion"],
    weaknesses: ["Lowest lead volume on team", "Needs to increase call cadence"],
    recentActivity: [
      { date: "Today",     action: "Called Ishaan Kapoor",    outcome: "Interested" },
      { date: "Yesterday", action: "Closed Sakshi Verma",     outcome: "Won"        },
      { date: "2 days ago", action: "Called Riya Chatterjee", outcome: "No answer"  },
    ],
    monthlyWonTrend: [4, 4, 5, 6, 6, 6],
  },
  {
    id: "rep-7", name: "Divya Reddy", avatar: "DR", role: "rep", team: "Gamma",
    leadsAssigned: 21, callsToday: 15, conversionRate: 38, wonThisMonth: 7,
    avgCallDuration: 6.9, callsThisMonth: 96, responseTime: 7,
    strengths: ["Quick to identify buying signals", "Strong closing rate"],
    weaknesses: ["Needs to expand lead funnel", "Occasionally undersells add-ons"],
    recentActivity: [
      { date: "Today",     action: "Closed Kiran Raj",        outcome: "Won"        },
      { date: "Today",     action: "Called Namita Hegde",     outcome: "Qualified"  },
      { date: "Yesterday", action: "Called Varun Nair",       outcome: "Follow-up"  },
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

const STATUS_COLORS: Record<string, string> = {
  New:           "#0369A1",
  Contacted:     "#D97706",
  Qualified:     "#7C3AED",
  "Proposal Sent": "#B45309",
  Negotiation:   "#6366F1",
  Enrolled:      "#059669",
  Lost:          "#DC2626",
  "Not Interested": "#6B7280",
};

const OUTCOME_COLORS: Record<string, { bg: string; text: string }> = {
  Won:          { bg: "#ECFDF5", text: "#065F46" },
  Interested:   { bg: "#EFF6FF", text: "#1D4ED8" },
  Qualified:    { bg: "#F5F3FF", text: "#6D28D9" },
  "Follow-up":  { bg: "#FFFBEB", text: "#92400E" },
  "No answer":  { bg: "#F1F5F9", text: "#475569" },
  Lost:         { bg: "#FEF2F2", text: "#991B1B" },
};

const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];

// ─── Mini bar ─────────────────────────────────────────────────────
function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ flex: 1, height: 6, borderRadius: 99, background: "#F3F4F6", overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${Math.min(pct, 100)}%`,
        background: color, borderRadius: 99, transition: "width 0.5s ease",
      }} />
    </div>
  );
}

// ─── Sparkline ────────────────────────────────────────────────────
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

// ─── Section wrapper ──────────────────────────────────────────────
function Section({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ padding: "12px 14px", borderBottom: last ? "none" : "1px solid #E5E7EB" }}>
      <p style={{
        margin: "0 0 8px", fontSize: 10, fontWeight: 700,
        letterSpacing: "0.07em", textTransform: "uppercase", color: "#6B7280",
      }}>
        {label}
      </p>
      {children}
    </div>
  );
}

// ─── Metric box ───────────────────────────────────────────────────
function MetricBox({ icon, label, sub, color }: { icon: React.ReactNode; label: string; sub: string; color: string }) {
  return (
    <div style={{ padding: "8px 10px", borderRadius: 8, background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4, color: "#6B7280" }}>
        {icon}
        <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{sub}</span>
      </div>
      <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color }}>{label}</p>
    </div>
  );
}

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

  const av = AVATAR_PALETTE[salesRepsExtended.findIndex(r => r.id === rep.id) % AVATAR_PALETTE.length];
  const convColor = rep.conversionRate >= 35 ? "#059669"
    : rep.conversionRate >= 28 ? "#D97706"
    : "#DC2626";

  const chartData = (leadBreakdown ?? []).map(item => ({
    name: item.status,
    count: item.count,
    color: STATUS_COLORS[item.status] || "#6B7280",
  }));

  return (
    <aside style={{
      width: 360, flexShrink: 0,
      borderLeft: "1px solid #E5E7EB",
      background: "#fff",
      display: "flex", flexDirection: "column",
      height: "100%", overflow: "hidden",
    }}>

      {/* Header */}
      <div style={{ padding: "14px", borderBottom: "1px solid #E5E7EB", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 11, flexShrink: 0,
            background: av.bg, display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 13, color: av.text,
            border: "1px solid #E5E7EB", letterSpacing: "0.04em",
          }}>
            {rep.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: "#111827", margin: 0, lineHeight: 1.2 }}>
              {rep.name}
            </p>
            <p style={{ fontSize: 11, color: "#6B7280", margin: "3px 0 0" }}>
              Team {rep.team} · {rep.role}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 26, height: 26, borderRadius: 7,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid #E5E7EB", background: "transparent",
              color: "#6B7280", cursor: "pointer", flexShrink: 0,
            }}
          >
            <X size={12} strokeWidth={2} />
          </button>
        </div>

        {/* Key stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
          {[
            { label: "Conv. Rate",  value: `${rep.conversionRate}%`, color: convColor    },
            { label: "Won / Mo.",   value: rep.wonThisMonth,         color: "#059669"    },
            { label: "Calls Today", value: rep.callsToday,           color: "#111827"    },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              textAlign: "center", padding: "8px 6px", borderRadius: 8,
              background: "#F9FAFB", border: "1px solid #E5E7EB",
            }}>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color }}>{value}</p>
              <p style={{ margin: "2px 0 0", fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6B7280" }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 20, borderBottom: "1px solid #E5E7EB", marginTop: 14 }}>
          {(["overview", "coaching"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: "none", border: "none",
                padding: "6px 0 8px 0",
                fontSize: 13, fontWeight: tab === t ? 700 : 500,
                color: tab === t ? "#2563EB" : "#6B7280",
                cursor: "pointer",
                borderBottom: tab === t ? "2px solid #2563EB" : "2px solid transparent",
                transition: "color 0.1s, border-color 0.1s",
                textTransform: "capitalize",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <>
            {/* Lead pipeline chart */}
            {chartData.length > 0 && (
              <Section label="Lead pipeline">
                <div style={{ height: 180, width: "100%", marginBottom: 6 }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 10, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fontWeight: 500 }} width={65} />
                      <Tooltip
                        formatter={(value) => [`${value} leads`, "Count"]}
                        contentStyle={{ fontSize: 11, borderRadius: 8, borderColor: "#E5E7EB" }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Section>
            )}

            {/* Call metrics */}
            <Section label="Call metrics">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                <MetricBox icon={<Clock size={12} />}      label={`${rep.avgCallDuration}m`} sub="avg call"      color={rep.avgCallDuration > 10 ? "#D97706" : "#059669"} />
                <MetricBox icon={<Phone size={12} />}      label={`${rep.responseTime}m`}    sub="response time" color={rep.responseTime > 15 ? "#DC2626" : rep.responseTime > 10 ? "#D97706" : "#059669"} />
                <MetricBox icon={<Phone size={12} />}      label={`${rep.callsThisMonth}`}   sub="calls / month" color="#111827" />
                <MetricBox icon={<Users size={12} />}      label={`${rep.leadsAssigned}`}    sub="leads assigned" color="#111827" />
              </div>
            </Section>

            {/* Won trend */}
            <Section label="Won trend — last 6 months">
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 4 }}>
                <div style={{ flex: 1 }}>
                  {months.map((m, i) => (
                    <div key={m} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 10, color: "#6B7280", width: 24 }}>{m}</span>
                      <MiniBar pct={(rep.monthlyWonTrend[i] / 12) * 100} color="#0369A1" />
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#111827", width: 14, textAlign: "right" }}>
                        {rep.monthlyWonTrend[i]}
                      </span>
                    </div>
                  ))}
                </div>
                <SparkLine values={rep.monthlyWonTrend} />
              </div>
            </Section>

            {/* Recent activity */}
            <Section label="Recent activity" last>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {rep.recentActivity.map((a, i) => {
                  const oc = OUTCOME_COLORS[a.outcome] ?? { bg: "#F1F5F9", text: "#475569" };
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
                      borderRadius: 8, background: "#F9FAFB", border: "1px solid #E5E7EB",
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {a.action}
                        </p>
                        <p style={{ margin: "2px 0 0", fontSize: 10, color: "#6B7280" }}>{a.date}</p>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "3px 7px", borderRadius: 99,
                        background: oc.bg, color: oc.text, flexShrink: 0,
                      }}>
                        {a.outcome}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Section>
          </>
        )}

        {/* ── COACHING TAB ── */}
        {tab === "coaching" && (
          <>
            {/* Strengths */}
            <Section label="Strengths">
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {rep.strengths.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <Star size={11} style={{ color: "#059669", flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 12, color: "#111827", lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Areas to improve */}
            <Section label="Areas to improve">
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {rep.weaknesses.map((w, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <AlertTriangle size={11} style={{ color: "#D97706", flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 12, color: "#111827", lineHeight: 1.5 }}>{w}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Actions */}
            <Section label="Actions" last>
              {[
                { icon: <MessageSquare size={11} />, label: "Send coaching note",           color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" },
                { icon: <Phone size={11} />,         label: "Schedule 1:1 call",            color: "#065F46", bg: "#ECFDF5", border: "#A7F3D0" },
                { icon: <BarChart2 size={11} />,     label: "View full performance report", color: "#374151", bg: "#F9FAFB", border: "#E5E7EB"  },
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
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
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