import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-center justify-center px-6">
      <div className="max-w-2xl text-center space-y-6">
        <div className="inline-flex rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
          Family Reminder App
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Never miss a birthday or wedding anniversary again
        </h1>
        <p className="text-lg text-slate-600">
          Add family and friends’ special dates, get reminded 3 days and 1 day before, and keep everything in one secure place.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/register" className="rounded-md bg-blue-600 px-5 py-3 font-medium text-white">
            Get Started
          </Link>
          <Link href="/login" className="rounded-md border border-slate-300 bg-white px-5 py-3 font-medium">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}