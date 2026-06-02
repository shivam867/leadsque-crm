"use client";
import { useState } from "react";
import { leads } from "@/data/dummy";
import { StatusBadge, ScoreBadge, PriorityDot } from "@/components/ui/Badges";
import LeadDetailPanel from "@/components/ui/LeadDetailPanel";
import LeadFullPage from "@/components/ui/LeadFullPage";
import type { Lead, LeadStatus, LeadScore } from "@/data/dummy";
import { Plus, Search, X, Filter, SlidersHorizontal } from "lucide-react";

const myLeads = leads.filter(l => l.assignedTo === "Aanya Sharma");

const STATUSES: LeadStatus[] = [
  "New", "Contacted", "Qualified", "Proposal Sent",
  "Negotiation", "Enrolled", "Not Interested", "Lost",
];

type View = "list" | "full";

export default function RepLeads() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "All">("All");
  const [scoreFilter, setScoreFilter] = useState<LeadScore | "All">("All");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [view, setView] = useState<View>("list");
  const [avatarIndex, setAvatarIndex] = useState(0);

  const filtered = myLeads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch =
      l.name.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      l.service.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || l.status === statusFilter;
    const matchScore  = scoreFilter === "All"  || l.score  === scoreFilter;
    return matchSearch && matchStatus && matchScore;
  });

  const handleSelectLead = (lead: Lead, index: number) => {
    setSelected(selected?.id === lead.id ? null : lead);
    setAvatarIndex(index % 4);
    setView("list");
  };

  const handleOpenFullPage = (lead: Lead) => { setSelected(lead); setView("full"); };
  const handleClosePanel   = ()           => { setSelected(null); setView("list"); };

  if (view === "full" && selected) {
    return <LeadFullPage lead={selected} onBack={() => setView("list")} avatarIndex={avatarIndex} />;
  }

  return (
    <div style={{ display: "flex", height: "100%", background: "#F9FAFB" }}>
      {/* List */}
      <div style={{ flex: 1, padding: "24px 28px", overflowY: "auto", minWidth: 0 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 4px", letterSpacing: "-0.02em" }}>My Leads</h1>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>{myLeads.length} leads assigned · {filtered.length} shown</p>
          </div>
          <a href="/rep/add-lead">
            <button style={{
              display: "flex", alignItems: "center", gap: 7, padding: "9px 18px",
              borderRadius: 10, background: "#111827", color: "#fff",
              fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer",
            }}>
              <Plus size={14} strokeWidth={2.5} /> Add Lead
            </button>
          </a>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative", flex: "0 0 260px" }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
              <input
                style={{
                  width: "100%", padding: "8px 10px 8px 30px", fontSize: 13, borderRadius: 9,
                  border: "1px solid #D1D5DB", background: "#fff", color: "#111827", boxSizing: "border-box",
                  outline: "none",
                }}
                placeholder="Search name, phone, course…"
                value={search} onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
                  <X size={13} style={{ color: "#9CA3AF" }} />
                </button>
              )}
            </div>

            {/* Score filter */}
            <div style={{ display: "flex", gap: 5 }}>
              {(["All", "Hot", "Warm", "Cold"] as const).map(s => (
                <button key={s} onClick={() => setScoreFilter(s)}
                  style={{
                    padding: "6px 12px", fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: "pointer",
                    background: scoreFilter === s ? "#111827" : "#fff",
                    color: scoreFilter === s ? "#fff" : "#374151",
                    border: `1.5px solid ${scoreFilter === s ? "#111827" : "#E5E7EB"}`,
                    transition: "all 0.15s",
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Status chips */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(["All", ...STATUSES] as const).map(s => {
              const count = s === "All" ? myLeads.length : myLeads.filter(l => l.status === s).length;
              const active = statusFilter === s;
              return (
                <button key={s} onClick={() => setStatusFilter(s as LeadStatus | "All")}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "5px 11px", fontSize: 12, fontWeight: 600, borderRadius: 99, cursor: "pointer",
                    background: active ? "#111827" : "#fff",
                    color: active ? "#fff" : "#374151",
                    border: `1.5px solid ${active ? "#111827" : "#E5E7EB"}`,
                    transition: "all 0.15s",
                  }}>
                  {s}
                  <span style={{ fontSize: 11, opacity: 0.7 }}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                {["Lead", "Contact", "Program", "Source", "Score", "Status", "Follow-up"].map(h => (
                  <th key={h} style={{
                    textAlign: "left", padding: "11px 16px", fontSize: 11, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.05em", color: "#6B7280",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => {
                const isSelected = selected?.id === lead.id;
                return (
                  <tr key={lead.id}
                    onClick={() => handleSelectLead(lead, i)}
                    style={{
                      borderBottom: "1px solid #F9FAFB", cursor: "pointer",
                      background: isSelected ? "#EFF6FF" : undefined, transition: "background 0.12s",
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#F9FAFB"; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = ""; }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <PriorityDot priority={lead.priority} />
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>{lead.name}</p>
                          <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>{lead.city}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#374151", fontFamily: "monospace" }}>
                      {lead.phone}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#374151" }}>{lead.service}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#374151" }}>{lead.source}</td>
                    <td style={{ padding: "12px 16px" }}><ScoreBadge score={lead.score} /></td>
                    <td style={{ padding: "12px 16px" }}><StatusBadge status={lead.status} /></td>
                    <td style={{ padding: "12px 16px", fontSize: 12, fontFamily: "monospace", color: lead.followUpDate ? "#374151" : "#9CA3AF" }}>
                      {lead.followUpDate || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: "48px 0", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
              No leads match your filters.
            </div>
          )}
        </div>
      </div>

      {/* Side panel */}
      {selected && (
        <LeadDetailPanel
          lead={selected}
          onClose={handleClosePanel}
          onOpenFullPage={handleOpenFullPage}
          avatarIndex={avatarIndex}
        />
      )}
    </div>
  );
}