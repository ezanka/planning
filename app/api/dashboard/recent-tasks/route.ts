import { getUser } from "@/src/lib/auth-server";
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const tasks = await prisma.task.findMany({
        where: {
            date: now,
            userId: user.id,
            OR: [
                {
                    endHour: {
                        gt: currentHour,
                    },
                },
                {
                    endHour: currentHour,
                    endMinute: {
                        gte: currentMinute,
                    },
                },
            ],
        },
        orderBy: {
            endHour: "asc",
        },
    });

    return NextResponse.json(tasks);
}