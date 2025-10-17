
import { NewTaskForm } from "@/src/components/ui/dashboard/day/new";
import Link from "next/link";

interface PageProps {
    params: Promise<{
        year: string;
        month: string;
        day: string;
    }>;
}

export default async function NewDashboardPage({ params }: PageProps) {
    const { year, month, day } = await params;

    const date = new Date(`${year}-${month}-${day}`);
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);

    return (
        <div className="min-h-screen bg-background p-6 w-full">
            <div className="max-w-6xl mx-auto">
                <div className="bg-card rounded-lg shadow-sm p-6 mb-6 border">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Nouvelle tache
                    </h1>
                    <p className="text-lg text-muted-foreground capitalize">
                        {formattedDate}
                    </p>
                    <Link href="/dashboard">Retour</Link>
                </div>

                <div className="bg-card rounded-lg shadow-sm p-6 border w-full">
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                        Planification horaire
                    </h2>

                    <NewTaskForm year={year} month={month} day={day} />
                </div>
            </div>
        </div>
    );
}