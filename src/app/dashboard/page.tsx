import Link from "next/link";
import EventForm from "@/components/EventForm";
import EventList from "@/components/EventList";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return <div className="p-6">Please log in.</div>;

  const [events, totalEvents, logCount] = await Promise.all([
    prisma.event.findMany({
      where: { userId: user.id },
      orderBy: [{ month: "asc" }, { day: "asc" }],
    }),
    prisma.event.count({ where: { userId: user.id } }),
    prisma.reminderLog.count({ where: { userId: user.id } }),
  ]);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm border">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-slate-600">{user.email}</p>
          </div>
          <Link href="/logs" className="rounded-md border px-4 py-2">
            View Reminder Logs
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Total Events</div>
            <div className="text-2xl font-semibold">{totalEvents}</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Reminder Logs</div>
            <div className="text-2xl font-semibold">{logCount}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <EventForm />
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Your Events</h2>
            <p className="text-sm text-slate-500">Sorted by month and day</p>
          </div>
          <EventList events={events} />
        </div>
      </div>
    </main>
  );
}