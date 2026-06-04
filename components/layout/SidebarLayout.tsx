"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarLayoutProps {
  children: React.ReactNode;
  role: "rep" | "manager" | "director";
  navItems: NavItem[];
  userName: string;
  userAvatar: string;
}

const roleConfig = {
  rep:      { label: "Sales Rep",   color: "var(--accent)",  bg: "var(--accent-light)",  dot: "var(--accent)"  },
  manager:  { label: "Team Leader", color: "var(--info)",    bg: "var(--info-light)",    dot: "var(--info)"    },
  director: { label: "Director",    color: "var(--accent)",  bg: "var(--accent-light)",  dot: "var(--accent)"  },
};

export default function SidebarLayout({ children, role, navItems, userName, userAvatar }: SidebarLayoutProps) {
  const pathname = usePathname();
  const cfg = roleConfig[role];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg)" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 216, flexShrink: 0,
        display: "flex", flexDirection: "column", height: "100%",
        background: "var(--surface)", borderRight: "1px solid var(--border)",
      }}>

        {/* Logo */}
        <Link href="/"
          style={{ height: 52, display: "flex", alignItems: "center", gap: 9, padding: "0 16px", borderBottom: "1px solid var(--border)", textDecoration: "none", transition: "opacity .15s" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.8"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}>
          <div style={{ width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "#171717" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
            LeadQueue
          </span>
        </Link>

        {/* Role badge */}
        <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 9px", borderRadius: 7, background: cfg.bg }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", flexShrink: 0, background: cfg.dot }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 10px", display: "flex", flexDirection: "column", gap: 1, overflowY: "auto" }}>
          <p style={{ padding: "0 6px", marginBottom: 5, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
            Navigation
          </p>
          {navItems.map(item => {
            const basePath = `/${role}`;
            const isRoot   = item.href === basePath;
            const isActive = isRoot ? pathname === basePath : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}
                className={`nav-item ${isActive ? "active" : ""}`}
                style={{ borderRadius: 6 }}>
                <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding: "10px 10px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, marginBottom: 4, background: "var(--surface-2)" }}>
            <div style={{
              width: 30, height: 30, borderRadius: 7,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, flexShrink: 0,
              background: "#171717", color: "#fff",
            }}>
              {userAvatar}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {userName}
              </p>
              <p style={{ fontSize: 10, color: "var(--text-muted)", margin: 0 }}>{cfg.label}</p>
            </div>
          </div>
          <Link href="/" className="nav-item" style={{ color: "var(--text-muted)", fontSize: 12, borderRadius: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to roles
          </Link>
        </div>
      </aside>

      {/* ── Content ── */}
      <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </div>
  );
}