import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";

export default async function LogsPage() {
  const user = await getCurrentUser();
  if (!user) return <div className="p-6">Please log in.</div>;

  const logs = await prisma.reminderLog.findMany({
    where: { userId: user.id },
    include: { event: true },
    orderBy: { reminderDate: "desc" },
    take: 100,
  });

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <div>
        <h1 className="text-3xl font-bold">Reminder Logs</h1>
        <p className="text-slate-600">Recent reminder delivery history</p>
      </div>

      <div className="space-y-3">
        {logs.length === 0 ? (
          <p className="text-slate-500">No reminder logs yet.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold">{log.event.name}</div>
                  <div className="text-sm text-slate-600">
                    {log.event.type} • {log.reminderType} • {log.channel}
                  </div>
                </div>
                <div className="text-sm font-medium">
                  <span className={log.status === "SENT" ? "text-green-600" : log.status === "FAILED" ? "text-red-600" : "text-slate-600"}>
                    {log.status}
                  </span>
                </div>
              </div>

              <div className="mt-2 text-sm text-slate-500">
                Reminder date: {new Date(log.reminderDate).toLocaleDateString()}
                {log.sentAt ? ` • Sent: ${new Date(log.sentAt).toLocaleString()}` : ""}
              </div>

              {log.errorMessage ? (
                <div className="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {log.errorMessage}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </main>
  );
}