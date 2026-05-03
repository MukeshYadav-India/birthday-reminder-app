import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { comparePassword, setAuthCookie, signToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signToken({ userId: user.id, email: user.email, name: user.name });

  // Keep web cookie auth
  await setAuthCookie(token);

  // Return token for mobile
  return NextResponse.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
}