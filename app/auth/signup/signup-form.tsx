"use client"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/shadcn/form"
import { Button } from "@/src/components/ui/shadcn/button"
import { Input } from "@/src/components/ui/shadcn/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { authClient } from "@/src/lib/auth-client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

const formSchema = z.object({
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères")
})

export function SignUpForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            lastName: "",
            firstName: "",
            email: "",
            password: "",
        },
    })

    const router = useRouter()
    
    async function onSubmit(values: z.infer<typeof formSchema>) {
        await authClient.signUp.email({
            name: `${values.lastName} ${values.firstName}`,
            email: values.email,
            password: values.password,
        }, {
            onSuccess: () => {
                router.push("/auth/signin");
            },
            onError: (error) => {
                toast.error(error.error.message || "An error occurred during sign up");
            },
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                                <Input placeholder="Votre nom" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                                <Input placeholder="Votre prénom" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Votre mot de passe" {...field} />
                            </FormControl>
                            <FormDescription className="text-sm text-gray-500 text-center">
                                Mot de passe renforcé <span><br />(Au moins 6 caractères, avec des chiffres et des lettres).</span>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="w-full" type="submit">S'inscrire</Button>
                <footer className="flex items-center justify-center gap-2 mt-4">
                    <span>Déjà inscrit ?</span><Link className="underline" href="/auth/signin">Se connecter</Link>
                </footer>
            </form>
        </Form>
    )
}