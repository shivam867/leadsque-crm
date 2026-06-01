interface StatCardProps {
  label: string; value: string|number; sub?: string;
  icon: React.ReactNode; trend?: "up"|"down"|"neutral";
  trendValue?: string; accentColor?: string; delay?: string;
}
export default function StatCard({ label, value, sub, icon, trend, trendValue, accentColor="#4F46E5", delay="0ms" }: StatCardProps) {
  return (
    <div className="card p-4 flex flex-col gap-3 animate-fade-up" style={{ animationDelay:delay }}>
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background:"var(--surface-2)", color:accentColor }}>
          {icon}
        </div>
        {trend && trendValue && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: trend==="up" ? "var(--success-light)" : trend==="down" ? "var(--danger-light)" : "var(--surface-2)",
              color:      trend==="up" ? "var(--success)" : trend==="down" ? "var(--danger)" : "var(--text-muted)",
            }}>
            {trend==="up"?"↑":trend==="down"?"↓":"—"} {trendValue}
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight" style={{ color:"var(--text-primary)" }}>{value}</div>
        <div className="text-sm" style={{ color:"var(--text-secondary)" }}>{label}</div>
        {sub && <div className="text-xs mt-0.5" style={{ color:"var(--text-muted)" }}>{sub}</div>}
      </div>
    </div>
  );
}
