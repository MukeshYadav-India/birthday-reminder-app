import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { eventSchema } from "@/lib/validation";
import { isValidDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getCurrentUserFromAuthorization } from "@/lib/auth-mobile";

async function resolveUser(req: Request) {
  const bearerUser = await getCurrentUserFromAuthorization(req);
  if (bearerUser) return bearerUser;
  return await getCurrentUser();
}

export async function GET(req: Request) {
  const user = await resolveUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const events = await prisma.event.findMany({
    where: { userId: user.id },
    orderBy: [{ month: "asc" }, { day: "asc" }],
  });

  return NextResponse.json({ events });
}

export async function POST(req: Request) {
  const user = await resolveUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const raw = await req.json();

    const payload = {
      ...raw,
      month: Number(raw.month),
      day: Number(raw.day),
      year: raw.year != null && raw.year !== "" ? Number(raw.year) : null,
      notes: raw.notes === "" ? null : raw.notes,
    };

    const parsed = eventSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, type, month, day, year, notes } = parsed.data;

    if (!isValidDate(month, day)) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        userId: user.id,
        name,
        type,
        month: month ?? null,
        day: day ?? null,
        year: year ?? null,
        notes: notes ?? null,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (err) {
    console.error("Create event error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}