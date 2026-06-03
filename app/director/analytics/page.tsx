"use client";
import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell,
} from "recharts";
import { Lightbulb } from "lucide-react";
import { teamSummaries, sourceROI, repLeaderboard, revenueByTeam, directorKPIs } from "@/data/directordummy";
import { salesReps } from "@/data/dummy";

type Tab = "teams" | "reps" | "sources";

// These are data-driven chart colors — intentional named palette, not UI chrome
const TEAM_COLORS = { Alpha: "#1a56db", Beta: "#7e3af2", Gamma: "#0e9f6e" };

const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--text-primary)", border: "1px solid #3F3F46", borderRadius: 10, padding: "10px 14px" }}>
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 5, fontWeight: 600 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: 12, color: p.color, margin: "2px 0" }}>
          {p.name}: <strong>{p.value}{p.name === "Conv." ? "%" : ""}</strong>
        </p>
      ))}
    </div>
  );
};

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 2px" }}>{children}</h2>
      {sub && <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>{sub}</p>}
    </div>
  );
}

const convColor = (rate: number) =>
  rate >= 35 ? "var(--success)" : rate >= 28 ? "var(--warning)" : "var(--danger)";

export default function DirectorAnalytics() {
  const [tab, setTab] = useState<Tab>("teams");

  const TABS: { key: Tab; label: string }[] = [
    { key: "teams",   label: "Team Comparison" },
    { key: "reps",    label: "Rep Leaderboard" },
    { key: "sources", label: "Source ROI" },
  ];

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1080, background: "var(--bg)", minHeight: "100%" }}>

      {/* Header */}
      <div className="animate-fade-up" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: 4 }}>
          Cross-team performance · Director View
        </p>
        <h1 className="page-title">Analytics</h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>May 2025 · {directorKPIs.activeReps} reps · 3 teams</p>
      </div>

      {/* Tab bar */}
      <div className="animate-fade-up" style={{ display: "flex", gap: 4, marginBottom: 20, background: "var(--surface-2)", borderRadius: 10, padding: 4, width: "fit-content", animationDelay: "40ms" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "8px 18px", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s",
            background: tab === t.key ? "var(--surface)" : "transparent",
            color: tab === t.key ? "var(--text-primary)" : "var(--text-secondary)",
            border: tab === t.key ? "1px solid var(--border)" : "1px solid transparent",
            boxShadow: tab === t.key ? "0 1px 3px rgba(0,0,0,.06)" : "none",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TEAM COMPARISON ── */}
      {tab === "teams" && (
        <div className="animate-fade-in">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
            {teamSummaries.map((team, i) => (
              <div key={team.team} className="animate-fade-up card" style={{ padding: "18px 20px", animationDelay: `${i * 40}ms` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: team.color }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Team {team.team}</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "var(--success)" }}>{team.trend}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                  {[
                    { label: "Leads",      value: team.leads },
                    { label: "Enrolled",   value: team.won,              color: "var(--success)" },
                    { label: "Calls",      value: team.calls },
                    { label: "Conversion", value: `${team.conversion}%`, color: team.color },
                  ].map(s => (
                    <div key={s.label} style={{ background: "var(--surface-2)", borderRadius: 8, padding: "8px 10px" }}>
                      <p style={{ fontSize: 10, color: "var(--text-muted)", margin: "0 0 1px" }}>{s.label}</p>
                      <p style={{ fontSize: 18, fontWeight: 800, color: (s as any).color ?? "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: 8 }}>Reps</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {salesReps.filter(r => r.team === team.team).sort((a, b) => b.conversionRate - a.conversionRate).map(rep => (
                    <div key={rep.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 20, height: 20, borderRadius: 6, background: team.bg, color: team.color, fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {rep.avatar}
                      </div>
                      <span style={{ fontSize: 11, color: "var(--text-primary)", flex: 1 }}>{rep.name.split(" ")[0]}</span>
                      <div style={{ width: 48, height: 4, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${rep.conversionRate * 2}%`, background: convColor(rep.conversionRate), borderRadius: 99 }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: convColor(rep.conversionRate), minWidth: 28, textAlign: "right" }}>{rep.conversionRate}%</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Leads Won</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "var(--success)" }}>{team.won} enrolled</span>
                </div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 4 }}>
                    <span style={{ color: "var(--text-muted)" }}>Target {team.targetAchieved}%</span>
                    <span style={{ color: team.color, fontWeight: 700 }}>{team.forecast} forecast</span>
                  </div>
                  <div style={{ height: 5, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${team.targetAchieved}%`, background: team.color, borderRadius: 99 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="animate-fade-up card" style={{ padding: 20, animationDelay: "120ms" }}>
            <SectionTitle sub="Monthly enrollments per team">Enrollments by Team · Jan–Jun 2025</SectionTitle>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueByTeam} margin={{ top: 5, right: 0, left: -20, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="Alpha" fill={TEAM_COLORS.Alpha} radius={[4, 4, 0, 0]} name="Alpha" />
                <Bar dataKey="Beta"  fill={TEAM_COLORS.Beta}  radius={[4, 4, 0, 0]} name="Beta" />
                <Bar dataKey="Gamma" fill={TEAM_COLORS.Gamma} radius={[4, 4, 0, 0]} name="Gamma" />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              {Object.entries(TEAM_COLORS).map(([label, color]) => (
                <span key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-muted)" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: color, display: "inline-block" }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── REP LEADERBOARD ── */}
      {tab === "reps" && (
        <div className="animate-fade-in">
          <div className="animate-fade-up card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface-2)" }}>
              <SectionTitle sub="All reps ranked by conversion rate — May 2025">Rep Leaderboard</SectionTitle>
              <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "var(--surface)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                {repLeaderboard.length} reps
              </span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                  {["#", "Rep", "Team", "Leads", "Calls", "Won", "Conv. Rate", "Badge"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {repLeaderboard.map((rep, i) => (
                  <tr key={rep.id} className="animate-fade-up"
                    style={{ borderBottom: "1px solid var(--border)", animationDelay: `${Math.min(i, 6) * 30}ms`, transition: "background .12s" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ""}>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: rep.rank <= 3 ? "var(--warning)" : "var(--text-muted)" }}>
                        {rep.medal ?? rep.rank}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 9, background: "var(--info-light)", color: "var(--info)", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {rep.avatar}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{rep.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 99, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                        {rep.team}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{rep.leadsAssigned}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-secondary)" }}>{rep.callsToday}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "var(--success)" }}>{rep.wonThisMonth}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 60, height: 5, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${rep.conversionRate * 2}%`, background: convColor(rep.conversionRate), borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: convColor(rep.conversionRate) }}>
                          {rep.conversionRate}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 99, background: rep.badgeBg, color: rep.badgeColor }}>
                        {rep.badge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="animate-fade-up" style={{ marginTop: 14, padding: "14px 18px", borderRadius: 12, background: "var(--info-light)", border: "1px solid var(--info-border)", display: "flex", gap: 12, alignItems: "flex-start", animationDelay: "80ms" }}>
            <Lightbulb size={18} color="var(--info)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--info)", margin: "0 0 3px" }}>Coaching opportunity: Kabir Singh</p>
              <p style={{ fontSize: 11, color: "var(--info)", margin: 0, lineHeight: 1.6 }}>
                At 22% conversion, Kabir is 11 points below team average. His 12 price-related losses are the highest on the team.
                Recommend targeted pricing objection training and joint calls with manager Sunita Rao.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── SOURCE ROI ── */}
      {tab === "sources" && (
        <div className="animate-fade-in">
          <div className="animate-fade-up card" style={{ overflow: "hidden", marginBottom: 14 }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
              <SectionTitle sub="Cost per lead, deal value and ROI by acquisition channel">Source ROI Analysis</SectionTitle>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                  {["Source", "Leads", "Enrolled", "Conv.", "Cost/Lead", "Avg Deal", "ROI"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sourceROI
                  .sort((a, b) => {
                    const roiA = a.costPerLead === 0 ? 999 : (a.conversionRate * a.avgDealValue) / (a.costPerLead * a.leads);
                    const roiB = b.costPerLead === 0 ? 999 : (b.conversionRate * b.avgDealValue) / (b.costPerLead * b.leads);
                    return roiB - roiA;
                  })
                  .map((src, i) => {
                    const roi = src.costPerLead === 0
                      ? "∞"
                      : `${((src.conversionRate * src.avgDealValue) / (src.costPerLead * src.leads + 1)).toFixed(0)}×`;
                    const roiGood = src.costPerLead === 0 || parseFloat(roi) > 5;
                    const convC = src.conversionRate >= 30 ? "var(--success)" : src.conversionRate >= 15 ? "var(--warning)" : "var(--danger)";
                    return (
                      <tr key={src.source} className="animate-fade-up"
                        style={{ borderBottom: "1px solid var(--border)", animationDelay: `${i * 30}ms`, transition: "background .12s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ""}>
                        <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{src.source}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-secondary)" }}>{src.leads}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "var(--success)" }}>{src.enrolled}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: convC }}>{src.conversionRate}%</span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-secondary)" }}>
                          {src.costPerLead === 0 ? <span style={{ color: "var(--success)", fontWeight: 700 }}>Free</span> : `₹${src.costPerLead.toLocaleString()}`}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-secondary)" }}>₹{src.avgDealValue.toLocaleString()}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: roiGood ? "var(--success)" : "var(--warning)", padding: "2px 8px", borderRadius: 99, background: roiGood ? "var(--success-light)" : "var(--warning-light)" }}>
                            {roi}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="animate-fade-up card" style={{ padding: 20, animationDelay: "80ms" }}>
            <SectionTitle sub="Lead volume by acquisition channel">Lead Volume by Source</SectionTitle>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={sourceROI} margin={{ top: 5, right: 0, left: -20, bottom: 0 }} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="source" tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} tickFormatter={v => v.split(" ")[0]} />
                <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="leads" name="Leads" radius={[4, 4, 0, 0]}>
                  {sourceROI.map(s => (
                    <Cell key={s.source} fill={s.conversionRate >= 30 ? TEAM_COLORS.Alpha : s.conversionRate >= 15 ? TEAM_COLORS.Beta : "var(--text-muted)"} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}