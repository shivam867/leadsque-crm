"use client";
import { useState } from "react";
import { leads } from "@/data/dummy";
import { StatusBadge, ScoreBadge, PriorityDot } from "@/components/ui/Badges";
import LeadDetailPanel from "@/components/ui/LeadDetailPanel";
import LeadFullPage from "@/components/ui/LeadFullPage";
import CallIntelligencePage from "@/components//ui/CallIntelligencePage";
import type { Lead, LeadStatus } from "@/data/dummy";
import { Plus, Search, X } from "lucide-react";

const myLeads = leads.filter(l => l.assignedTo === "Aanya Sharma");
const STATUSES: LeadStatus[] = ["New", "Contacted", "Interested", "Follow-up", "Qualified", "Won", "Lost", "Spam"];

type View = "list" | "full" | "intel";

export default function RepLeads() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "All">("All");
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
    return matchSearch && matchStatus;
  });

  const handleSelectLead = (lead: Lead, index: number) => {
    setSelected(selected?.id === lead.id ? null : lead);
    setAvatarIndex(index % 4);
    setView("list");
  };

  const handleOpenFullPage = (lead: Lead) => {
    setSelected(lead);
    setView("full");
  };

  const handleOpenCallIntelligence = (lead: Lead) => {
    setSelected(lead);
    setView("intel");
  };

  const handleClosePanel = () => {
    setSelected(null);
    setView("list");
  };

  // ── Full-screen views ──────────────────────────────────────────
  if (view === "full" && selected) {
    return (
      <LeadFullPage
        lead={selected}
        onBack={() => setView("list")}
        onOpenCallIntelligence={handleOpenCallIntelligence}
        avatarIndex={avatarIndex}
      />
    );
  }

  if (view === "intel" && selected) {
    return (
      <CallIntelligencePage
        lead={selected}
        onBack={() => setView("full")}
      />
    );
  }

  // ── List + side panel ──────────────────────────────────────────
  return (
    <div className="flex h-full">
      {/* List */}
      <div className="flex-1 p-6 overflow-y-auto min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-5 animate-fade-up">
          <div>
            <h1 className="text-xl font-bold tracking-tight mb-0.5" style={{ color: "var(--text-primary)" }}>
              My Leads
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {myLeads.length} leads assigned to you
            </p>
          </div>
          <a href="/rep/add-lead">
            <button className="btn-primary">
              <Plus size={14} />
              Add Lead
            </button>
          </a>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col gap-3 mb-4 animate-fade-up delay-50">
          <div className="relative" style={{ maxWidth: 280 }}>
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#374151" }} />
            <input
              className="input pr-8"
              style={{ paddingLeft: "34px" }}
              placeholder="Search name, phone, course…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X size={12} style={{ color: "#374151" }} />
              </button>
            )}
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {(["All", ...STATUSES] as const).map(s => {
              const count = s === "All" ? myLeads.length : myLeads.filter(l => l.status === s).length;
              const isActive = statusFilter === s;
              return (
                <button key={s} onClick={() => setStatusFilter(s as any)}
                  className="flex items-center gap-1.5 badge cursor-pointer transition-all"
                  style={{
                    padding: "4px 10px",
                    background: isActive ? "var(--accent)" : "var(--surface)",
                    color: isActive ? "#fff" : "var(--text-secondary)",
                    border: `1px solid ${isActive ? "var(--accent)" : "var(--border-strong)"}`,
                  }}>
                  {s}
                  <span className="text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden animate-fade-up delay-100">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
                {["Lead", "Contact", "Course", "Source", "Score", "Status", "Follow-up"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "#374151" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <tr key={lead.id}
                  onClick={() => handleSelectLead(lead, i)}
                  className="cursor-pointer transition-colors animate-fade-up"
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: selected?.id === lead.id ? "var(--accent-light)" : undefined,
                    animationDelay: `${i * 25}ms`,
                  }}
                  onMouseEnter={e => { if (selected?.id !== lead.id) (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; }}
                  onMouseLeave={e => { if (selected?.id !== lead.id) (e.currentTarget as HTMLElement).style.background = ""; }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <PriorityDot priority={lead.priority} />
                      <div>
                        <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{lead.name}</p>
                        <p className="text-xs" style={{ color: "#374151" }}>{lead.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs"
                    style={{ color: "#374151", fontFamily: "'JetBrains Mono', monospace" }}>
                    {lead.phone}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>{lead.service}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#374151" }}>{lead.source}</td>
                  <td className="px-4 py-3"><ScoreBadge score={lead.score} /></td>
                  <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                  <td className="px-4 py-3 text-xs font-mono"
                    style={{ color: lead.followUpDate ? "var(--text-secondary)" : "#374151" }}>
                    {lead.followUpDate || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center" style={{ color: "#374151" }}>
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
          onOpenCallIntelligence={handleOpenCallIntelligence}
          avatarIndex={avatarIndex}
        />
      )}
    </div>
  );
}