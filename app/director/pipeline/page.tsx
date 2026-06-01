"use client";
import { leads, pipelineStages } from "@/data/dummy";
import { StatusBadge, ScoreBadge } from "@/components/ui/Badges";

export default function DirectorPipeline() {
  const hotLeads = leads.filter((l) => l.score === "Hot");
  const totalValue = "₹1.07 Cr";

  return (
    <div className="p-7 max-w-5xl">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-secondary)" }}>
          Live pipeline overview
        </p>
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-primary)" }}
        >
          Pipeline Health
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
          Total value:{" "}
          <strong style={{ color: "var(--text-primary)" }}>{totalValue}</strong> across{" "}
          {leads.length} leads
        </p>
      </div>

      {/* Stage overview cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
        {pipelineStages.map((s, i) => (
          <div
            key={s.stage}
            className="card p-4 animate-fade-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              {s.stage}
            </p>
            <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              {s.count}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Hot leads table */}
      <div className="card overflow-hidden animate-fade-up delay-200">
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: "0.5px solid var(--border)" }}
        >
          <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>
            Hot Leads — Immediate Attention
          </h2>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: "#fee2e2", color: "#7f1d1d" }}
          >
            {hotLeads.length} urgent
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "0.5px solid var(--border)", background: "var(--surface-2)" }}>
                {["Lead", "Service", "Assigned Rep", "Status", "Follow-up"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hotLeads.map((lead) => (
                <tr
                  key={lead.id}
                  style={{ borderBottom: "0.5px solid var(--border)" }}
                  className="hover:bg-stone-50 transition-colors"
                >
                  {/* Lead name + city */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <ScoreBadge score={lead.score} />
                      <div>
                        <div className="font-semibold" style={{ color: "var(--text-primary)" }}>
                          {lead.name}
                        </div>
                        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          {lead.city}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Service */}
                  <td className="px-5 py-3.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {lead.service}
                  </td>

                  {/* Assigned rep */}
                  <td className="px-5 py-3.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {lead.assignedTo}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <StatusBadge status={lead.status} />
                  </td>

                  {/* Follow-up date */}
                  <td
                    className="px-5 py-3.5 text-xs font-mono"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {lead.followUpDate || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}