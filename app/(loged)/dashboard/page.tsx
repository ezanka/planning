
import { Calendar } from "@/src/components/ui/dashboard/calendar";
import { RecentTasksTable } from "@/src/components/ui/dashboard/recent";

export default function DashboardPage() {

    return (
        <div className="w-full max-w-xl">
            <Calendar />
            <RecentTasksTable />
        </div>
    )
}
