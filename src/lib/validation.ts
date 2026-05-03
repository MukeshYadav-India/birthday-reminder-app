import { z } from "zod";

const currentYear = new Date().getFullYear();

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const eventSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  type: z.enum(["BIRTHDAY", "ANNIVERSARY"]),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  year: z.number().int().min(1900).max(currentYear).optional().nullable(),
  notes: z.string().trim().max(500).optional().nullable(),
});