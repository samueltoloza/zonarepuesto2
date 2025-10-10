'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
} from "@/components/ui/field"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form"
import { Input } from "@/components/ui/input"
import { signUpSchema } from "@/lib"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "./ui/button"
import { startTransition } from "react"
import { register } from "@/app/auth/register/actions"
import { toast } from "sonner"
import Link from "next/link"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            document: 0,
            email: "",
            name: "",
            password: "",
            confirmPassword: "",
        },
    });

    const handleSubmit = async (values: z.infer<typeof signUpSchema>) => {
        startTransition(() => {
            register(values)
                .then((data) => {
                    console.log("Login response:", data);
                    if (data?.error) {
                        console.log("Login error:", data.error);
                        toast.error("Register failed");
                    } else {
                        console.log("Register successful:", data);
                        toast.success(data.success);
                    }
                }
                )
        });
    };

    return (
        <Card {...props}>
            <CardHeader>
                <CardTitle>Crear una cuenta</CardTitle>
                <CardDescription>
                    Ingresa tus datos para crear una cuenta.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <FieldGroup>
                            <FormField
                                control={form.control}
                                name="document"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Document</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Documento" type="number" {...field} onChange={(event) => field.onChange(Number(event.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name">Nombre Completo</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="Nombre"
                                                type="text"
                                                // disabled={isPending}
                                                placeholder="Nombre Completo"
                                                {...field}
                                            />
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
                                        <FormLabel htmlFor="email">Correo</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="email"
                                                type="email"
                                                // disabled={isPending}
                                                placeholder="example@example.com"
                                                {...field}
                                            />
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
                                        <FormLabel htmlFor="password">Contraseña</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="Password"
                                                type="password"
                                                // disabled={isPending}
                                                placeholder="*********"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="password">Confirmar Contraseña</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="ConfirmPassword"
                                                type="password"
                                                // disabled={isPending}
                                                placeholder="*********"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FieldGroup>
                                <Field>
                                    <Button type="submit">Crear cuenta</Button>
                                </Field>
                                <Field>
                                    <Button variant="outline" type="button">
                                        Sign up with Google
                                    </Button>
                                    <FieldDescription className="px-6 text-center">
                                        Ya tengo una cuenta <Link href="/auth/login">Sign in</Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </FieldGroup>
                    </form>
                </Form>
            </CardContent>
        </Card >
    )
}
