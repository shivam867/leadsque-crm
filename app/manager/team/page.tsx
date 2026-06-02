"use client";
import { useState, useMemo } from "react";
import { salesReps, leads } from "@/data/dummy";
import RepDetailPanel, { salesRepsExtended } from "@/components/ui/RepDetailPanel";

type SortKey = "conversionRate" | "wonThisMonth" | "leadsAssigned" | "callsToday";
type SortDir  = "asc" | "desc";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "conversionRate", label: "Conversion" },
  { key: "wonThisMonth",   label: "Won" },
  { key: "leadsAssigned",  label: "Leads" },
  { key: "callsToday",     label: "Calls" },
];

function RankBadge({ rank }: { rank: number }) {
  return (
    <span className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>
      {rank}
    </span>
  );
}

function TrendArrow({ value, threshold }: { value: number; threshold: number }) {
  const isGood = value >= threshold;
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke={isGood ? "#059669" : "#DC2626"} strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: isGood ? "none" : "rotate(180deg)" }}>
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

export default function ManagerTeam() {
  const [sortKey, setSortKey]             = useState<SortKey>("conversionRate");
  const [sortDir, setSortDir]             = useState<SortDir>("desc");
  const [teamFilter, setTeamFilter]       = useState("All");
  const [expanded, setExpanded]           = useState<string | null>(null);
  const [reassignModal, setReassignModal] = useState<string | null>(null);
  const [selectedRep, setSelectedRep]     = useState<any | null>(null);

  const teams = useMemo(() => ["All", ...Array.from(new Set(salesReps.map(r => r.team)))], []);

  const sorted = useMemo(() => {
    const filtered = teamFilter === "All" ? salesReps : salesReps.filter(r => r.team === teamFilter);
    return [...filtered].sort((a, b) =>
      sortDir === "desc" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]
    );
  }, [sortKey, sortDir, teamFilter]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  function getRepLeads(repName: string) {
    return leads.filter(l => l.assignedTo === repName);
  }

  function getLeadBreakdown(repName: string) {
    const repLeads = leads.filter(l => l.assignedTo === repName);
    return ["New", "Contacted", "Qualified", "Won", "Lost"].map(status => ({
      status,
      count: repLeads.filter(l => l.status === status).length,
    }));
  }

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>

        {/* Header */}
        <div className="animate-fade-up flex items-start justify-between mb-6">
          <div>
            <h1 className="page-title">Team Performance</h1>
            <p className="page-subtitle">
              {sorted.length} reps · Sorted by{" "}
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                {SORT_OPTIONS.find(s => s.key === sortKey)?.label}
              </span>{" "}
              · May 2025
            </p>
          </div>
          <div className="flex gap-1.5">
            {teams.map(t => (
              <button key={t} onClick={() => setTeamFilter(t)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: teamFilter === t ? "var(--accent)" : "var(--surface-2)",
                  color: teamFilter === t ? "#fff" : "var(--text-secondary)",
                  border: `1px solid ${teamFilter === t ? "var(--accent)" : "var(--border)"}`,
                }}>
                {t === "All" ? "All Teams" : `Team ${t}`}
              </button>
            ))}
          </div>
        </div>

        {/* Sort tabs */}
        <div className="animate-fade-up flex gap-2 mb-5" style={{ animationDelay: "40ms" }}>
          <span className="text-xs font-medium self-center mr-1" style={{ color: "var(--text-secondary)" }}>Sort by:</span>
          {SORT_OPTIONS.map(({ key, label }) => (
            <button key={key} onClick={() => toggleSort(key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: sortKey === key ? "#E0F2FE" : "var(--surface-2)",
                color: sortKey === key ? "#0369A1" : "var(--text-secondary)",
                border: `1px solid ${sortKey === key ? "#BAE6FD" : "var(--border)"}`,
              }}>
              {label}
              {sortKey === key && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: sortDir === "asc" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Rep list */}
        <div className="animate-fade-up card overflow-hidden" style={{ animationDelay: "80ms" }}>
          {/* Table header */}
          <div className="grid text-xs font-semibold uppercase tracking-wide px-5 py-3"
            style={{
              gridTemplateColumns: "2rem 1fr 6rem 6rem 6rem 6rem 10rem 7rem",
              borderBottom: "1px solid var(--border)",
              background: "var(--surface-2)",
              color: "var(--text-secondary)",
            }}>
            <span>#</span><span>Rep</span>
            <span className="text-right">Leads</span>
            <span className="text-right">Calls</span>
            <span className="text-right">Won</span>
            <span className="text-right">Conv.</span>
            <span className="px-2">Progress</span>
            <span />
          </div>

          {sorted.map((rep, i) => {
            const isExpanded = expanded === rep.id;
            const repLeads   = getRepLeads(rep.name);
            const openCount  = repLeads.filter(l => l.status === "New" || l.status === "Contacted").length;
            const convColor  = rep.conversionRate >= 35 ? "#059669" : rep.conversionRate >= 28 ? "#D97706" : "#DC2626";

            return (
              <div key={rep.id}
                className="animate-fade-up"
                style={{ borderBottom: "1px solid var(--border)", animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                <div
                  className="grid items-center px-5 py-3.5 cursor-pointer transition-colors"
                  style={{
                    gridTemplateColumns: "2rem 1fr 6rem 6rem 6rem 6rem 10rem 7rem",
                    background: isExpanded ? "var(--accent-light)" : undefined,
                  }}
                  onMouseEnter={e => { if (!isExpanded) (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; }}
                  onMouseLeave={e => { if (!isExpanded) (e.currentTarget as HTMLElement).style.background = ""; }}
                  onClick={() => {
                    setExpanded(isExpanded ? null : rep.id);
                    const fullRep = salesRepsExtended.find(r => r.name === rep.name);
                    if (fullRep) setSelectedRep({ ...fullRep, leadBreakdown: getLeadBreakdown(rep.name) });
                  }}>
                  <div className="flex items-center"><RankBadge rank={i + 1} /></div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ background: "#E0F2FE", color: "#0369A1" }}>
                      {rep.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{rep.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        Team {rep.team} · <span style={{ color: openCount > 5 ? "#DC2626" : "#059669" }}>{openCount} open</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-right text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{rep.leadsAssigned}</span>
                  <span className="text-right text-sm" style={{ color: "var(--text-secondary)" }}>{rep.callsToday}</span>
                  <span className="text-right text-sm font-semibold" style={{ color: "#059669" }}>{rep.wonThisMonth}</span>
                  <div className="flex items-center justify-end gap-1">
                    <TrendArrow value={rep.conversionRate} threshold={30} />
                    <span className="text-sm font-bold" style={{ color: convColor }}>{rep.conversionRate}%</span>
                  </div>
                  <div className="px-2">
                    <div className="h-2 rounded-full" style={{ background: "var(--border)" }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(rep.conversionRate, 100)}%`, background: convColor }} />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1"
                      style={{
                        background: isExpanded ? "var(--accent)" : "var(--surface-2)",
                        color: isExpanded ? "#fff" : "var(--text-secondary)",
                        border: "1px solid var(--border)",
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        const fullRep = salesRepsExtended.find(r => r.name === rep.name);
                        if (fullRep) setSelectedRep({ ...fullRep, leadBreakdown: getLeadBreakdown(rep.name) });
                      }}>
                      {isExpanded ? "Collapse" : "Details"}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 animate-fade-in"
                    style={{ background: "var(--accent-light)", borderTop: "1px solid var(--border)" }}>
                    <div className="flex gap-3">
                      {[
                        { label: `View Leads (${repLeads.length})`, icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", action: () => alert(`Viewing all leads for ${rep.name}`) },
                        { label: "Reassign Leads", icon: "M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3", action: () => setReassignModal(rep.id) },
                        { label: "Send Note", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", action: () => alert(`Sending coaching note to ${rep.name}`) },
                      ].map(btn => (
                        <button key={btn.label} className="btn-secondary text-xs py-2 px-4 flex-1 justify-center"
                          onClick={btn.action}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d={btn.icon} />
                          </svg>
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reassign modal */}
        {reassignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.35)" }}
            onClick={() => setReassignModal(null)}>
            <div className="card p-6 w-96 animate-fade-up" onClick={e => e.stopPropagation()}>
              <h3 className="font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>Reassign Leads</h3>
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                Select a rep to transfer <strong>{salesReps.find(r => r.id === reassignModal)?.name}'s</strong> leads to.
              </p>
              <div className="flex flex-col gap-2 mb-5">
                {salesReps.filter(r => r.id !== reassignModal).map(r => (
                  <button key={r.id}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-colors"
                    style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
                    onClick={() => { alert(`Leads reassigned to ${r.name}`); setReassignModal(null); }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: "#E0F2FE", color: "#0369A1" }}>
                      {r.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{r.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{r.leadsAssigned} leads currently</p>
                    </div>
                  </button>
                ))}
              </div>
              <button className="btn-secondary w-full justify-center text-sm" onClick={() => setReassignModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Side panel */}
      <div style={{ width: selectedRep ? 360 : 0, transition: "width 0.25s ease", overflow: "hidden", flexShrink: 0 }}>
        {selectedRep && (
          <RepDetailPanel
            rep={selectedRep}
            leadBreakdown={selectedRep.leadBreakdown}
            onClose={() => setSelectedRep(null)}
          />
        )}
      </div>
    </div>
  );
}