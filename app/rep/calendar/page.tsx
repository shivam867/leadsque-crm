import { RepCalendar } from "@/components/ui/Calendars";

export const metadata = {
  title: "My Call Calendar | Rep View",
  description: "Track your daily call activity and outcomes.",
};

export default function RepPage() {
  return (
    <main className="min-h-screen bg-white">
      <RepCalendar />
    </main>
  );
}