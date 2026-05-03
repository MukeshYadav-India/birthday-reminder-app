import { prisma } from "./db";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET as string;

export function verifyBearerToken(token: string) {
  return jwt.verify(token, secret) as { userId: string; email: string; name: string };
}

export async function getCurrentUserFromAuthorization(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);

  try {
    const payload = verifyBearerToken(token);
    return await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true },
    });
  } catch {
    return null;
  }
}