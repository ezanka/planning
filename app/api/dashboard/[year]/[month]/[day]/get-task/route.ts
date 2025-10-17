import { getUser } from "@/src/lib/auth-server";
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

type Params = {
    year: string;
    month: string;
    day: string;
};

export async function GET(req: Request, { params }: { params: Promise<Params> }) {
    const { year, month, day } = await params;
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
        where: {
            date: new Date(`${year}-${month}-${day}`),
            userId: user.id
        }
    });

    return NextResponse.json(tasks);
}
