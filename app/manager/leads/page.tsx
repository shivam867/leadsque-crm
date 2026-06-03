"use client";
import { useState } from "react";
import { leads, salesReps } from "@/data/dummy";
import { StatusBadge, ScoreBadge, PriorityDot } from "@/components/ui/Badges";
import LeadDetailPanel from "@/components/ui/LeadDetailPanel";
import LeadDetailPage from "@/components/lead-detail/LeadDetailPage";
import type { Lead } from "@/data/dummy";

type View = "list" | "full";

export default function ManagerLeads() {
  const [search, setSearch]           = useState("");
  const [repFilter, setRepFilter]     = useState("All");
  const [selected, setSelected]       = useState<Lead | null>(null);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [view, setView]               = useState<View>("list");

  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = l.name.toLowerCase().includes(q) || l.phone.includes(q);
    const matchRep    = repFilter === "All" || l.assignedTo === repFilter;
    return matchSearch && matchRep;
  });

  const handleSelectLead = (lead: Lead, index: number) => {
    setSelected(prev => prev?.id === lead.id ? null : lead);
    setAvatarIndex(index % 4);
    setView("list");
  };

  const handleOpenFullPage = (lead: Lead) => { setSelected(lead); setView("full"); };

  if (view === "full" && selected) {
    return <LeadDetailPage lead={selected} onBack={() => setView("list")} />;
  }

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ flex: 1, padding: 24, overflowY: "auto", minWidth: 0 }}>

        {/* Header */}
        <div className="animate-fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h1 className="page-title">All Leads</h1>
            <p className="page-subtitle">{leads.length} leads across all reps</p>
          </div>
        </div>

        {/* Filters */}
        <div className="animate-fade-up" style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", animationDelay: "40ms" }}>
          <input
            className="input"
            style={{ maxWidth: 240 }}
            placeholder="Search leads…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="input"
            style={{ width: 180 }}
            value={repFilter}
            onChange={e => setRepFilter(e.target.value)}>
            <option value="All">All Reps</option>
            {salesReps.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="animate-fade-up card" style={{ overflow: "hidden", animationDelay: "80ms" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
                {["Lead", "Contact", "Service", "Assigned To", "Score", "Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <tr key={lead.id}
                  onClick={() => handleSelectLead(lead, i)}
                  className="animate-fade-up"
                  style={{
                    borderBottom: "1px solid var(--border)",
                    cursor: "pointer",
                    background: selected?.id === lead.id ? "var(--accent-light)" : undefined,
                    transition: "background .12s",
                    animationDelay: `${Math.min(i, 10) * 25}ms`,
                  }}
                  onMouseEnter={e => { if (selected?.id !== lead.id) (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; }}
                  onMouseLeave={e => { if (selected?.id !== lead.id) (e.currentTarget as HTMLElement).style.background = ""; }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <PriorityDot priority={lead.priority} />
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)", margin: 0 }}>{lead.name}</p>
                        <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0 }}>{lead.city} · {lead.id}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, fontFamily: "monospace", color: "var(--text-secondary)" }}>{lead.phone}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-secondary)" }}>{lead.service}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent-light)", color: "var(--accent)" }}>
                        {lead.assignedTo.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{lead.assignedTo}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}><ScoreBadge score={lead.score} /></td>
                  <td style={{ padding: "12px 16px" }}><StatusBadge status={lead.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: "64px 0", textAlign: "center", color: "var(--text-secondary)", fontSize: 13 }}>
              No leads match your filters.
            </div>
          )}
        </div>
      </div>

      {selected && view === "list" && (
        <LeadDetailPanel
          lead={selected}
          onClose={() => { setSelected(null); setView("list"); }}
          onOpenFullPage={handleOpenFullPage}
          avatarIndex={avatarIndex}
        />
      )}
    </div>
  );
}