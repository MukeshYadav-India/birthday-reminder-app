import { NextResponse } from "next/server";
import { processReminders } from "@/lib/reminders";

export async function POST() {
  try {
    await processReminders();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to process reminders" }, { status: 500 });
  }
}