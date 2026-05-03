import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const secret = process.env.JWT_SECRET as string;

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const comparePassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export const signToken = (payload: object) =>
  jwt.sign(payload, secret, { expiresIn: "7d" });

export const verifyToken = (token: string) =>
  jwt.verify(token, secret) as { userId: string; email: string; name: string };

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getTokenFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value;
}