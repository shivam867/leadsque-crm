import { ManagerCalendar } from "@/components/ui/Calendars";

export const metadata = {
  title: "Team Call Calendar | Manager View",
  description: "Monitor team-wide call activity and rep performance.",
};

export default function ManagerPage() {
  return (
    <main className="min-h-screen bg-white">
      <ManagerCalendar />
    </main>
  );
}