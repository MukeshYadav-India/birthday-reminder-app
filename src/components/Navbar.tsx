"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold text-lg">Reminder App</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <Link href="/logs" className="hover:text-blue-600">Logs</Link>
          <Link href="/login" className="hover:text-blue-600">Login</Link>
          <Link href="/register" className="hover:text-blue-600">Register</Link>
          <button onClick={logout} className="rounded-md bg-gray-900 px-3 py-1.5 text-white">
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}