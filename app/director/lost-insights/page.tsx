"use client";
import React, { useState } from "react";
import { lostReasons, salesReps } from "@/data/dummy";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import {
  DollarSign, Timer, Swords, PhoneOff, Package, Circle,
  TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Lightbulb,
} from "lucide-react";

// Data-driven category colors — intentional semantic palette
const CATEGORY_CONFIG = {
  price:      { label: "Price",      color: "var(--danger)",  bg: "var(--danger-light)",  border: "var(--danger-border)",  chartColor: "#DC2626", icon: DollarSign },
  timing:     { label: "Timing",     color: "var(--warning)", bg: "var(--warning-light)", border: "var(--warning-border)", chartColor: "#D97706", icon: Timer },
  competitor: { label: "Competitor", color: "var(--info)",    bg: "var(--info-light)",    border: "var(--info-border)",    chartColor: "#0369A1", icon: Swords },
  contact:    { label: "No Contact", color: "var(--text-secondary)", bg: "var(--surface-2)", border: "var(--border)",       chartColor: "#374151", icon: PhoneOff },
  product:    { label: "Product",    color: "var(--accent)",  bg: "var(--accent-light)",  border: "var(--accent-border)",  chartColor: "#7C3AED", icon: Package },
  other:      { label: "Other",      color: "var(--success)", bg: "var(--success-light)", border: "var(--success-border)", chartColor: "#059669", icon: Circle },
} as const;

type CategoryKey = keyof typeof CATEGORY_CONFIG;

const TREND_CONFIG = {
  up:   { label: "Worsening", color: "var(--danger)",  icon: TrendingUp },
  down: { label: "Improving", color: "var(--success)", icon: TrendingDown },
  flat: { label: "Stable",    color: "var(--warning)", icon: Minus },
};

const totalLost = lostReasons.reduce((s, r) => s + r.count, 0);

const categoryTotals = (Object.keys(CATEGORY_CONFIG) as CategoryKey[]).map(cat => ({
  cat,
  label:      CATEGORY_CONFIG[cat].label,
  count:      lostReasons.filter(r => r.category === cat).reduce((s, r) => s + r.count, 0),
  chartColor: CATEGORY_CONFIG[cat].chartColor,
}));

const repLostCounts = salesReps
  .map(rep => ({ ...rep, totalLost: lostReasons.reduce((s, r) => s + (r.repBreakdown.find(b => b.repName === rep.name)?.count ?? 0), 0) }))
  .sort((a, b) => b.totalLost - a.totalLost);

const repBarColor = (n: number) => n > 20 ? "var(--danger)" : n > 10 ? "var(--warning)" : "var(--text-muted)";

const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--text-primary)", border: "1px solid #3F3F46", borderRadius: 10, padding: "10px 14px" }}>
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: 12, color: p.fill ?? "#fff", margin: "2px 0" }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function DirectorLostReasons() {
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [catFilter, setCatFilter] = useState<string>("all");

  const filtered = catFilter === "all" ? lostReasons : lostReasons.filter(r => r.category === catFilter);

  return (
    <div style={{ padding: "28px 32px", maxWidth: 980, background: "var(--bg)", minHeight: "100%" }}>

      {/* Header */}
      <div className="animate-fade-up" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: 4 }}>Lead Intelligence · Director View</p>
        <h1 className="page-title">Lost Deal Analysis</h1>
        <p className="page-subtitle">{totalLost} leads lost this month · May 2025 · Cross-team breakdown</p>
      </div>

      {/* Summary stats */}
      <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20, animationDelay: "40ms" }}>
        {[
          { label: "Total Lost",   value: totalLost, color: "var(--danger)",  bg: "var(--danger-light)" },
          { label: "Price Losses", value: lostReasons.filter(r => r.category === "price").reduce((s, r) => s + r.count, 0), color: "var(--danger)", bg: "var(--danger-light)" },
          { label: "Competitors",  value: lostReasons.filter(r => r.category === "competitor").reduce((s, r) => s + r.count, 0), color: "var(--info)", bg: "var(--info-light)" },
          { label: "Worsening",    value: `${lostReasons.filter(r => r.trend === "up").length} reasons`, color: "var(--warning)", bg: "var(--warning-light)" },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: 20, fontWeight: 800, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", margin: "3px 0 0" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <div className="animate-fade-up card" style={{ padding: 18, animationDelay: "80ms" }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 14px" }}>Losses by Category</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={categoryTotals} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<DarkTooltip />} />
              <Bar dataKey="count" name="Lost" radius={[4, 4, 0, 0]}>
                {categoryTotals.map(c => <Cell key={c.cat} fill={c.chartColor} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="animate-fade-up card" style={{ padding: 18, animationDelay: "120ms" }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 14px" }}>Losses per Rep</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {repLostCounts.map(rep => (
              <div key={rep.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: "var(--info-light)", color: "var(--info)", fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {rep.avatar}
                </div>
                <span style={{ fontSize: 12, color: "var(--text-primary)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {rep.name.split(" ")[0]}
                </span>
                <div style={{ width: 80, height: 5, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${repLostCounts[0].totalLost > 0 ? (rep.totalLost / repLostCounts[0].totalLost) * 100 : 0}%`, background: repBarColor(rep.totalLost), borderRadius: 99 }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, minWidth: 24, textAlign: "right", color: repBarColor(rep.totalLost) }}>
                  {rep.totalLost}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="animate-fade-up" style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap", animationDelay: "120ms" }}>
        <button onClick={() => setCatFilter("all")}
          style={{ padding: "5px 12px", fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: "pointer", transition: "all .15s", background: catFilter === "all" ? "var(--text-primary)" : "var(--surface)", color: catFilter === "all" ? "#fff" : "var(--text-secondary)", border: `1.5px solid ${catFilter === "all" ? "var(--text-primary)" : "var(--border)"}` }}>
          All · {totalLost}
        </button>
        {(Object.entries(CATEGORY_CONFIG) as [CategoryKey, typeof CATEGORY_CONFIG[CategoryKey]][]).map(([cat, cfg]) => {
          const count    = lostReasons.filter(r => r.category === cat).reduce((s, r) => s + r.count, 0);
          const isActive = catFilter === cat;
          const IconComp = cfg.icon;
          return (
            <button key={cat} onClick={() => setCatFilter(cat)}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: "pointer", transition: "all .15s", background: isActive ? cfg.bg : "var(--surface)", color: isActive ? cfg.color : "var(--text-secondary)", border: `1.5px solid ${isActive ? cfg.border : "var(--border)"}` }}>
              <IconComp size={12} /> {cfg.label} · {count}
            </button>
          );
        })}
      </div>

      {/* Reason cards */}
      <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 8, animationDelay: "160ms" }}>
        {filtered.map((reason, i) => {
          const cfg        = CATEGORY_CONFIG[reason.category as CategoryKey];
          const pct        = Math.round((reason.count / totalLost) * 100);
          const trend      = TREND_CONFIG[reason.trend];
          const TrendIcon  = trend.icon;
          const isExpanded = expanded === reason.id;
          const maxRep     = reason.repBreakdown[0]?.count ?? 1;
          const CatIcon    = cfg.icon;

          return (
            <div key={reason.id} className="animate-fade-up card" style={{ overflow: "hidden", animationDelay: `${Math.min(i, 6) * 30}ms` }}>
              <div style={{ padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12 }} onClick={() => setExpanded(isExpanded ? null : reason.id)}>
                <div style={{ width: 24, height: 24, borderRadius: 7, flexShrink: 0, background: i < 3 ? cfg.bg : "var(--surface-2)", border: `1px solid ${i < 3 ? cfg.border : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: i < 3 ? cfg.color : "var(--text-muted)" }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, display: "flex", alignItems: "center", gap: 4 }}>
                      <CatIcon size={9} /> {cfg.label}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: trend.color, display: "flex", alignItems: "center", gap: 3 }}>
                      <TrendIcon size={10} /> {trend.label}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 8px", lineHeight: 1.4 }}>{reason.reason}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1, height: 5, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(pct * 2, 100)}%`, background: cfg.color, borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: cfg.color, minWidth: 24, textAlign: "right" }}>{reason.count}</span>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>({pct}% of losses)</span>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={14} style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: 4 }} /> : <ChevronDown size={14} style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: 4 }} />}
              </div>

              {isExpanded && (
                <div className="animate-fade-in" style={{ padding: "0 16px 16px", borderTop: "1px solid var(--border)", background: "var(--surface-2)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, paddingTop: 14 }}>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: 8 }}>By rep</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {reason.repBreakdown.map(rb => (
                          <div key={rb.repName} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 18, height: 18, borderRadius: 5, background: "var(--info-light)", color: "var(--info)", fontSize: 7, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              {rb.avatar}
                            </div>
                            <span style={{ fontSize: 11, color: "var(--text-primary)", flex: 1 }}>{rb.repName.split(" ")[0]}</span>
                            <div style={{ width: 60, height: 4, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${(rb.count / maxRep) * 100}%`, background: cfg.color, borderRadius: 99 }} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, minWidth: 20, textAlign: "right" }}>{rb.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: 8 }}>Field notes</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        {reason.examples.map((ex, j) => (
                          <div key={j} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                            <span style={{ color: cfg.color, flexShrink: 0, fontSize: 12, marginTop: 1 }}>›</span>
                            <span style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5 }}>{ex}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom insight */}
      <div className="animate-fade-up" style={{ marginTop: 16, padding: "14px 18px", borderRadius: 12, background: "var(--danger-light)", border: "1px solid var(--danger-border)", display: "flex", gap: 10, animationDelay: "200ms" }}>
        <Lightbulb size={18} style={{ color: "var(--danger)", flexShrink: 0, marginTop: 2 }} />
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--danger)", margin: "0 0 3px" }}>Director Recommendation</p>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
            Price + competitor losses account for 44% of all lost deals. Kabir Singh (Beta) holds 21 losses — highest across the board.
            Recommend: (1) Review pricing strategy for SMB segment, (2) Coach Kabir on objection handling, (3) Build competitor comparison sheet for all reps.
          </p>
        </div>
      </div>
    </div>
  );
}