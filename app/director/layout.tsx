import SidebarLayout from "@/components/layout/SidebarLayout";
import DesktopOnly from "@/components/ui/DesktopOnly";

const navItems = [
  {
    label: "Revenue Intel",
    href: "/director",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" /></svg>,
  },
  {
    label: "Pipeline Health",
    href: "/director/pipeline",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  },
  {
    label: "Team Analytics",
    href: "/director/analytics",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  },
];

export default function DirectorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DesktopOnly>
      <SidebarLayout role="director" navItems={navItems} userName="Neha Kapoor" userAvatar="NK">
        {children}
      </SidebarLayout>
    </DesktopOnly>
  );
}
