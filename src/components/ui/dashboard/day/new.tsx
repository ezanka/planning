"use client"

import { Input } from "@/src/components/ui/shadcn/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/shadcn/select"
import { TaskType } from "@/src/types/planning"
import { Button } from "../../shadcn/button"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/src/components/ui/shadcn/form"
import { BadgeCheck, BadgeX } from "lucide-react"
import { toast } from "sonner"
import { Spinner } from "../../shadcn/spinner"
import * as React from "react"

const hour = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
const minute = ["00", "15", "30", "45"];

const formSchema = z.object({
    name: z.string().min(2).max(50),
    type: z.nativeEnum(TaskType),
    startHour: z.string().refine((val) => hour.includes(val), {
        message: "Heure de début invalide",
    }),
    startMinute: z.string().refine((val) => minute.includes(val), {
        message: "Minute de début invalide",
    }),
    endHour: z.string().refine((val) => hour.includes(val), {
        message: "Heure de fin invalide",
    }),
    endMinute: z.string().refine((val) => minute.includes(val), {
        message: "Minute de fin invalide",
    }),
}).refine(
    (data) => {
        const startTime = parseInt(data.startHour) * 60 + parseInt(data.startMinute);
        const endTime = parseInt(data.endHour) * 60 + parseInt(data.endMinute);
        return startTime < endTime;
    },
    {
        message: "L'heure de fin doit être après l'heure de début",
        path: ["endHour"],
    }
);

export function NewTaskForm({ year, month, day }: { year: string; month: string; day: string }) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: TaskType.Other,
            startHour: "09",
            startMinute: "00",
            endHour: "10",
            endMinute: "00",
        },
    })
    const [loading, setLoading] = React.useState(false);

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            fetch(`/api/dashboard/${year}/${month}/${day}/new-task`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: values.name,
                    type: values.type,
                    startHour: parseInt(values.startHour),
                    startMinute: parseInt(values.startMinute),
                    endHour: parseInt(values.endHour),
                    endMinute: parseInt(values.endMinute),
                }),
            }).then(async (res) => {
                if (res.ok) {
                    toast.custom(() => (
                        <div className="bg-background text-foreground p-4 rounded-2xl shadow-lg">
                            <div className="flex items-center gap-2">
                                <BadgeCheck />
                                <div>
                                    <div className="font-semibold">Tâche ajoutée au planning</div>
                                </div>
                            </div>
                        </div>
                    ))
                    form.reset();
                } else {
                    const data = await res.json();
                    toast.custom(() => (
                        <div className="bg-background text-foreground p-4 rounded-2xl shadow-lg">
                            <div className="flex items-center gap-2">
                                <BadgeX />
                                <div>
                                    <div className="font-semibold">Erreur lors de l&apos;ajout de la tâche</div>
                                    <div className="text-sm opacity-90">{data.error}</div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            });
        } catch (error) {
            const errorData = error as { message: string };
            toast.custom(() => (
                <div className="bg-background text-foreground p-4 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-2">
                        <BadgeX />
                        <div>
                            <div className="font-semibold">Erreur lors de l&apos;ajout de la tâche</div>
                            <div className="text-sm opacity-90">{errorData.message}</div>
                        </div>
                    </div>
                </div>
            ));
        } finally {
            setLoading(false);
        }
    }

    return (
            <div className="w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom de la tâche</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ma nouvelle tâche" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Choisissez un nom unique pour votre tâche.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type de la tâche</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Choisissez un type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(TaskType).map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        Sélectionnez votre type de tâche.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startHour"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Heure de début</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Choisissez une heure" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {hour.map((h) => (
                                                        <SelectItem key={h} value={h}>
                                                            {h}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>
                                            Sélectionnez votre heure de début.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="startMinute"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Minute de début</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Choisissez une minute" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {minute.map((m) => (
                                                        <SelectItem key={m} value={m}>
                                                            {m}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>
                                            Sélectionnez votre minute de début.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="endHour"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Heure de fin</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Choisissez une heure" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {hour.map((h) => (
                                                        <SelectItem key={h} value={h}>
                                                            {h}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>
                                            Sélectionnez votre heure de fin.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endMinute"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Minute de fin</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Choisissez une minute" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {minute.map((m) => (
                                                        <SelectItem key={m} value={m}>
                                                            {m}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>
                                            Sélectionnez votre minute de fin.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? (<><Spinner /> ajout en cours...</>) : "Ajouter au planning"}
                        </Button>
                    </form>
                </Form>
            </div>
        )
    }