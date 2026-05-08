"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Registration failed");
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Register</h1>
        <input
          className="w-full rounded-md border px-3 py-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full rounded-md border px-3 py-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          className="w-full rounded-md border px-3 py-2"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full rounded-md bg-blue-600 px-4 py-2 text-white">Create Account</button>
      </form>
    </main>
  );
}