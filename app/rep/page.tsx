"use client";
import StatCard from "@/components/ui/StatCard";
import { StatusBadge, ScoreBadge, PriorityDot } from "@/components/ui/Badges";
import { leads, repDashboard } from "@/data/dummy";
import Link from "next/link";

const myLeads = leads.filter((l) => l.assignedTo === "Aanya Sharma");
const hotLeads = myLeads.filter((l) => l.score === "Hot");
const overdue = myLeads.filter((l) => l.status === "Follow-up");

const callOutcomes = [
  { label: "No Answer", color: "#6B7280", count: 5 },
  { label: "Interested", color: "#059669", count: 7 },
  { label: "Busy", color: "#D97706", count: 3 },
  { label: "Call Later", color: "#0369A1", count: 2 },
  { label: "Wrong #", color: "#DC2626", count: 1 },
];

export default function RepDashboard() {
  return (
    <div className="p-7 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-fade-up">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: "#374151" }}>
            Wednesday, 27 May 2025
          </p>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text-primary)", fontFamily: "'Syne', sans-serif" }}>
            Good morning, Aanya 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            You have <strong>{repDashboard.pendingFollowUps}</strong> follow-ups due today.
          </p>
        </div>
        <Link href="/rep/add-lead">
          <button className="btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Lead
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard
          label="Leads Today"
          value={repDashboard.leadsToday}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
          delay="0ms"
        />
        <StatCard
          label="Calls Made"
          value={repDashboard.callsMade}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.18 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 5.55 5.55l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>}
          delay="60ms"
          accentColor="#0369A1"
        />
        <StatCard
          label="Pending Follow-ups"
          value={repDashboard.pendingFollowUps}
          sub={`${repDashboard.overdueFollowUps} overdue`}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
          delay="120ms"
          accentColor="#D97706"
        />
        <StatCard
          label="Won This Month"
          value={repDashboard.wonThisMonth}
          sub={`${repDashboard.conversionRate}% conversion`}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
          delay="180ms"
          accentColor="#059669"
          trend="up"
          trendValue="12%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* My leads */}
        <div className="lg:col-span-2 card p-0 overflow-hidden animate-fade-up delay-200">
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>My Leads</h2>
            <Link href="/rep/leads" className="text-xs font-medium" style={{ color: "var(--accent)" }}>
              View all →
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {myLeads.slice(0, 5).map((lead, i) => (
              <div
                key={lead.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-stone-50 transition-colors"
                style={{ animationDelay: `${200 + i * 50}ms` }}
              >
                <PriorityDot priority={lead.priority} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate" style={{ color: "var(--text-primary)" }}>
                      {lead.name}
                    </span>
                    <ScoreBadge score={lead.score} />
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "#374151" }}>
                    {lead.service} · {lead.city}
                  </p>
                </div>
                <StatusBadge status={lead.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Today's call outcomes */}
          <div className="card p-5 animate-fade-up delay-250">
            <h2 className="font-semibold text-base mb-4" style={{ color: "var(--text-primary)" }}>Today's Calls</h2>
            <div className="flex flex-col gap-2.5">
              {callOutcomes.map((o) => (
                <div key={o.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: o.color }} />
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{o.label}</span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{o.count}</span>
                </div>
              ))}
              <div className="mt-1 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#374151" }}>Total</span>
                  <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                    {callOutcomes.reduce((a, b) => a + b.count, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Overdue follow-ups */}
          <div className="card p-5 animate-fade-up delay-300">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>Follow-ups Due</h2>
              {overdue.length > 0 && (
                <span className="badge" style={{ background: "var(--danger-light)", color: "var(--danger)" }}>
                  {overdue.length}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {overdue.map((lead) => (
                <div key={lead.id} className="flex flex-col gap-0.5 p-3 rounded-xl" style={{ background: "var(--surface-2)" }}>
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{lead.name}</span>
                  <span className="text-xs" style={{ color: "#374151" }}>{lead.followUpDate} · {lead.service}</span>
                </div>
              ))}
              {overdue.length === 0 && (
                <p className="text-sm text-center py-3" style={{ color: "#374151" }}>All clear! ✓</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
