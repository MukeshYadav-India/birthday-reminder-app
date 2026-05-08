import { NextRequest, NextResponse } from "next/server";
import { processReminders } from "@/lib/reminders";

async function handle(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await processReminders();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to process reminders" }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;