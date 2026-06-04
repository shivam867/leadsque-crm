"use client";
import { useState } from "react";
import { leads } from "@/data/dummy";
import { StatusBadge, ScoreBadge, PriorityDot } from "@/components/ui/Badges";
import LeadDetailPanel from "@/components/ui/LeadDetailPanel";
import LeadDetailPage from "@/components/lead-detail/LeadDetailPage";
import type { Lead, LeadStatus, LeadScore } from "@/data/dummy";
import { Plus, Search, X } from "lucide-react";

const myLeads = leads.filter(l => l.assignedTo === "Aanya Sharma");

const STATUSES: LeadStatus[] = [
  "New", "Contacted", "Qualified", "Proposal Sent",
  "Negotiation", "Enrolled", "Not Interested", "Lost",
];

type View = "list" | "full";

export default function RepLeads() {
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "All">("All");
  const [scoreFilter, setScoreFilter]   = useState<LeadScore | "All">("All");
  const [selected, setSelected]         = useState<Lead | null>(null);
  const [view, setView]                 = useState<View>("list");

  const filtered = myLeads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch =
      l.name.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      l.service.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || l.status === statusFilter;
    const matchScore  = scoreFilter  === "All" || l.score  === scoreFilter;
    return matchSearch && matchStatus && matchScore;
  });

  const handleSelectLead = (lead: Lead) => {
    setSelected(selected?.id === lead.id ? null : lead);
    setView("list");
  };

  const handleOpenFullPage = (lead: Lead) => { setSelected(lead); setView("full"); };
  const handleClosePanel   = () => { setSelected(null); setView("list"); };

  if (view === "full" && selected) {
    return <LeadDetailPage lead={selected} onBack={() => setView("list")} />;
  }

  const panelOpen = selected && view === "list";

  return (
    <div style={{ display: "flex", height: "100%", background: "var(--bg)" }}>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

        {/* Header */}
        <div className="animate-fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px", borderBottom: "1px solid var(--border)", background: "var(--surface)", flexShrink: 0 }}>
          <div>
            <h1 className="page-title" style={{ fontSize: 18, marginBottom: 2 }}>My Leads</h1>
            <p className="page-subtitle">{myLeads.length} assigned · {filtered.length} shown</p>
          </div>
          <a href="/rep/add-lead">
            <button className="btn-primary"><Plus size={13} strokeWidth={2.5} /> Add Lead</button>
          </a>
        </div>

        {/* Filters */}
        <div className="animate-fade-up" style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)", background: "var(--surface)", flexShrink: 0, animationDelay: "30ms" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
            <div style={{ position: "relative", flex: "0 0 240px" }}>
              <Search size={12} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                className="input"
                style={{ paddingLeft: 28, fontSize: 12, height: 34 }}
                placeholder="Search name, phone, course…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex" }}>
                  <X size={12} style={{ color: "var(--text-muted)" }} />
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {(["All", "Hot", "Warm", "Cold"] as const).map(s => (
                <button key={s} onClick={() => setScoreFilter(s)}
                  style={{
                    padding: "5px 12px", fontSize: 11, fontWeight: 600, borderRadius: 5, cursor: "pointer", transition: "all .12s",
                    background: scoreFilter === s ? "var(--text-primary)" : "var(--surface)",
                    color: scoreFilter === s ? "#fff" : "var(--text-secondary)",
                    border: `1px solid ${scoreFilter === s ? "var(--text-primary)" : "var(--border-strong)"}`,
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {(["All", ...STATUSES] as const).map(s => {
              const count  = s === "All" ? myLeads.length : myLeads.filter(l => l.status === s).length;
              const active = statusFilter === s;
              return (
                <button key={s} onClick={() => setStatusFilter(s as LeadStatus | "All")}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "4px 10px", fontSize: 11, fontWeight: 600,
                    borderRadius: 99, cursor: "pointer",
                    background: active ? "var(--text-primary)" : "transparent",
                    color: active ? "#fff" : "var(--text-secondary)",
                    border: `1px solid ${active ? "var(--text-primary)" : "var(--border)"}`,
                    transition: "all 0.12s",
                  }}>
                  {s}<span style={{ fontSize: 10, opacity: 0.65 }}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table — fills all remaining height */}
        <div className="animate-fade-up" style={{ flex: 1, overflowY: "auto", animationDelay: "60ms" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                {["Lead", "Contact", "Program", "Source", "Score", "Status", "Follow-up"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 18px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => {
                const isSelected = selected?.id === lead.id;
                return (
                  <tr key={lead.id}
                    onClick={() => handleSelectLead(lead)}
                    className="animate-fade-up"
                    style={{
                      borderBottom: "1px solid var(--surface-2)",
                      cursor: "pointer",
                      background: isSelected ? "var(--accent-light)" : undefined,
                      transition: "background 0.1s",
                      animationDelay: `${Math.min(i, 10) * 25}ms`,
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = ""; }}>
                    <td style={{ padding: "11px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <PriorityDot priority={lead.priority} />
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{lead.name}</p>
                          <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0 }}>{lead.city}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "11px 18px", fontSize: 11, color: "var(--text-secondary)", fontFamily: "monospace" }}>{lead.phone}</td>
                    <td style={{ padding: "11px 18px", fontSize: 11, color: "var(--text-secondary)" }}>{lead.service}</td>
                    <td style={{ padding: "11px 18px", fontSize: 11, color: "var(--text-secondary)" }}>{lead.source}</td>
                    <td style={{ padding: "11px 18px" }}><ScoreBadge score={lead.score} /></td>
                    <td style={{ padding: "11px 18px" }}><StatusBadge status={lead.status} /></td>
                    <td style={{ padding: "11px 18px", fontSize: 11, fontFamily: "monospace", color: lead.followUpDate ? "var(--text-secondary)" : "var(--text-muted)" }}>
                      {lead.followUpDate || "—"}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "52px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                    No leads match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Side panel — pushes table left, no empty space ── */}
      {panelOpen && (
        <LeadDetailPanel
          lead={selected}
          onClose={handleClosePanel}
          onOpenFullPage={handleOpenFullPage}
          avatarIndex={0}
        />
      )}
    </div>
  );
}