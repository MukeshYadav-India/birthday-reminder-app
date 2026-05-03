# Birthday Reminder App

A Next.js + Prisma app for tracking birthdays and wedding anniversaries and sending reminders 3 days and 1 day before.

## Features
- Register / login
- Add, edit, delete events
- Reminder email processing
- Reminder logs page
- Clean dashboard

## Setup
1. Copy `.env.example` to `.env`
2. Fill PostgreSQL and email credentials
3. Install dependencies:
   npm install
4. Run Prisma migration:
   npx prisma migrate dev --name init
5. Start app:
   npm run dev
