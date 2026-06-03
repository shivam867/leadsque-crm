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
    <span style={{
      fontSize: 11, fontWeight: 700, width: 24, height: 24, borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      background: "var(--surface-2)", color: "var(--text-secondary)",
    }}>
      {rank}
    </span>
  );
}

function TrendArrow({ value, threshold }: { value: number; threshold: number }) {
  const isGood = value >= threshold;
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke={isGood ? "var(--success)" : "var(--danger)"} strokeWidth="2.5"
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

  const convColor = (rate: number) =>
    rate >= 35 ? "var(--success)" : rate >= 28 ? "var(--warning)" : "var(--danger)";

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>

        {/* Header */}
        <div className="animate-fade-up" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 className="page-title">Team Performance</h1>
            <p className="page-subtitle">
              {sorted.length} reps · Sorted by{" "}
              <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                {SORT_OPTIONS.find(s => s.key === sortKey)?.label}
              </span>{" "}
              · May 2025
            </p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {teams.map(t => (
              <button key={t} onClick={() => setTeamFilter(t)}
                style={{
                  padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .15s",
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
        <div className="animate-fade-up" style={{ display: "flex", gap: 8, marginBottom: 20, animationDelay: "40ms" }}>
          <span style={{ fontSize: 12, fontWeight: 500, alignSelf: "center", marginRight: 4, color: "var(--text-secondary)" }}>Sort by:</span>
          {SORT_OPTIONS.map(({ key, label }) => (
            <button key={key} onClick={() => toggleSort(key)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .15s",
                background: sortKey === key ? "var(--info-light)" : "var(--surface-2)",
                color: sortKey === key ? "var(--info)" : "var(--text-secondary)",
                border: `1px solid ${sortKey === key ? "var(--info-border)" : "var(--border)"}`,
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
        <div className="animate-fade-up card" style={{ overflow: "hidden", animationDelay: "80ms" }}>
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2rem 1fr 6rem 6rem 6rem 6rem 10rem 7rem",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface-2)",
            padding: "10px 20px",
          }}>
            {["#", "Rep", "Leads", "Calls", "Won", "Conv.", "Progress", ""].map((h, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", textAlign: i >= 2 && i <= 5 ? "right" : "left" }}>{h}</span>
            ))}
          </div>

          {sorted.map((rep, i) => {
            const isExpanded = expanded === rep.id;
            const repLeads   = getRepLeads(rep.name);
            const openCount  = repLeads.filter(l => l.status === "New" || l.status === "Contacted").length;
            const color      = convColor(rep.conversionRate);

            return (
              <div key={rep.id} className="animate-fade-up" style={{ borderBottom: "1px solid var(--border)", animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                <div
                  style={{
                    display: "grid", alignItems: "center", padding: "14px 20px", cursor: "pointer", transition: "background .14s",
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
                  <div style={{ display: "flex", alignItems: "center" }}><RankBadge rank={i + 1} /></div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0, background: "var(--info-light)", color: "var(--info)" }}>
                      {rep.avatar}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)", margin: 0 }}>{rep.name}</p>
                      <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>
                        Team {rep.team} · <span style={{ color: openCount > 5 ? "var(--danger)" : "var(--success)" }}>{openCount} open</span>
                      </p>
                    </div>
                  </div>

                  <span style={{ textAlign: "right", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{rep.leadsAssigned}</span>
                  <span style={{ textAlign: "right", fontSize: 14, color: "var(--text-secondary)" }}>{rep.callsToday}</span>
                  <span style={{ textAlign: "right", fontSize: 14, fontWeight: 600, color: "var(--success)" }}>{rep.wonThisMonth}</span>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                    <TrendArrow value={rep.conversionRate} threshold={30} />
                    <span style={{ fontSize: 14, fontWeight: 700, color }}>{rep.conversionRate}%</span>
                  </div>
                  <div style={{ padding: "0 8px" }}>
                    <div style={{ height: 8, borderRadius: 99, background: "var(--border)" }}>
                      <div style={{ height: "100%", borderRadius: 99, transition: "width 0.7s", width: `${Math.min(rep.conversionRate, 100)}%`, background: color }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: 12, padding: "6px 12px", display: "flex", alignItems: "center", gap: 4, background: isExpanded ? "var(--accent)" : undefined, color: isExpanded ? "#fff" : undefined }}
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
                  <div className="animate-fade-in" style={{ padding: "12px 20px 20px", background: "var(--accent-light)", borderTop: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", gap: 12 }}>
                      {[
                        { label: `View Leads (${repLeads.length})`, icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", action: () => alert(`Viewing all leads for ${rep.name}`) },
                        { label: "Reassign Leads", icon: "M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3", action: () => setReassignModal(rep.id) },
                        { label: "Send Note", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", action: () => alert(`Sending coaching note to ${rep.name}`) },
                      ].map(btn => (
                        <button key={btn.label} className="btn-secondary" style={{ flex: 1, justifyContent: "center", fontSize: 12 }} onClick={btn.action}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)" }}
            onClick={() => setReassignModal(null)}>
            <div className="card animate-fade-up" style={{ padding: 24, width: 384 }} onClick={e => e.stopPropagation()}>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", margin: "0 0 4px" }}>Reassign Leads</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
                Select a rep to transfer <strong>{salesReps.find(r => r.id === reassignModal)?.name}'s</strong> leads to.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {salesReps.filter(r => r.id !== reassignModal).map(r => (
                  <button key={r.id}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 11, textAlign: "left", cursor: "pointer", transition: "border-color .15s", border: "1px solid var(--border)", background: "var(--surface-2)" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
                    onClick={() => { alert(`Leads reassigned to ${r.name}`); setReassignModal(null); }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, background: "var(--info-light)", color: "var(--info)" }}>
                      {r.avatar}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{r.name}</p>
                      <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>{r.leadsAssigned} leads currently</p>
                    </div>
                  </button>
                ))}
              </div>
              <button className="btn-secondary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setReassignModal(null)}>
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