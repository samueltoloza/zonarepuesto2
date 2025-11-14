"use client"

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formProductSchema } from '@/lib/schema/product/formProductSchema'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'
import { createProduct } from '@/app/protected/product/services/product.services'
import { getHeadquarterOptions } from '@/app/protected/headquarter/actions/headquarter'
import { getSupplierOptions } from '@/app/protected/supplier/actions/supplier'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from '@/components/ui/command'
import { Button as Btn } from '@/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib'

export default function ProductForm() {
  const [optionsHeadquarter, setOptionsHeadquarter] = useState<{ label: string; value: string }[]>([])
  const [optionsSupplier, setOptionsSupplier] = useState<{ label: string; value: string }[]>([])

  useEffect(() => {
    (async () => {
      const h = await getHeadquarterOptions();
      setOptionsHeadquarter(h);
      const s = await getSupplierOptions();
      setOptionsSupplier(s);
    })()
  }, [])

  const form = useForm<z.infer<typeof formProductSchema>>({
    resolver: zodResolver(formProductSchema),
    defaultValues: { name: '', description: '', price: 0, supplierId: undefined, headquartersId: undefined }
  })

  const onSubmit = async (values: z.infer<typeof formProductSchema>) => {
    try {
      // Asegurar price number
      const payload = { ...values, price: Number(values.price) }
      const data = await createProduct(payload)
      toast.success('Producto creado correctamente')
      form.reset()
      console.log('Nuevo producto:', data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      toast.error(message || 'Error al crear producto')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white rounded shadow">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del producto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Descripción" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supplierId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proveedor (opcional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Btn variant="outline" role="combobox" className={cn("justify-between w-full truncate max-w-full", !field.value && "text-muted-foreground")}>
                      {field.value ? optionsSupplier.find(o => o.value === field.value)?.label : 'Seleccionar proveedor'}
                      <ChevronsUpDown className="opacity-50" />
                    </Btn>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Buscar proveedor..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No hay proveedores</CommandEmpty>
                      <CommandGroup>
                        {optionsSupplier.map(s => (
                          <CommandItem key={s.value} value={s.label} onSelect={() => form.setValue('supplierId', s.value)}>
                            {s.label}
                            <Check className={cn('ml-auto', s.value === field.value ? 'opacity-100' : 'opacity-0')} />
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
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min={0} placeholder="Precio" value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="headquartersId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sede (opcional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Btn variant="outline" role="combobox" className={cn("justify-between w-full truncate max-w-full", !field.value && "text-muted-foreground")}>
                      {field.value ? optionsHeadquarter.find(o => o.value === field.value)?.label : 'Seleccionar sede'}
                      <ChevronsUpDown className="opacity-50" />
                    </Btn>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Buscar sede..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No hay sedes</CommandEmpty>
                      <CommandGroup>
                        {optionsHeadquarter.map(h => (
                          <CommandItem key={h.value} value={h.label} onSelect={() => form.setValue('headquartersId', h.value)}>
                            {h.label}
                            <Check className={cn('ml-auto', h.value === field.value ? 'opacity-100' : 'opacity-0')} />
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

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Creando...' : 'Crear Producto'}</Button>
        </div>
      </form>
    </Form>
  )
}
