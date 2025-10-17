"use client"

import * as React from "react"
import { Separator } from "@/src/components/ui/shadcn/separator"
import { Task as PrismaTask, TaskType } from "@prisma/client"
import { toast } from "sonner";
import { BadgeCheck, BadgeX } from "lucide-react";
import { Skeleton } from "../../shadcn/skeleton";

type Task = PrismaTask & {
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
};

function timeToDecimal(hour: number, minute: number): number {
    return hour + minute / 60;
}

function calculateTaskColumns(tasks: Task[]): Map<string, { column: number; totalColumns: number }> {
    const sortedTasks = [...tasks].sort((a, b) => {
        const aStart = timeToDecimal(a.startHour, a.startMinute);
        const bStart = timeToDecimal(b.startHour, b.startMinute);
        return aStart - bStart;
    });

    const result = new Map<string, { column: number; totalColumns: number }>();
    const columns: Task[][] = [];

    for (const task of sortedTasks) {
        let placed = false;
        const taskStart = timeToDecimal(task.startHour, task.startMinute);
        const taskEnd = timeToDecimal(task.endHour, task.endMinute);

        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            const hasOverlap = column.some(t => {
                const tStart = timeToDecimal(t.startHour, t.startMinute);
                const tEnd = timeToDecimal(t.endHour, t.endMinute);
                return (taskStart < tEnd && taskEnd > tStart);
            });

            if (!hasOverlap) {
                column.push(task);
                placed = true;
                break;
            }
        }

        if (!placed) {
            columns.push([task]);
        }
    }

    for (const task of sortedTasks) {
        let maxColumns = 1;
        let columnIndex = 0;
        const taskStart = timeToDecimal(task.startHour, task.startMinute);
        const taskEnd = timeToDecimal(task.endHour, task.endMinute);

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].includes(task)) {
                columnIndex = i;
                break;
            }
        }

        for (const column of columns) {
            const hasOverlap = column.some(t => {
                const tStart = timeToDecimal(t.startHour, t.startMinute);
                const tEnd = timeToDecimal(t.endHour, t.endMinute);
                return (taskStart < tEnd && taskEnd > tStart);
            });
            if (hasOverlap) {
                maxColumns = Math.max(maxColumns, columns.indexOf(column) + 1);
            }
        }

        result.set(task.id, { column: columnIndex, totalColumns: maxColumns });
    }

    return result;
}

export default function DayTask({ year, month, day }: { year: string; month: string; day: string }) {
    const [tasksData, setTasksData] = React.useState<Task[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const taskColumns = calculateTaskColumns(tasksData);

    React.useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`/api/dashboard/${year}/${month}/${day}/get-task`);
                const data = await response.json();
                setTasksData(data);
            } catch (error) {
                const errorData = error as { error: string };
                toast.custom(() => (
                    <div className="bg-background text-foreground p-4 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-2">
                            <BadgeX />
                            <div>
                                <div className="font-semibold">Erreur lors de la récupération du planning</div>
                                <div className="text-sm opacity-90">{errorData.error}</div>
                            </div>
                        </div>
                    </div>
                ))
            } finally {
                toast.custom(() => (
                    <div className="bg-background text-foreground p-4 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-2">
                            <BadgeCheck />
                            <div>
                                <div className="font-semibold">Planning chargé</div>
                            </div>
                        </div>
                    </div>
                ))
                setLoading(false);
            }
        };

        fetchTasks();
    }, [year, month, day]);

    const getTasksInHourRange = (hour: number) => {
        return tasksData.filter(task => {
            const taskStart = timeToDecimal(task.startHour, task.startMinute);
            return taskStart >= hour && taskStart < hour + 1;
        });
    };

    return (
        <div className="relative">
            {hours.map((hour, index) => {
                const hourFormatted = hour.toString().padStart(2, '0');
                const isBusinessHours = hour >= 9 && hour < 18;

                const tasksAtHour = getTasksInHourRange(hour);

                return (
                    <div key={hour}>
                        <div className="flex items-start transition-colors rounded-lg px-2 h-[76px]">
                            <div className="flex-shrink-0 mr-2 pt-1">
                                <span className={`text-lg sm:text-2xl font-bold ${isBusinessHours ? 'text-primary' : 'text-foreground'
                                    }`}>
                                    {hourFormatted}:00
                                </span>
                            </div>

                            <div className="flex-grow relative">
                                <div className="flex gap-2">
                                    {loading ? (
                                        <Skeleton className={`absolute h-[76px] rounded-lg w-full`} />
                                    ) : (
                                        tasksAtHour.map(task => {
                                            const columnInfo = taskColumns.get(task.id);
                                            const taskStart = timeToDecimal(task.startHour, task.startMinute);
                                            const taskEnd = timeToDecimal(task.endHour, task.endMinute);
                                            const taskDuration = taskEnd - taskStart;

                                            const heightInPixels = taskDuration * 77;
                                            const topOffset = (taskStart - hour) * 77;

                                            const widthPercentage = columnInfo ? (100 / columnInfo.totalColumns) : 100;
                                            const leftPercentage = columnInfo ? (columnInfo.column * widthPercentage) : 0;

                                            const taskColor = task.type === TaskType.Work ? 'bg-blue-500' :
                                                task.type === TaskType.Personal ? 'bg-green-500' :
                                                    task.type === TaskType.Sport ? 'bg-orange-500' :
                                                        task.type === TaskType.Other ? 'bg-purple-500' : 'bg-gray-500';

                                            const formatTime = (h: number, m: number) => {
                                                return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                                            };

                                            return (
                                                <div
                                                    key={task.id}
                                                    className={`absolute ${taskColor} text-white rounded-lg p-3 shadow-md border border-white/20 z-10`}
                                                    style={{
                                                        height: `${heightInPixels}px`,
                                                        width: `calc(${widthPercentage}% - 8px)`,
                                                        left: `${leftPercentage}%`,
                                                        top: `${topOffset}px`,
                                                    }}
                                                >
                                                    <div className="font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                                                        {task.title}
                                                    </div>
                                                    <div className="text-xs opacity-90 mt-1">
                                                        {formatTime(task.startHour, task.startMinute)} - {formatTime(task.endHour, task.endMinute)}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                        {index < hours.length - 1 && <Separator />}
                    </div>
                );
            })}
        </div>
    )
}