"use client";

import { useState } from "react";
import EditEventDialog from "./EditEventDialog";

export default function EventList({ events }: { events: any[] }) {
  const [editing, setEditing] = useState<any | null>(null);

  async function remove(id: string) {
    if (!confirm("Delete this event?")) return;
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (res.ok) window.location.reload();
    else alert("Failed to delete");
  }

  return (
    <div className="space-y-3">
      {events.length === 0 ? (
        <p className="text-gray-500">No events yet.</p>
      ) : (
        events.map((e) => (
          <div key={e.id} className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold">{e.name}</div>
                <div className="text-sm text-gray-600">
                  {e.type} — {e.month}/{e.day}{e.year ? `/${e.year}` : ""}
                </div>
                {e.notes ? <div className="mt-2 text-sm text-gray-700">{e.notes}</div> : null}
              </div>

              <div className="flex gap-2">
                <button onClick={() => setEditing(e)} className="rounded-md border px-3 py-1.5 text-sm">
                  Edit
                </button>
                <button onClick={() => remove(e.id)} className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {editing && <EditEventDialog event={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}