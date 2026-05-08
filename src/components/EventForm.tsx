"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EventForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "BIRTHDAY",
    month: "1",
    day: "1",
    year: "",
    notes: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        month: Number(form.month),
        day: Number(form.day),
        year: form.year ? Number(form.year) : null,
        notes: form.notes || null,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setForm({ name: "", type: "BIRTHDAY", month: "1", day: "1", year: "", notes: "" });
      router.refresh();
    } else {
      alert("Failed to save event");
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Add New Event</h2>
      <input className="w-full rounded-md border px-3 py-2" placeholder="Name" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <select className="w-full rounded-md border px-3 py-2" value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}>
        <option value="BIRTHDAY">Birthday</option>
        <option value="ANNIVERSARY">Wedding Anniversary</option>
      </select>
      <div className="grid grid-cols-3 gap-2">
        <input className="rounded-md border px-3 py-2" type="number" placeholder="Month" value={form.month}
          onChange={(e) => setForm({ ...form, month: e.target.value })} />
        <input className="rounded-md border px-3 py-2" type="number" placeholder="Day" value={form.day}
          onChange={(e) => setForm({ ...form, day: e.target.value })} />
        <input className="rounded-md border px-3 py-2" type="number" placeholder="Year" value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })} />
      </div>
      <textarea className="w-full rounded-md border px-3 py-2" placeholder="Notes" value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      <button disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-white">
        {loading ? "Saving..." : "Save Event"}
      </button>
    </form>
  );
}