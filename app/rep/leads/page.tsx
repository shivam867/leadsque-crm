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

  const handleOpenFullPage = (lead: Lead) => {
    setSelected(lead);
    setView("full");
  };

  const handleClosePanel = () => {
    setSelected(null);
    setView("list");
  };

  if (view === "full" && selected) {
    return <LeadDetailPage lead={selected} onBack={() => setView("list")} />;
  }

  return (
    <div style={{ display: "flex", height: "100%", background: "var(--bg)" }}>
      <div style={{ flex: 1, padding: "24px 28px", overflowY: "auto", minWidth: 0 }}>

        {/* Header */}
        <div className="animate-fade-up" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h1 className="page-title">My Leads</h1>
            <p className="page-subtitle">
              {myLeads.length} leads assigned · {filtered.length} shown
            </p>
          </div>
          <a href="/rep/add-lead">
            <button className="btn-primary">
              <Plus size={14} strokeWidth={2.5} /> Add Lead
            </button>
          </a>
        </div>

        {/* Filters */}
        <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18, animationDelay: "40ms" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ position: "relative", flex: "0 0 260px" }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                className="input"
                style={{ paddingLeft: 30 }}
                placeholder="Search name, phone, course…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
                  <X size={13} style={{ color: "var(--text-muted)" }} />
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              {(["All", "Hot", "Warm", "Cold"] as const).map(s => (
                <button key={s} onClick={() => setScoreFilter(s)}
                  className={scoreFilter === s ? "btn-primary" : "btn-secondary"}
                  style={{ padding: "6px 12px", fontSize: 12 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(["All", ...STATUSES] as const).map(s => {
              const count  = s === "All" ? myLeads.length : myLeads.filter(l => l.status === s).length;
              const active = statusFilter === s;
              return (
                <button key={s} onClick={() => setStatusFilter(s as LeadStatus | "All")}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "5px 11px", fontSize: 12, fontWeight: 600,
                    borderRadius: 99, cursor: "pointer",
                    background: active ? "var(--text-primary)" : "var(--surface)",
                    color: active ? "#fff" : "var(--text-secondary)",
                    border: `1.5px solid ${active ? "var(--text-primary)" : "var(--border)"}`,
                    transition: "all 0.15s",
                  }}>
                  {s}<span style={{ fontSize: 11, opacity: 0.7 }}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="animate-fade-up card" style={{ overflow: "hidden", animationDelay: "80ms" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                {["Lead", "Contact", "Program", "Source", "Score", "Status", "Follow-up"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "11px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>{h}</th>
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
                      transition: "background 0.12s",
                      animationDelay: `${Math.min(i, 10) * 30}ms`,
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = ""; }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <PriorityDot priority={lead.priority} />
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{lead.name}</p>
                          <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0 }}>{lead.city}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-secondary)", fontFamily: "monospace" }}>{lead.phone}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-secondary)" }}>{lead.service}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-secondary)" }}>{lead.source}</td>
                    <td style={{ padding: "12px 16px" }}><ScoreBadge score={lead.score} /></td>
                    <td style={{ padding: "12px 16px" }}><StatusBadge status={lead.status} /></td>
                    <td style={{ padding: "12px 16px", fontSize: 12, fontFamily: "monospace", color: lead.followUpDate ? "var(--text-secondary)" : "var(--text-muted)" }}>
                      {lead.followUpDate || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: "48px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              No leads match your filters.
            </div>
          )}
        </div>
      </div>

      {selected && view === "list" && (
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