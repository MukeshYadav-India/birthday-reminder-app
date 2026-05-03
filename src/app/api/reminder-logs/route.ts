    import { NextResponse } from "next/server";
    import { prisma } from "@/lib/db";
    import { getCurrentUser } from "@/lib/getCurrentUser";
    import { getCurrentUserFromAuthorization } from "@/lib/auth-mobile";

    async function resolveUser(req: Request) {
      const bearerUser = await getCurrentUserFromAuthorization(req);
      if (bearerUser) return bearerUser;
      return await getCurrentUser();
    }

    export async function GET(req: Request) {
      const user = await resolveUser(req);
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      const logs = await prisma.reminderLog.findMany({
        where: { userId: user.id },
        include: { event: true },
        orderBy: { reminderDate: "desc" },
        take: 100,
      });

      return NextResponse.json({ logs });
    }