import { getUser } from "@/src/lib/auth-server";
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

type Params = {
    year: string;
    month: string;
    day: string;
};

export async function POST(request: Request, { params }: { params: Promise<Params> }) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { year, month, day } = await params;
    const body = await request.json();
    const { title, startHour, startMinute, endHour, endMinute } = body;

    if (!title || startHour === undefined || startMinute === undefined || endHour === undefined || endMinute === undefined) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const taskDate = new Date(`${year}-${month}-${day}`);

    const newTask = await prisma.task.create({
        data: {
            userId: user.id,
            title,
            date: taskDate,
            startHour,
            startMinute,
            endHour,
            endMinute,
        },
    });

    return NextResponse.json(newTask, { status: 201 });
}