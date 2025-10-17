"use client"

import * as React from "react"
import { Separator } from "@/src/components/ui/shadcn/separator"
import { Task as PrismaTask, TaskType } from "@prisma/client"

type Task = PrismaTask;

function calculateTaskColumns(tasks: Task[]): Map<string, { column: number; totalColumns: number }> {
    const sortedTasks = [...tasks].sort((a, b) => a.startHour - b.startHour);
    const result = new Map<string, { column: number; totalColumns: number }>();
    const columns: Task[][] = [];

    for (const task of sortedTasks) {
        let placed = false;

        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            const hasOverlap = column.some(t =>
                (task.startHour < t.endHour && task.endHour > t.startHour)
            );

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

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].includes(task)) {
                columnIndex = i;
                break;
            }
        }

        for (const column of columns) {
            const hasOverlap = column.some(t =>
                (task.startHour < t.endHour && task.endHour > t.startHour)
            );
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
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const taskColumns = calculateTaskColumns(tasksData);

    React.useEffect(() => {
        async function fetchTasks() {
            const response = await fetch(`/api/dashboard/${year}/${month}/${day}/get-task`);
            const data = await response.json();
            console.log(year, month, day, data);
            setTasksData(data);
        }

        fetchTasks();
    }, [year, month, day]);

    const plannedHours = tasksData.reduce((sum, task) => sum + (task.endHour - task.startHour), 0);

    return (
        <div className="relative">
            {hours.map((hour, index) => {
                const hourFormatted = hour.toString().padStart(2, '0');
                const isBusinessHours = hour >= 9 && hour < 18;

                const tasksAtHour = tasksData.filter(task => task.startHour === hour);

                return (
                    <div key={hour}>
                        <div className="flex items-start transition-colors rounded-lg px-2 h-[76px]">
                            <div className="flex-shrink-0 w-24 pt-1">
                                <span className={`text-2xl font-bold ${isBusinessHours ? 'text-primary' : 'text-foreground'
                                    }`}>
                                    {hourFormatted}:00
                                </span>
                            </div>

                            <div className="flex-grow relative">
                                <div className="flex gap-2">
                                    {tasksAtHour.map(task => {
                                        const columnInfo = taskColumns.get(task.id);
                                        const heightInPixels = (task.endHour - task.startHour) * 76;
                                        const widthPercentage = columnInfo ? (100 / columnInfo.totalColumns) : 100;
                                        const leftPercentage = columnInfo ? (columnInfo.column * widthPercentage) : 0;
                                        const taskColor = task.type === TaskType.Work ? 'bg-blue-500' :
                                            task.type === TaskType.Personal ? 'bg-green-500' :
                                                task.type === TaskType.Sport ? 'bg-orange-500' :
                                                    task.type === TaskType.Other ? 'bg-purple-500' : 'bg-gray-500';

                                        return (
                                            <div
                                                key={task.id}
                                                className={`absolute ${taskColor} text-white rounded-lg p-3 shadow-md border border-white/20 z-10`}
                                                style={{
                                                    height: `${heightInPixels}px`,
                                                    width: `calc(${widthPercentage}% - 8px)`,
                                                    left: `${leftPercentage}%`,
                                                }}
                                            >
                                                <div className="font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                                                    {task.title}
                                                </div>
                                                <div className="text-xs opacity-90 mt-1">
                                                    {task.startHour}:00 - {task.endHour}:00
                                                </div>
                                            </div>
                                        );
                                    })}
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