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
  rep: {
    label: "Sales Rep",
    color: "#4F46E5",
    bg: "#EEF2FF",
    dot: "#4F46E5",
  },
  manager: {
    label: "Team Leader",
    color: "#0284C7",
    bg: "#F0F9FF",
    dot: "#0284C7",
  },
  director: {
    label: "Director",
    color: "#7C3AED",
    bg: "#FAF5FF",
    dot: "#7C3AED",
  },
};

export default function SidebarLayout({
  children,
  role,
  navItems,
  userName,
  userAvatar,
}: SidebarLayoutProps) {
  const pathname = usePathname();
  const cfg = roleConfig[role];

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Sidebar */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col h-full"
        style={{
          background: "var(--sidebar-bg)",
          borderRight: "1px solid var(--sidebar-border)",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="px-5 h-14 flex items-center gap-2.5 transition-opacity hover:opacity-90"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--accent)" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>

          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: "-0.01em",
              color: "var(--text-primary)",
            }}
          >
            LeadFlow
          </span>
        </Link>

        {/* Role badge */}
        <div
          className="px-4 py-3"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
            style={{ background: cfg.bg }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: cfg.dot }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: cfg.color,
              }}
            >
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5 overflow-y-auto">
          <p
            className="px-2 mb-1.5 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            Navigation
          </p>

          {navItems.map((item) => {
            // Exact match for root role pages
            // Prefix match for sub-pages

            const basePath = `/${role}`;

            const isRoot = item.href === basePath;

            const isActive = isRoot
              ? pathname === basePath
              : pathname === item.href ||
                pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <span className="flex-shrink-0 opacity-80">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div
          className="p-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div
            className="flex items-center gap-2.5 p-2.5 rounded-lg mb-2"
            style={{ background: "var(--surface-2)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: cfg.color,
                color: "#fff",
              }}
            >
              {userAvatar}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {userName}
              </p>

              <p
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                {cfg.label}
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="nav-item"
            style={{
              color: "var(--text-muted)",
              fontSize: 12,
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>

            Back to roles
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}