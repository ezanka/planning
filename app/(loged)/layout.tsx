import { getUser } from "@/src/lib/auth-server";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/src/components/ui/global/themeToggle";

export default async function LogedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const user = await getUser();

    if (!user) {
        redirect('/');
    }

    return (
        <main>
            {children}
            <ThemeToggle />
        </main>
    )
}