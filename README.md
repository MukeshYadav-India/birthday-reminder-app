# Birthday Reminder App

A Next.js + Prisma app for tracking birthdays and wedding anniversaries, with automated email reminders 3 days and 1 day before each event.

## Features

- Register / login with JWT auth
- Add, edit, delete events (birthday or anniversary)
- Automated email reminders via Gmail (1-day and 3-day)
- Daily cron job on Vercel — runs at 8:00 AM UTC
- Reminder logs page showing sent/failed history
- Clean dashboard

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Neon serverless Postgres + Prisma ORM
- **Email**: Nodemailer (Gmail)
- **Deployment**: Vercel

## Local Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```env
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-gmail-app-password
   ```

3. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon in production) |
| `JWT_SECRET` | Secret for signing JWT auth tokens |
| `EMAIL_USER` | Gmail address used to send reminders |
| `EMAIL_PASS` | Gmail app password |
| `CRON_SECRET` | Bearer token to authenticate the cron endpoint |

## Cron Job

The reminder processor runs daily at **8:00 AM UTC** via Vercel Cron.

- **Endpoint**: `GET /api/reminders/process`
- **Auth**: `Authorization: Bearer <CRON_SECRET>`
- **Logic**: For each event, checks if today is 1 or 3 days before the next occurrence and sends an email if not already sent

To trigger manually:
```bash
curl -X GET https://<your-domain>/api/reminders/process \
  -H "Authorization: Bearer <CRON_SECRET>"
```

## Deployment (Vercel)

1. Link the project: `vercel link`
2. Add all environment variables via `vercel env add <NAME> production`
3. Deploy: `vercel --prod`

The `vercel.json` at the repo root registers the cron schedule automatically on deploy.
