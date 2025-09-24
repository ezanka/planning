"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/shadcn/card"

import { SignInForm } from "./signin-form"

export default function SignInPage() {


    return (
        <div className="w-full h-screen flex items-center justify-center p-4">
            <Card className="w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Connexion</CardTitle>
                </CardHeader>
                <CardContent>
                    <SignInForm />
                </CardContent>
            </Card>
        </div>
    )
}
