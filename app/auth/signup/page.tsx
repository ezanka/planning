
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/shadcn/card";
import { SignUpForm } from "./signup-form";

export default function SignUpPage() {
    return (
        <div className="w-full h-screen flex items-center justify-center p-4">
            <Card className="w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Inscription</CardTitle>
                </CardHeader>
                <CardContent>
                    <SignUpForm />
                </CardContent>
            </Card>
        </div>
    )
}