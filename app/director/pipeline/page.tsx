"use client";
import React, { useState } from "react";
import { leads, pipelineStages, salesReps } from "@/data/dummy";
import { StatusBadge, ScoreBadge } from "@/components/ui/Badges";
import { Flame, Filter, X } from "lucide-react";

type ScoreFilter = "all" | "Hot" | "Warm" | "Cold";
type TeamFilter  = "All" | "Alpha" | "Beta" | "Gamma";

// Data-driven stage colors — intentional chart palette
const STAGE_COLORS = ["#1D4ED8", "#475569", "#0369A1", "#7C3AED", "#B45309", "#065F46", "#DC2626"];

const enrichedLeads = leads.map(l => ({
  ...l,
  team: salesReps.find(r => r.name === l.assignedTo)?.team ?? "Alpha",
}));

const stageHealth = pipelineStages.map((s, i) => {
  const stageLeads = enrichedLeads.filter(l => l.status === s.stage);
  const hotCount   = stageLeads.filter(l => l.score === "Hot").length;
  const avgScore   = stageLeads.reduce((acc, l) => acc + (l.leadScore ?? 50), 0) / (stageLeads.length || 1);
  return { ...s, leads: stageLeads, hotCount, avgScore: Math.round(avgScore), color: STAGE_COLORS[i] };
});

const leadScoreColor = (score: number) =>
  score >= 70 ? "var(--success)" : score >= 40 ? "var(--warning)" : "var(--text-muted)";

export default function DirectorPipeline() {
  const [scoreFilter, setScoreFilter]   = useState<ScoreFilter>("all");
  const [teamFilter, setTeamFilter]     = useState<TeamFilter>("All");
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const filtered = enrichedLeads.filter(l => {
    const matchScore = scoreFilter === "all" || l.score === scoreFilter;
    const matchTeam  = teamFilter === "All" || l.team === teamFilter;
    const matchStage = !selectedStage || l.status === selectedStage;
    return matchScore && matchTeam && matchStage;
  });

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1080, background: "var(--bg)", minHeight: "100%" }}>

      {/* Header */}
      <div className="animate-fade-up" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: 4 }}>
          Live pipeline overview · Director View
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
          <h1 className="page-title">Pipeline Health</h1>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--success)" }}>₹1.07 Cr total</span>
        </div>
        <p className="page-subtitle">
          {leads.length} leads across all teams · {leads.filter(l => l.score === "Hot").length} hot · {stageHealth.find(s => s.stage === "Enrolled")?.leads.length ?? 0} enrolled this cycle
        </p>
      </div>

      {/* Funnel stages */}
      <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 20, animationDelay: "40ms" }}>
        {stageHealth.map(s => (
          <button key={s.stage} onClick={() => setSelectedStage(selectedStage === s.stage ? null : s.stage)}
            style={{ padding: "14px 12px", borderRadius: 11, border: `1.5px solid ${selectedStage === s.stage ? s.color : "var(--border)"}`, background: selectedStage === s.stage ? s.color + "12" : "var(--surface)", cursor: "pointer", textAlign: "left", transition: "all .15s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {s.stage.split(" ")[0]}
              </span>
            </div>
            <p style={{ fontSize: 22, fontWeight: 800, color: s.color, margin: "0 0 2px", letterSpacing: "-0.03em" }}>{s.count}</p>
            <p style={{ fontSize: 10, color: "var(--text-secondary)", margin: "0 0 6px" }}>{s.value}</p>
            {s.hotCount > 0 && (
              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 5px", borderRadius: 99, background: "var(--danger-light)", color: "var(--danger)", display: "flex", alignItems: "center", gap: 3, width: "fit-content" }}>
                <Flame size={8} /> {s.hotCount} hot
              </span>
            )}
            <div style={{ marginTop: 8, height: 3, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(s.count / Math.max(...stageHealth.map(x => x.count))) * 100}%`, background: s.color, borderRadius: 99 }} />
            </div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="animate-fade-up" style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", animationDelay: "80ms" }}>
        <Filter size={12} style={{ color: "var(--text-muted)" }} />
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Score:</span>
        {(["all", "Hot", "Warm", "Cold"] as const).map(f => (
          <button key={f} onClick={() => setScoreFilter(f)}
            style={{ padding: "5px 12px", fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: "pointer", transition: "all .15s", background: scoreFilter === f ? "var(--text-primary)" : "var(--surface)", color: scoreFilter === f ? "#fff" : "var(--text-secondary)", border: `1.5px solid ${scoreFilter === f ? "var(--text-primary)" : "var(--border)"}` }}>
            {f === "all" ? "All" : f}
          </button>
        ))}
        <div style={{ width: 1, height: 20, background: "var(--border)", margin: "0 4px" }} />
        <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Team:</span>
        {(["All", "Alpha", "Beta", "Gamma"] as const).map(t => (
          <button key={t} onClick={() => setTeamFilter(t)}
            style={{ padding: "5px 12px", fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: "pointer", transition: "all .15s", background: teamFilter === t ? "var(--accent)" : "var(--surface)", color: teamFilter === t ? "#fff" : "var(--text-secondary)", border: `1.5px solid ${teamFilter === t ? "var(--accent)" : "var(--border)"}` }}>
            {t}
          </button>
        ))}
        {(selectedStage || scoreFilter !== "all" || teamFilter !== "All") && (
          <button onClick={() => { setSelectedStage(null); setScoreFilter("all"); setTeamFilter("All"); }}
            style={{ marginLeft: "auto", fontSize: 11, padding: "5px 12px", borderRadius: 8, background: "var(--surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
            <X size={11} /> Clear filters
          </button>
        )}
      </div>

      {/* Lead table */}
      <div className="animate-fade-up card" style={{ overflow: "hidden", animationDelay: "120ms" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface-2)" }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
            {selectedStage ? `${selectedStage} — ` : "All Leads — "}{filtered.length} records
          </h2>
          <div style={{ display: "flex", gap: 8 }}>
            <span className="badge" style={{ background: "var(--danger-light)", color: "var(--danger)" }}>{filtered.filter(l => l.score === "Hot").length} hot</span>
            <span className="badge" style={{ background: "var(--warning-light)", color: "var(--warning)" }}>{filtered.filter(l => l.score === "Warm").length} warm</span>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                {["Lead", "Score", "Team", "Assigned Rep", "Service", "Status", "Follow-up", "Lead Score"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <tr key={lead.id} className="animate-fade-up"
                  style={{ borderBottom: "1px solid var(--border)", transition: "background .12s", animationDelay: `${Math.min(i, 10) * 25}ms` }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ""}>
                  <td style={{ padding: "11px 14px" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 1px" }}>{lead.name}</p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{lead.city}</p>
                  </td>
                  <td style={{ padding: "11px 14px" }}><ScoreBadge score={lead.score} /></td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                      {lead.team}
                    </span>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: "var(--info-light)", color: "var(--info)", fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {salesReps.find(r => r.name === lead.assignedTo)?.avatar ?? "??"}
                      </div>
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{lead.assignedTo.split(" ")[0]}</span>
                    </div>
                  </td>
                  <td style={{ padding: "11px 14px", fontSize: 12, color: "var(--text-secondary)" }}>{lead.service}</td>
                  <td style={{ padding: "11px 14px" }}><StatusBadge status={lead.status} /></td>
                  <td style={{ padding: "11px 14px", fontSize: 11, fontFamily: "monospace", color: lead.followUpDate ? "var(--text-secondary)" : "var(--text-muted)" }}>
                    {lead.followUpDate || "—"}
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    {lead.leadScore != null ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 48, height: 5, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${lead.leadScore}%`, background: leadScoreColor(lead.leadScore), borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: leadScoreColor(lead.leadScore) }}>{lead.leadScore}</span>
                      </div>
                    ) : <span style={{ color: "var(--text-muted)", fontSize: 12 }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: "48px 0", textAlign: "center", color: "var(--text-secondary)", fontSize: 13 }}>
              No leads match the current filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}