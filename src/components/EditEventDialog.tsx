"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditEventDialog({
  event,
  onClose,
}: {
  event: any;
  onClose: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: event.name,
    type: event.type,
    month: event.month,
    day: event.day,
    year: event.year ?? "",
    notes: event.notes ?? "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/api/events/${event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        month: Number(form.month),
        day: Number(form.day),
        year: form.year ? Number(form.year) : null,
        notes: form.notes || null,
      }),
    });

    if (res.ok) {
      router.refresh();
      onClose();
    } else {
      alert("Failed to update event");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={submit} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4">
        <h2 className="text-xl font-semibold">Edit Event</h2>

        <input className="w-full rounded-md border px-3 py-2" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <select className="w-full rounded-md border px-3 py-2" value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="BIRTHDAY">Birthday</option>
          <option value="ANNIVERSARY">Wedding Anniversary</option>
        </select>

        <div className="grid grid-cols-3 gap-2">
          <input className="rounded-md border px-3 py-2" type="number" value={form.month}
            onChange={(e) => setForm({ ...form, month: Number(e.target.value) })} />
          <input className="rounded-md border px-3 py-2" type="number" value={form.day}
            onChange={(e) => setForm({ ...form, day: Number(e.target.value) })} />
          <input className="rounded-md border px-3 py-2" type="number" value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })} />
        </div>

        <textarea className="w-full rounded-md border px-3 py-2" value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })} />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border px-4 py-2">
            Cancel
          </button>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-white">Save</button>
        </div>
      </form>
    </div>
  );
}