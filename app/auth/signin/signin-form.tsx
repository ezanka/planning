"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/shadcn/form"
import { Button } from "@/src/components/ui/shadcn/button"
import { Input } from "@/src/components/ui/shadcn/input"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { authClient } from "@/src/lib/auth-client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Separator } from "@/src/components/ui/shadcn/separator"
import Link from "next/link"

const formSchema = z.object({
    email: z.string(),
    password: z.string()
})

export function SignInForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const router = useRouter()
    

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await authClient.signIn.email({
            email: values.email,
            password: values.password,
        }, {
            onSuccess: () => {
                router.push("/dashboard");
                router.refresh();
            },
            onError: (error) => {
                toast.error(error.error.message || "An error occurred during sign in");
            },
        })
    }

    const handleLoginWithGoogle = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/dashboard",
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Votre email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center justify-between"><span>Mot de passe</span><Link className="underline" href="auth/forgot">Mot de passe oublié</Link></FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Votre mot de passe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="w-full" type="submit">Se connecter</Button>
                <div>
                    <Separator />
                    <p className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4">ou</p>
                </div>
                <button
                    type="button"
                    onClick={handleLoginWithGoogle}
                    className="flex items-center gap-3 w-full py-3 px-4 rounded-lg bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-all"
                >
                    <Image src="/google.png" alt="Google" width={24} height={24} className="w-6 h-6 absolute" />
                    <span className="flex-1 text-gray-800 text-base font-medium text-center">Se connecter avec Google</span>
                </button>
                <footer className="flex items-center justify-center gap-2 mt-4">
                    <span>Pas encore inscrit ?</span><Link className="underline" href="/auth/signup">S&apos;inscrire</Link>
                </footer>
            </form>
        </Form>
    )
}