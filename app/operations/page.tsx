"use client";

import { useState } from "react";
import { Users, CheckCircle, AlertCircle, DollarSign } from "lucide-react";
import { enrolledLeads, PAYMENT_COLORS, AVATAR_PALETTE, type EnrolledLead } from "../../data/enrolment";
import EnrolmentPanel from "@/components/ui/EnrolmentDetailPanel";

const SERVICE_COLORS = ["#6366f1", "#0ea5e9", "#d97706", "#059669", "#ec4899"];

export default function OperationsDashboard() {
  const [selected, setSelected]       = useState<EnrolledLead | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [search, setSearch]           = useState("");
  const [filterPayment, setFilterPayment] = useState("All");
  const [filterBatch, setFilterBatch]     = useState("All");

  const totalRevenue = enrolledLeads.reduce((s, l) => s + l.fee, 0);
  const paid         = enrolledLeads.filter(l => l.paymentStatus === "Paid").length;
  const partial      = enrolledLeads.filter(l => l.paymentStatus === "Partial").length;
  const pending      = enrolledLeads.filter(l => l.paymentStatus === "Pending").length;

  const batchCounts: Record<string, number> = {};
  enrolledLeads.forEach(l => { batchCounts[l.batch] = (batchCounts[l.batch] || 0) + 1; });

  const serviceCounts: Record<string, number> = {};
  enrolledLeads.forEach(l => { serviceCounts[l.service] = (serviceCounts[l.service] || 0) + 1; });

  const batches = ["All", ...Array.from(new Set(enrolledLeads.map(l => l.batch))).sort()];

  const filtered = enrolledLeads.filter(l => {
    const q = search.toLowerCase();
    return (
      (l.name.toLowerCase().includes(q) || l.service.toLowerCase().includes(q) || l.city.toLowerCase().includes(q)) &&
      (filterPayment === "All" || l.paymentStatus === filterPayment) &&
      (filterBatch   === "All" || l.batch          === filterBatch)
    );
  });

  return (
    <div style={{ display: "flex", height: "100%", background: "var(--bg)", overflow: "hidden" }}>

      {/* ── Main scroll area ── */}
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "24px 28px" }}>

        {/* Header */}
        <div className="animate-fade-up" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.07em" }}>
            Wednesday, 28 May 2025
          </p>
          <h1 className="page-title" style={{ margin: "0 0 4px" }}>Operations Overview </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>
            {enrolledLeads.length} enrolled students across {Object.keys(batchCounts).length} active batches
          </p>
        </div>

        {/* KPI cards */}
        <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16, animationDelay: "40ms" }}>
          {[
            { label: "Total Enrolled",   value: enrolledLeads.length,                    icon: <Users size={15} /> },
            { label: "Revenue This Mo.", value: `₹${(totalRevenue / 1000).toFixed(0)}K`, icon: <DollarSign size={15} /> },
            { label: "Fully Paid",       value: paid,                                     icon: <CheckCircle size={15} /> },
            { label: "Pending Payment",  value: pending,                                  icon: <AlertCircle size={15} /> },
          ].map((s, i) => (
            <div key={s.label} className="card animate-fade-up" style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, animationDelay: `${i * 30}ms` }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--text-primary)" }}>
                {s.icon}
              </div>
              <div>
                <p style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 1px", letterSpacing: "-0.04em", lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary row */}
        <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16, animationDelay: "80ms" }}>

          <div className="card" style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", margin: "0 0 10px" }}>Payment Status</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Fully Paid", count: paid,    color: "#059669" },
                { label: "Partial",    count: partial,  color: "#d97706" },
                { label: "Pending",    count: pending,  color: "#dc2626" },
              ].map(({ label, count, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "var(--text-secondary)", flex: 1 }}>{label}</span>
                  <div style={{ width: 60, height: 4, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(count / enrolledLeads.length) * 100}%`, background: color, borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", minWidth: 20, textAlign: "right" }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", margin: "0 0 10px" }}>Batch Strength</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.entries(batchCounts).sort().map(([batch, count], i) => (
                <div key={batch} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", minWidth: 60 }}>{batch}</span>
                  <div style={{ flex: 1, height: 4, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(count / 5) * 100}%`, background: SERVICE_COLORS[i % SERVICE_COLORS.length], borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", minWidth: 16, textAlign: "right" }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", margin: "0 0 10px" }}>Programs</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).map(([svc, count]) => (
                <div key={svc} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ fontSize: 11, color: "var(--text-secondary)", flex: 1 }}>{svc}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full student table */}
        <div className="animate-fade-up card" style={{ overflow: "hidden", animationDelay: "120ms" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid var(--border)", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
              All Enrolments
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginLeft: 8 }}>{filtered.length} students</span>
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search name, program, city…"
                style={{ fontSize: 12, padding: "6px 11px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-primary)", outline: "none", width: 210 }}
              />
              <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)}
                style={{ fontSize: 12, padding: "6px 10px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-primary)", outline: "none" }}>
                {["All", "Paid", "Partial", "Pending"].map(o => <option key={o}>{o}</option>)}
              </select>
              <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)}
                style={{ fontSize: 12, padding: "6px 10px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--text-primary)", outline: "none" }}>
                {batches.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-2)" }}>
                {["Student", "Program", "Batch", "Rep", "Fee", "Payment", "Kit", "Enrolled On"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "9px 18px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => {
                const isSelected = selected?.id === lead.id;
                const av = AVATAR_PALETTE[i % AVATAR_PALETTE.length];
                return (
                  <tr
                    key={lead.id}
                    onClick={() => { setSelected(lead); setSelectedIdx(i); }}
                    style={{
                      borderTop: "1px solid var(--surface-2)", cursor: "pointer",
                      background: isSelected ? "var(--surface-2)" : "",
                      borderLeft: isSelected ? "3px solid #6366f1" : "3px solid transparent",
                      transition: "background .1s",
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = ""; }}
                  >
                    <td style={{ padding: "10px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: av.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11, color: av.text }}>
                          {lead.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{lead.name}</p>
                          <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: 0 }}>{lead.city}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "10px 18px", fontSize: 12, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{lead.service}</td>
                    <td style={{ padding: "10px 18px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 99, background: "var(--surface-2)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
                        {lead.batch}
                      </span>
                    </td>
                    <td style={{ padding: "10px 18px", fontSize: 12, color: "var(--text-secondary)" }}>{lead.rep.split(" ")[0]}</td>
                    <td style={{ padding: "10px 18px", fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>₹{lead.fee.toLocaleString("en-IN")}</td>
                    <td style={{ padding: "10px 18px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 99, background: PAYMENT_COLORS[lead.paymentStatus] + "15", color: PAYMENT_COLORS[lead.paymentStatus], border: `1px solid ${PAYMENT_COLORS[lead.paymentStatus]}30` }}>
                        {lead.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: "10px 18px", fontSize: 12, fontWeight: 600, color: lead.kitStatus === "Dispatched" ? "#059669" : "#d97706", whiteSpace: "nowrap" }}>
                      {lead.kitStatus}
                    </td>
                    <td style={{ padding: "10px 18px", fontSize: 12, fontFamily: "monospace", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{lead.enrolledOn}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                    No students match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Side panel ── */}
      {selected && (
        <EnrolmentPanel
          lead={selected}
          idx={selectedIdx}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}