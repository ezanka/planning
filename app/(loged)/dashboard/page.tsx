import { getUser } from "@/src/lib/auth-server";
import SignOut from "@/src/components/ui/global/signOut";

export default async function DashboardPage() {

    const user = await getUser();

    return (
        <div>
            <h1>Dashboard</h1>
            <p>{user?.email}</p>
            <p>{user?.name}</p>
            <p>{user?.createdAt.toLocaleDateString()}</p>
            <SignOut />
        </div>
    )
}
