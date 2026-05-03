import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, setAuthCookie, signToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  const token = signToken({ userId: user.id, email: user.email, name: user.name });

  // Keep web cookie auth
  await setAuthCookie(token);

  // Return token for mobile
  return NextResponse.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
}