"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { registerEntrada } from '@/app/protected/inventory/services/inventory.services'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { formInventoryEntrySchema } from "@/lib/schema/inventory/formInventoryEntrySchema"
import { cn } from "@/lib"
import { Check, ChevronsUpDown } from "lucide-react"
import { getProductOptions } from "@/app/protected/product/actions"
import { getHeadquarterOptions } from "@/app/protected/headquarter/actions"

export default function FormInventoryEntry({ idUser }: { idUser: string }) {
    const [optionsProductionOrders, setOptionsProductionOrders] = useState<{ label: string; value: string; }[]>([])
    const [optionsHeadquarter, setOptionsHeadquarter] = useState<{ label: string; value: string; }[]>([])


    useEffect(() => {
        (async () => {
            const products = await getProductOptions();
            setOptionsProductionOrders(products);
            const headquarters = await getHeadquarterOptions();
            console.log(headquarters);
            setOptionsHeadquarter(headquarters);
        })()
    }, [])

    console.log(optionsProductionOrders);
    console.log(optionsHeadquarter);


    const form = useForm<z.infer<typeof formInventoryEntrySchema>>({
        resolver: zodResolver(formInventoryEntrySchema),
        defaultValues: {
            commodityId: "",
            headquartersId: "",
            cantidad: 0,
            userId: idUser,
        },
    });

    const handleProductSelect = (order: { label: string; value: string }) => {
        form.setValue("commodityId", order.value);
    };

    const handleSubmit = async (values: z.infer<typeof formInventoryEntrySchema>) => {
        // Asegurarse de que `cantidad` sea number antes de guardar/enviar
        const payload = { ...values, cantidad: Number(values.cantidad) } as z.infer<typeof formInventoryEntrySchema>;

        if (isNaN(payload.cantidad) || payload.cantidad <= 0) {
            toast.error('Cantidad inválida. Debe ser un número mayor a 0.');
            return;
        }

        try {
            const data = await registerEntrada(payload);

            toast.success("Entrada registrada", {
                description: `El stock actual es ${data?.stockActual}`
            });

            console.log('Stock actual:', data?.stockActual);

            // Resetear formulario manteniendo userId
            form.reset({
                commodityId: '',
                headquartersId: '',
                cantidad: 0,
                userId: idUser,
            });
        } catch (error: unknown) {
            console.error('Error al enviar entrada:', error);
            const message = error instanceof Error ? error.message : String(error);
            toast.error(message || 'Error de red al registrar la entrada');
        }
    };

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full space-y-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="commodityId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Producto</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "justify-between w-full truncate max-w-full", // Claves de la solución
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? optionsProductionOrders.find(
                                                        (order) => order.value === field.value
                                                    )?.label
                                                    : "Selecciona una orden de producción"}
                                                <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Buscar orden de producción..."
                                                className="h-9"
                                            />
                                            <CommandList>
                                                <CommandEmpty>No hay órdenes de producción</CommandEmpty>
                                                <CommandGroup>
                                                    {optionsProductionOrders.map((order) => (
                                                        <CommandItem
                                                            value={order.label}
                                                            key={order.value}
                                                            onSelect={() => {
                                                                handleProductSelect(order);
                                                            }}
                                                        >
                                                            {order.label}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto",
                                                                    order.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="headquartersId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Sede</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "justify-between w-full truncate max-w-full", // Claves de la solución
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? optionsHeadquarter.find(
                                                        (order) => order.value === field.value
                                                    )?.label
                                                    : "Selecciona una orden de producción"}
                                                <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Buscar orden de producción..."
                                                className="h-9"
                                            />
                                            <CommandList>
                                                <CommandEmpty>No hay sedes disponibles</CommandEmpty>
                                                <CommandGroup>
                                                    {optionsHeadquarter.map((order) => (
                                                        <CommandItem
                                                            value={order.label}
                                                            key={order.value}
                                                            onSelect={() => {
                                                                form.setValue("headquartersId", order.value);
                                                            }}
                                                        >
                                                            {order.label}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto",
                                                                    order.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cantidad"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cantidad</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Cantidad"
                                        type="number"
                                        min={1}
                                        value={field.value ?? ''}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            // Mantener cadena vacía si el usuario borra el campo,
                                            // de lo contrario enviar número (coerción segura)
                                            field.onChange(v === '' ? v : Number(v));
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="userId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID de Usuario</FormLabel>
                                <FormControl>
                                    <Input placeholder="ID de Usuario" disabled {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Botón de envío */}
                    <div className="flex justify-center pt-4 col-span-2">
                        <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Enviando...' : 'Enviar'}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}
