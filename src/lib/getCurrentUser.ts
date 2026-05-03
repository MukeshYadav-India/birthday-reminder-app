import { prisma } from "./db";
import { getTokenFromCookie, verifyToken } from "./auth";

export async function getCurrentUser() {
  const token = await getTokenFromCookie();
  if (!token) return null;

  try {
    const payload = verifyToken(token);
    return await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true },
    });
  } catch {
    return null;
  }
}