"use client";
import { useState } from "react";
import { leads, salesReps } from "@/data/dummy";
import { StatusBadge, ScoreBadge, PriorityDot } from "@/components/ui/Badges";
import LeadDetailPanel from "@/components/ui/LeadDetailPanel";
import LeadFullPage from "@/components/ui/LeadFullPage";
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
    return <LeadFullPage lead={selected} onBack={() => setView("list")} avatarIndex={avatarIndex} />;
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 overflow-y-auto min-w-0">

        {/* Header */}
        <div className="animate-fade-up flex items-center justify-between mb-5">
          <div>
            <h1 className="page-title">All Leads</h1>
            <p className="page-subtitle">{leads.length} leads across all reps</p>
          </div>
        </div>

        {/* Filters */}
        <div className="animate-fade-up flex gap-2.5 mb-4 flex-wrap" style={{ animationDelay: "40ms" }}>
          <input className="input" style={{ maxWidth: 240 }} placeholder="Search leads…"
            value={search} onChange={e => setSearch(e.target.value)} />
          <select className="input" style={{ width: 180 }} value={repFilter}
            onChange={e => setRepFilter(e.target.value)}>
            <option value="All">All Reps</option>
            {salesReps.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="animate-fade-up card overflow-hidden" style={{ animationDelay: "80ms" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
                {["Lead", "Contact", "Service", "Assigned To", "Score", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <tr key={lead.id}
                  onClick={() => handleSelectLead(lead, i)}
                  className="animate-fade-up cursor-pointer transition-colors"
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: selected?.id === lead.id ? "var(--accent-light)" : undefined,
                    animationDelay: `${Math.min(i, 10) * 25}ms`,
                  }}
                  onMouseEnter={e => { if (selected?.id !== lead.id) (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; }}
                  onMouseLeave={e => { if (selected?.id !== lead.id) (e.currentTarget as HTMLElement).style.background = ""; }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <PriorityDot priority={lead.priority} />
                      <div>
                        <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{lead.name}</p>
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{lead.city} · {lead.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: "var(--text-secondary)" }}>{lead.phone}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>{lead.service}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center"
                        style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                        {lead.assignedTo.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{lead.assignedTo}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><ScoreBadge score={lead.score} /></td>
                  <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center" style={{ color: "var(--text-secondary)" }}>
              No leads match your filters.
            </div>
          )}
        </div>
      </div>

      {selected && (
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