"use client"

import * as React from "react"
import { Calendar } from "@/src/components/ui/shadcn/calendar"
import { useRouter } from "next/navigation";

export function Calendar13() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [mounted, setMounted] = React.useState(false)
    const router = useRouter();

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="rounded-lg border shadow-sm h-[350px]" />
    }

    const selectDate = (date: Date) => {
        router.push(`/dashboard/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/view`);
    }

    return (
        <Calendar
            mode="single"
            defaultMonth={date}
            selected={date}
            onSelect={setDate}
            onDayClick={selectDate}
            className="rounded-lg border shadow-sm"
        />
    )
}