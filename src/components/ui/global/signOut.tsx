"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import { toast } from "sonner";
import { BadgeCheck, BadgeX } from "lucide-react";
import { Button } from "@/src/components/ui/shadcn/button";

export default function SignOut() {
    const router = useRouter();

    const handleSignOut = async () => {
        const res = await authClient.signOut();
        if (res.data?.success) {
            router.push("/auth/signin");
            toast.custom(() => (
                <div className="bg-[#111010] text-[#FAFAFA] p-4 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-2">
                        <BadgeCheck />
                        <div>
                            <div className="font-semibold">Déconnexion réussie</div>
                            <div className="text-sm opacity-90">Vous avez été déconnecté avec succès.</div>
                        </div>
                    </div>
                </div>
            ))
        } else {
            toast.custom(() => (
                <div className="bg-[#111010] text-[#FAFAFA] p-4 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-2">
                        <BadgeX />
                        <div>
                            <div className="font-semibold">Erreur lors de la déconnexion</div>
                            <div className="text-sm opacity-90">Vous n&apos;avez pas été déconnecté.</div>
                        </div>
                    </div>
                </div>
            ))
        }
    };

    return (
        <Button onClick={handleSignOut} className="hover:cursor-pointer">
            Se déconnecter
        </Button>
    );
}
