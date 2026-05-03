import { ReminderStatus, ReminderType } from "@prisma/client";
import { prisma } from "./db";
import { sendReminderEmail } from "./email";

function nextOccurrence(month: number, day: number) {
  const now = new Date();
  let date = new Date(now.getFullYear(), month - 1, day);
  if (date < now) date = new Date(now.getFullYear() + 1, month - 1, day);
  return date;
}

export async function processReminders() {
  const events = await prisma.event.findMany({ include: { user: true } });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const event of events) {
    const nextDate = nextOccurrence(event.month, event.day);
    const diffDays = Math.round((nextDate.getTime() - today.getTime()) / 86400000);

    const checks = [
      { daysBefore: 3, type: ReminderType.THREE_DAYS },
      { daysBefore: 1, type: ReminderType.ONE_DAY },
    ];

    for (const check of checks) {
      if (diffDays !== check.daysBefore) continue;

      const already = await prisma.reminderLog.findFirst({
        where: {
          eventId: event.id,
          reminderType: check.type,
          reminderDate: today,
          status: ReminderStatus.SENT,
        },
      });

      if (already) continue;

      try {
        await sendReminderEmail(
          event.user.email,
          `${event.name} ${event.type.toLowerCase()} reminder`,
          `Hello ${event.user.name},\n\nReminder: ${event.name}'s ${event.type.toLowerCase()} is on ${nextDate.toDateString()}.\nThis is your ${check.daysBefore}-day reminder.`
        );

        await prisma.reminderLog.create({
          data: {
            userId: event.userId,
            eventId: event.id,
            reminderType: check.type,
            reminderDate: today,
            sentAt: new Date(),
            status: ReminderStatus.SENT,
            channel: "EMAIL",
          },
        });
      } catch (err) {
        await prisma.reminderLog.create({
          data: {
            userId: event.userId,
            eventId: event.id,
            reminderType: check.type,
            reminderDate: today,
            status: ReminderStatus.FAILED,
            channel: "EMAIL",
            errorMessage: err instanceof Error ? err.message : "Unknown error",
          },
        });
      }
    }
  }
}