"use client";
import { useState, useMemo } from "react";
import {
  TrendingDown, DollarSign, Clock, Users, Zap,
  AlertCircle, BarChart2, ChevronDown, ChevronUp,
  PhoneMissed, ThumbsDown, MessageSquare,
} from "lucide-react";
import { type LostReason, lostReasons } from "@/data/dummy";

// Per-category colors are intentional data-driven palette — kept as named tokens
// but mapped through semantic vars where possible
const CATEGORY_CONFIG: Record<LostReason["category"], { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  price:      { icon: <DollarSign size={13} />, color: "var(--danger)",  bg: "var(--danger-light)",  border: "var(--danger-border)" },
  timing:     { icon: <Clock size={13} />,      color: "var(--warning)", bg: "var(--warning-light)", border: "var(--warning-border)" },
  competitor: { icon: <Users size={13} />,      color: "var(--info)",    bg: "var(--info-light)",    border: "var(--info-border)" },
  contact:    { icon: <PhoneMissed size={13} />,color: "var(--text-secondary)", bg: "var(--surface-2)", border: "var(--border)" },
  product:    { icon: <Zap size={13} />,        color: "var(--accent)",  bg: "var(--accent-light)",  border: "var(--accent-border)" },
  other:      { icon: <AlertCircle size={13} />,color: "var(--success)", bg: "var(--success-light)", border: "var(--success-border)" },
};

const TREND_CONFIG = {
  up:   { label: "↑ worse vs last month", color: "var(--danger)" },
  down: { label: "↓ improving",           color: "var(--success)" },
  flat: { label: "→ stable",              color: "var(--warning)" },
};

const AVATAR_PALETTE_BG   = ["var(--info-light)", "var(--success-light)", "var(--warning-light)", "var(--accent-light)", "var(--danger-light)", "var(--surface-2)", "var(--success-light)"];
const AVATAR_PALETTE_TEXT = ["var(--info)", "var(--success)", "var(--warning)", "var(--accent)", "var(--danger)", "var(--text-secondary)", "var(--success)"];

const totalLost = lostReasons.reduce((s, r) => s + r.count, 0);

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ flex: 1, height: 5, borderRadius: 99, background: "var(--border)", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 99, transition: "width 0.5s ease" }} />
    </div>
  );
}

function RepAvatar({ avatar, index, count }: { avatar: string; index: number; count: number }) {
  const i = index % AVATAR_PALETTE_BG.length;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 20, height: 20, borderRadius: 6, flexShrink: 0,
        background: AVATAR_PALETTE_BG[i], color: AVATAR_PALETTE_TEXT[i],
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 9, fontWeight: 700,
      }}>
        {avatar}
      </div>
      <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{count}×</span>
    </div>
  );
}

function LostReasonCard({ reason, rank }: { reason: LostReason; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg         = CATEGORY_CONFIG[reason.category];
  const pct         = Math.round((reason.count / totalLost) * 100);
  const trend       = TREND_CONFIG[reason.trend];
  const maxRepCount = reason.repBreakdown[0]?.count ?? 1;

  return (
    <div className="animate-fade-up card" style={{ overflow: "hidden", marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", cursor: "pointer" }}
        onClick={() => setExpanded(e => !e)}>
        {/* Rank */}
        <div style={{
          width: 22, height: 22, borderRadius: 7, flexShrink: 0,
          background: rank <= 3 ? "var(--danger-light)" : "var(--surface-2)",
          border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 800,
          color: rank <= 3 ? "var(--danger)" : "var(--text-secondary)",
        }}>
          {rank}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99,
              background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
            }}>
              {cfg.icon}
              {reason.category.charAt(0).toUpperCase() + reason.category.slice(1)}
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, color: trend.color }}>{trend.label}</span>
          </div>
          <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>
            {reason.reason}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <MiniBar pct={pct} color={cfg.color} />
            <span style={{ fontSize: 12, fontWeight: 800, color: cfg.color, minWidth: 28, textAlign: "right" }}>{reason.count}</span>
            <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>lost</span>
            <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>·</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text-secondary)" }}>{pct}%</span>
          </div>
        </div>

        <button style={{ flexShrink: 0, color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {expanded && (
        <div className="animate-fade-in" style={{ padding: "0 14px 14px", borderTop: "1px solid var(--border)", background: "var(--surface-2)" }}>
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

export default function LostReasonsView() {
  const [categoryFilter, setCategoryFilter] = useState<LostReason["category"] | "all">("all");

  const filtered = useMemo(
    () => categoryFilter === "all" ? lostReasons : lostReasons.filter(r => r.category === categoryFilter),
    [categoryFilter]
  );

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    lostReasons.forEach(r => { totals[r.category] = (totals[r.category] ?? 0) + r.count; });
    return totals;
  }, []);

  return (
    <div style={{ padding: 28, maxWidth: 768 }}>

      {/* Header */}
      <div className="animate-fade-up" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--danger-light)", border: "1px solid var(--danger-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ThumbsDown size={14} style={{ color: "var(--danger)" }} />
          </div>
          <h1 className="page-title">Lost Deal Analysis</h1>
        </div>
        <p className="page-subtitle">{totalLost} leads lost this month · May 2025 · Click any card to expand</p>
      </div>

      {/* Summary stat cards */}
      <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24, animationDelay: "40ms" }}>
        {[
          { label: "Total lost",  value: totalLost,   color: "var(--danger)",  bg: "var(--danger-light)",  icon: <TrendingDown size={14} /> },
          { label: "Top reason",  value: "Pricing",   color: "var(--warning)", bg: "var(--warning-light)", icon: <DollarSign size={14} /> },
          { label: "Trending up", value: "3 reasons", color: "var(--accent)",  bg: "var(--accent-light)",  icon: <BarChart2 size={14} /> },
        ].map(({ label, value, color, bg, icon }) => (
          <div key={label} className="card animate-fade-in" style={{ padding: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: bg, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>
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
      <div className="animate-fade-up" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20, animationDelay: "80ms" }}>
        <button onClick={() => setCategoryFilter("all")}
          style={{
            padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .15s",
            background: categoryFilter === "all" ? "var(--danger-light)" : "var(--surface-2)",
            color: categoryFilter === "all" ? "var(--danger)" : "var(--text-secondary)",
            border: `1px solid ${categoryFilter === "all" ? "var(--danger-border)" : "var(--border)"}`,
          }}>
          All · {totalLost}
        </button>
        {(Object.keys(CATEGORY_CONFIG) as LostReason["category"][]).map(cat => {
          const cfg      = CATEGORY_CONFIG[cat];
          const isActive = categoryFilter === cat;
          return (
            <button key={cat} onClick={() => setCategoryFilter(cat)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .15s",
                background: isActive ? cfg.bg : "var(--surface-2)",
                color: isActive ? cfg.color : "var(--text-secondary)",
                border: `1px solid ${isActive ? cfg.border : "var(--border)"}`,
              }}>
              {cfg.icon}
              {cat.charAt(0).toUpperCase() + cat.slice(1)} · {categoryTotals[cat] ?? 0}
            </button>
          );
        })}
      </div>

      {/* Reason cards */}
      <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
        {filtered.map((reason, i) => (
          <div key={reason.id} style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
            <LostReasonCard reason={reason} rank={i + 1} />
          </div>
        ))}
      </div>

      {/* Insight callout */}
      <div className="animate-fade-up" style={{
        marginTop: 4, padding: "14px 16px", borderRadius: 12,
        background: "var(--info-light)", border: "1px solid var(--info-border)",
        display: "flex", alignItems: "flex-start", gap: 10,
        animationDelay: "160ms",
      }}>
        <AlertCircle size={14} style={{ color: "var(--info)", flexShrink: 0, marginTop: 2 }} />
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: "var(--info)" }}>
            Pricing is your #1 blocker
          </p>
          <p style={{ margin: 0, fontSize: 11, color: "var(--info)", lineHeight: 1.6 }}>
            38 deals (28% of all lost) were lost on price. Kabir Singh accounts for 32% of price-related losses alone.
            Consider targeted pricing objection training and flexible payment options for the SMB segment.
          </p>
        </div>
      </div>
    </div>
  );
}