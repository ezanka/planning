import { getUser } from "@/src/lib/auth-server";
import { redirect } from "next/navigation";

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
        <main className="w-full flex justify-center">
            {children}
        </main>
    )
}