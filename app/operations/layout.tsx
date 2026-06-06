import SidebarLayout from "@/components/layout/SidebarLayout";
import DesktopOnly from "@/components/ui/DesktopOnly";

const navItems = [
  {
    label: "Dashboard",
    href: "/operations",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
];

export default function RepLayout({ children }: { children: React.ReactNode }) {
  return (
    <DesktopOnly>
      <SidebarLayout role="rep" navItems={navItems} userName="Aanya Sharma" userAvatar="AS">
        {children}
      </SidebarLayout>
    </DesktopOnly>
  );
}