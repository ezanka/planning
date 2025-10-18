"use client"

import * as React from "react"
import { Calendar as ShadcnCalendar } from "@/src/components/ui/shadcn/calendar"
import { useRouter } from "next/navigation";

export function Calendar() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [mounted, setMounted] = React.useState(false)
    const [windowWidth, setWindowWidth] = React.useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024)
    const router = useRouter();

    React.useEffect(() => {
        setMounted(true)
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    if (!mounted) {
        return <div className="rounded-lg border shadow-sm h-[350px]" />
    }

    const selectDate = (date: Date) => {
        router.push(`/dashboard/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/view`);
    }

    const numberOfMonths = windowWidth < 768 ? 1 : 2

    return (
        <ShadcnCalendar
            mode="single"
            defaultMonth={date}
            selected={date}
            numberOfMonths={numberOfMonths}
            onSelect={setDate}
            onDayClick={selectDate}
            className="rounded-lg border shadow-sm w-full"
        />
    )
}