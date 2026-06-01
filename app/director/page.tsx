"use client";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { directorDashboard, revenueByMonth, pipelineStages, salesReps, leadSources } from "@/data/dummy";
import StatCard from "@/components/ui/StatCard";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="card p-3 text-xs shadow-sm"
        style={{ minWidth: 130, border: "0.5px solid var(--border)" }}
      >
        <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          {label}
        </p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: ₹{p.value}L
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SourceTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="card p-3 text-xs shadow-sm"
        style={{ minWidth: 120, border: "0.5px solid var(--border)" }}
      >
        <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          {label}
        </p>
        <p style={{ color: "#378add" }}>Leads: {payload[0]?.value}</p>
      </div>
    );
  }
  return null;
};

export default function DirectorDashboard() {
  return (
    <div className="p-7 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-fade-up">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-secondary)" }}>
            Revenue Intelligence · Director View
          </p>
          <h1 className="text-3xl tracking-tight" style={{ color: "var(--text-primary)", fontFamily: "'Syne', sans-serif" }}>
            {directorDashboard.totalRevenue}
            <span className="text-xl ml-2 font-normal" style={{ color: "#0e9f6e" }}>
              {directorDashboard.revenueGrowth} YoY
            </span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Forecast:{" "}
            <strong style={{ color: "var(--text-primary)" }}>{directorDashboard.forecastThisQuarter}</strong> this
            quarter · Team health:{" "}
            <strong style={{ color: "#0e9f6e" }}>{directorDashboard.teamHealth}/100</strong>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background: "#eff6ff", color: "#1a56db", border: "0.5px solid #bfdbfe" }}>
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "#1a56db" }}
          />
          May 2025 · Live
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard
          label="Total Leads"
          value={directorDashboard.totalLeads}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            </svg>
          }
          delay="0ms"
        />
        <StatCard
          label="Deals Won"
          value={directorDashboard.wonDeals}
          sub={`${directorDashboard.conversionRate}% conversion`}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          }
          delay="60ms"
          accentColor="#0e9f6e"
          trend="up"
          trendValue="18%"
        />
        <StatCard
          label="Deals Lost"
          value={directorDashboard.lostDeals}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          }
          delay="120ms"
          accentColor="#e02424"
        />
        <StatCard
          label="Avg Deal Value"
          value={directorDashboard.avgDealValue}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
          delay="180ms"
          accentColor="#7e3af2"
          trend="up"
          trendValue="6%"
        />
      </div>

      {/* Revenue chart + Top Sources Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
        {/* Revenue chart */}
        <div className="lg:col-span-3 card p-5 animate-fade-up delay-200">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>
              Revenue vs Target
            </h2>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: "#eff6ff", color: "#1a56db" }}
            >
              ₹ Lakhs
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueByMonth} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a56db" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#1a56db" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#1a56db"
                strokeWidth={2}
                fill="url(#revGrad)"
                name="Revenue"
                dot={{ fill: "#1a56db", r: 3 }}
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#d1d5db"
                strokeWidth={1.5}
                fill="none"
                strokeDasharray="5 3"
                name="Target"
              />
            </AreaChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
              <span className="w-3 h-0.5 rounded" style={{ background: "#1a56db", display: "inline-block" }} />
              Revenue
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
              <span className="w-3 h-0.5 rounded border-t border-dashed" style={{ borderColor: "#d1d5db", display: "inline-block" }} />
              Target
            </span>
          </div>
        </div>

        {/* Top Sources Analysis */}
        <div className="lg:col-span-2 card p-5 animate-fade-up delay-250">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            Lead velocity &amp; performance
          </p>
          <h2 className="font-semibold text-base mb-4" style={{ color: "var(--text-primary)" }}>
            Top Sources Analysis
          </h2>

          {/* Bar chart */}
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={leadSources} margin={{ top: 0, right: 0, left: -30, bottom: 0 }} barSize={22}>
              <XAxis
                dataKey="source"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: string) => v.split(" ")[0]}
              />
              <YAxis hide />
              <Tooltip content={<SourceTooltip />} />
              <Bar dataKey="leads" fill="#378add" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Source list */}
          <div className="mt-2 divide-y" style={{ borderColor: "var(--border)" }}>
            {leadSources.map((src) => (
              <div key={src.source} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {src.source}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {src.leads} leads · {src.closed} closed
                  </p>
                </div>
                <span className="text-base font-bold" style={{ color: "#e3a008" }}>
                  {src.conversionRate}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline funnel + Rep bar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Pipeline funnel */}
        <div className="lg:col-span-2 card p-5 animate-fade-up delay-300">
          <h2 className="font-semibold text-base mb-4" style={{ color: "var(--text-primary)" }}>
            Pipeline Funnel
          </h2>
          <div className="flex flex-col gap-2.5">
            {pipelineStages.slice(0, 6).map((s, i) => {
              const maxCount = Math.max(...pipelineStages.map((x) => x.count));
              const pct = (s.count / maxCount) * 100;
              const colors = ["#1a56db", "#1d4ed8", "#0e9f6e", "#b45309", "#7e3af2", "#065f46"];
              return (
                <div key={s.stage}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span style={{ color: "var(--text-secondary)" }}>{s.stage}</span>
                    <div className="flex items-center gap-3">
                      <span style={{ color: "var(--text-secondary)" }}>{s.value}</span>
                      <span className="font-bold" style={{ color: colors[i] }}>
                        {s.count}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "var(--surface-2)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: colors[i] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rep bar chart */}
        <div className="lg:col-span-3 card p-5 animate-fade-up delay-350">
          <h2 className="font-semibold text-base mb-5" style={{ color: "var(--text-primary)" }}>
            Rep-wise Conversion · All Teams
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={salesReps} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={26}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: string) => v.split(" ")[0]}
              />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} domain={[0, 50]} />
              <Tooltip
                content={({ active, payload }: any) =>
                  active && payload?.length ? (
                    <div className="card p-3 text-xs" style={{ border: "0.5px solid var(--border)" }}>
                      <p className="font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>
                        {payload[0]?.payload?.name}
                      </p>
                      <p style={{ color: "#1a56db" }}>Conversion: {payload[0]?.value}%</p>
                      <p style={{ color: "#0e9f6e" }}>Won: {payload[0]?.payload?.wonThisMonth}</p>
                    </div>
                  ) : null
                }
              />
              <Bar
                dataKey="conversionRate"
                name="Conversion %"
                radius={[5, 5, 0, 0]}
                fill="#1a56db"
                fillOpacity={0.85}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}