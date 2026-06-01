"use client";
import { useState, useMemo } from "react";
import {
  TrendingDown, DollarSign, Clock, Users, Zap,
  AlertCircle, BarChart2, ChevronDown, ChevronUp,
  PhoneMissed, ThumbsDown, MessageSquare,
} from "lucide-react";

import { type LostReason , lostReasons } from "@/data/dummy";



// ─── Helpers / config ─────────────────────────────────────────────

const CATEGORY_CONFIG: Record<LostReason["category"], { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  price:      { icon: <DollarSign size={13} />, color: "#991B1B", bg: "#FEF2F2", border: "#FECACA" },
  timing:     { icon: <Clock size={13} />,      color: "#92400E", bg: "#FFFBEB", border: "#FDE68A" },
  competitor: { icon: <Users size={13} />,      color: "#1E3A8A", bg: "#EFF6FF", border: "#BFDBFE" },
  contact:    { icon: <PhoneMissed size={13} />,color: "#374151", bg: "#F1F5F9", border: "#CBD5E1" },
  product:    { icon: <Zap size={13} />,        color: "#6D28D9", bg: "#F5F3FF", border: "#C4B5FD" },
  other:      { icon: <AlertCircle size={13} />,color: "#065F46", bg: "#ECFDF5", border: "#A7F3D0" },
};

const TREND_CONFIG = {
  up:   { icon: <TrendingDown size={11} />, label: "↑ worse vs last month", color: "#DC2626" },
  down: { icon: <TrendingDown size={11} />, label: "↓ improving", color: "#059669" },
  flat: { label: "→ stable", color: "#D97706" },
};

const AVATAR_PALETTE = ["#EFF6FF", "#F0FDF4", "#FFF7ED", "#F5F3FF", "#FFFBEB", "#FDF2F8", "#ECFDF5"];
const AVATAR_TEXT =    ["#1D4ED8", "#15803D", "#C2410C", "#6D28D9", "#92400E", "#9D174D", "#065F46"];

const totalLost = lostReasons.reduce((s, r) => s + r.count, 0);

// ─── Sub-components ───────────────────────────────────────────────

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ flex: 1, height: 5, borderRadius: 99, background: "var(--border)", overflow: "hidden" }}>
      <div
        style={{
          height: "100%", width: `${Math.min(pct, 100)}%`,
          background: color, borderRadius: 99, transition: "width 0.5s ease",
        }}
      />
    </div>
  );
}

function RepAvatar({ avatar, index, count }: { avatar: string; index: number; count: number }) {
  const i = index % AVATAR_PALETTE.length;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div
        style={{
          width: 20, height: 20, borderRadius: 6, flexShrink: 0,
          background: AVATAR_PALETTE[i], color: AVATAR_TEXT[i],
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.03em",
        }}
      >
        {avatar}
      </div>
      <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{count}×</span>
    </div>
  );
}

function LostReasonCard({ reason, rank }: { reason: LostReason; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = CATEGORY_CONFIG[reason.category];
  const pct = Math.round((reason.count / totalLost) * 100);
  const trend = TREND_CONFIG[reason.trend];
  const maxRepCount = reason.repBreakdown[0]?.count ?? 1;

  return (
    <div
      style={{
        borderRadius: 12, border: "1px solid var(--border)",
        background: "var(--surface)", overflow: "hidden",
        marginBottom: 10,
      }}
    >
      {/* Main row */}
      <div
        style={{
          display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px",
          cursor: "pointer",
        }}
        onClick={() => setExpanded((e) => !e)}
      >
        {/* Rank badge */}
        <div
          style={{
            width: 22, height: 22, borderRadius: 7, flexShrink: 0,
            background: rank <= 3 ? "#FEF2F2" : "var(--surface-2)",
            border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800, color: rank <= 3 ? "#991B1B" : "#374151",
          }}
        >
          {rank}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Category pill + trend */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
            <span
              style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99,
                background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
              }}
            >
              {cfg.icon}
              {reason.category.charAt(0).toUpperCase() + reason.category.slice(1)}
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, color: trend.color }}>
              {trend.label}
            </span>
          </div>

          {/* Reason text */}
          <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>
            {reason.reason}
          </p>

          {/* Progress bar + count */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <MiniBar pct={pct} color={cfg.color} />
            <span style={{ fontSize: 12, fontWeight: 800, color: cfg.color, minWidth: 28, textAlign: "right" }}>
              {reason.count}
            </span>
            <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>lost</span>
            <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>·</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text-secondary)" }}>{pct}%</span>
          </div>
        </div>

        {/* Expand toggle */}
        <button
          style={{
            flexShrink: 0, color: "var(--text-secondary)", background: "none",
            border: "none", cursor: "pointer", padding: 0,
          }}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div
          style={{
            padding: "0 14px 14px",
            borderTop: "1px solid var(--border)",
            background: "var(--surface-2)",
          }}
        >
          {/* Rep breakdown */}
          <p style={{ margin: "12px 0 8px", fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
            By rep
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {reason.repBreakdown.map((rb, i) => (
              <div key={rb.repName} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <RepAvatar avatar={rb.avatar} index={i} count={rb.count} />
                <span style={{ fontSize: 11, color: "var(--text-primary)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {rb.repName}
                </span>
                <MiniBar pct={(rb.count / maxRepCount) * 100} color={cfg.color} />
              </div>
            ))}
          </div>

          {/* Examples */}
          <p style={{ margin: "12px 0 8px", fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-secondary)" }}>
            Field notes
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {reason.examples.map((ex, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                <MessageSquare size={10} style={{ color: cfg.color, flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 11, color: "var(--text-primary)", lineHeight: 1.5 }}>{ex}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────

export default function LostReasonsView() {
  const [categoryFilter, setCategoryFilter] = useState<LostReason["category"] | "all">("all");

  const filtered = useMemo(
    () => categoryFilter === "all" ? lostReasons : lostReasons.filter((r) => r.category === categoryFilter),
    [categoryFilter]
  );

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    lostReasons.forEach((r) => {
      totals[r.category] = (totals[r.category] ?? 0) + r.count;
    });
    return totals;
  }, []);

  return (
    <div className="p-7 max-w-3xl">
      {/* Header */}
      <div className="mb-6 animate-fade-up">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: 9,
              background: "#FEF2F2", border: "1px solid #FECACA",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <ThumbsDown size={14} style={{ color: "#DC2626" }} />
          </div>
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}
          >
            Lost Deal Analysis
          </h1>
        </div>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {totalLost} leads lost this month · May 2025 · Click any card to expand
        </p>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-up delay-50">
        {[
          { label: "Total lost", value: totalLost, color: "#DC2626", icon: <TrendingDown size={14} /> },
          { label: "Top reason", value: "Pricing", color: "#D97706", icon: <DollarSign size={14} /> },
          { label: "Trending up", value: "3 reasons", color: "#7C3AED", icon: <BarChart2 size={14} /> },
        ].map(({ label, value, color, icon }) => (
          <div
            key={label}
            className="card"
            style={{ padding: "14px", display: "flex", alignItems: "center", gap: 10 }}
          >
            <div
              style={{
                width: 32, height: 32, borderRadius: 9, background: "var(--surface-2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color, flexShrink: 0,
              }}
            >
              {icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color, lineHeight: 1.1 }}>{value}</p>
              <p style={{ margin: "2px 0 0", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 flex-wrap mb-5 animate-fade-up delay-100">
        <button
          onClick={() => setCategoryFilter("all")}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: categoryFilter === "all" ? "#FEF2F2" : "var(--surface-2)",
            color: categoryFilter === "all" ? "#991B1B" : "#374151",
            border: `1px solid ${categoryFilter === "all" ? "#FECACA" : "var(--border)"}`,
          }}
        >
          All · {totalLost}
        </button>
        {(Object.keys(CATEGORY_CONFIG) as LostReason["category"][]).map((cat) => {
          const cfg = CATEGORY_CONFIG[cat];
          const n = categoryTotals[cat] ?? 0;
          const isActive = categoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: isActive ? cfg.bg : "var(--surface-2)",
                color: isActive ? cfg.color : "#374151",
                border: `1px solid ${isActive ? cfg.border : "var(--border)"}`,
              }}
            >
              {cfg.icon}
              {cat.charAt(0).toUpperCase() + cat.slice(1)} · {n}
            </button>
          );
        })}
      </div>

      {/* Reason cards */}
      <div className="animate-fade-up delay-150">
        {filtered.map((reason, i) => (
          <LostReasonCard key={reason.id} reason={reason} rank={i + 1} />
        ))}
      </div>

      {/* Bottom insight callout */}
      <div
        className="animate-fade-up"
        style={{
          marginTop: 4,
          padding: "14px 16px",
          borderRadius: 12,
          background: "#EFF6FF",
          border: "1px solid #BFDBFE",
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <AlertCircle size={14} style={{ color: "#1D4ED8", flexShrink: 0, marginTop: 2 }} />
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: "#1E3A8A" }}>
            Pricing is your #1 blocker
          </p>
          <p style={{ margin: 0, fontSize: 11, color: "#1D4ED8", lineHeight: 1.6 }}>
            38 deals (28% of all lost) were lost on price. Kabir Singh accounts for 32% of price-related losses alone.
            Consider targeted pricing objection training and flexible payment options for the SMB segment.
          </p>
        </div>
      </div>
    </div>
  );
}