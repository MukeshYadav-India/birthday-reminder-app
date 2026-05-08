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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await resolveUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.event.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = eventSchema.safeParse(await req.json());
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

  const event = await prisma.event.update({
    where: { id },
    data: { name, type, month, day, year: year ?? null, notes: notes ?? null },
  });

  return NextResponse.json({ event });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await resolveUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.event.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ success: true });
}