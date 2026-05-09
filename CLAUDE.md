# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Start dev server
npm run build         # Production build
npm run start         # Start production server

npx prisma migrate dev --name <name>   # Create and apply a migration
npx prisma migrate deploy              # Apply migrations (production)
npx prisma studio                      # Open Prisma GUI
npx prisma generate                    # Regenerate client after schema changes (also runs on postinstall)
```

No test runner is configured.

## Architecture

### Auth — dual-mode (cookie + Bearer token)

The app serves both a Next.js web client and a companion React Native app (`birthday-reminder-mobile/`) from the same API. Two auth transports are supported in parallel:

- **Cookie**: `auth_token` httpOnly cookie, set/cleared in `src/lib/auth.ts`. Read server-side via `src/lib/getCurrentUser.ts`.
- **Bearer token**: `Authorization: Bearer <jwt>` header, resolved in `src/lib/auth-mobile.ts`. Login and register routes return the JWT in the response body for the mobile client.

All protected API routes use this pattern (currently duplicated across three files — a candidate for extraction):

```ts
async function resolveUser(req: Request) {
  const bearerUser = await getCurrentUserFromAuthorization(req);
  if (bearerUser) return bearerUser;
  return await getCurrentUser();
}
```

There is no `middleware.ts`. Route protection is manual — every page and API route calls `getCurrentUser()` directly. Pages render a fallback string rather than redirecting when unauthenticated.

### Database

Prisma with Neon serverless Postgres in production. Singleton in `src/lib/db.ts` (stored on `globalThis` to survive hot-reloads in dev).

Event dates are stored as separate integer fields (`month`, `day`, `year?`) — not a `Date` column. The reminder logic in `src/lib/reminders.ts` computes the next occurrence year-agnostically (wraps to next year if the date has passed).

Server Component pages (`dashboard/page.tsx`, `logs/page.tsx`) query Prisma directly — no API round-trip for page data.

### Cron / Reminders

`src/lib/reminders.ts` → `processReminders()` runs on every cron trigger. It checks all events, fires emails at exactly 3 days and 1 day before the next occurrence, and logs results to `ReminderLog`. The `@@unique([eventId, reminderType, reminderDate])` constraint prevents duplicate sends.

The cron endpoint (`src/app/api/reminders/process/route.ts`) accepts both `GET` (Vercel Cron) and `POST` (manual), authenticated via `Authorization: Bearer <CRON_SECRET>` — not JWT. Scheduled daily at 8:00 AM UTC via `vercel.json`.

### Validation

Zod schemas in `src/lib/validation.ts` (`registerSchema`, `loginSchema`, `eventSchema`). All API routes call `safeParse` and return flattened issues on failure.

### Key conventions

- Path alias `@/` maps to `src/`
- All model IDs use `cuid()`; all relations use `onDelete: Cascade`
- `EMAIL_USER` / `EMAIL_PASS` are Gmail credentials; `src/lib/email.ts` sends plain-text only (no HTML templates)
- `NODE_ENV` controls the `secure` flag on the auth cookie and the Prisma singleton behaviour
