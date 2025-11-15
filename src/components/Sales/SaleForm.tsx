"use client"

import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSaleSchema } from '@/lib/schema/sales/formSaleSchema'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { getProductOptions } from '@/app/protected/product/actions/product'
import { getHeadquarterOptions } from '@/app/protected/headquarter/actions/headquarter'
import { toast } from 'sonner'
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'

type FormValues = z.infer<typeof formSaleSchema>

export default function SaleForm({ userId }: { userId: string }) {
  const [products, setProducts] = useState<{ label: string; value: string }[]>([])
  const [headquarters, setHeadquarters] = useState<{ label: string; value: string }[]>([])

  useEffect(() => {
    (async () => {
      const p = await getProductOptions()
      setProducts(p)
      const h = await getHeadquarterOptions()
      setHeadquarters(h)
    })()
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSaleSchema),
    defaultValues: { headquartersId: '', userId, items: [{ commodityId: '', quantity: 1 }] }
  })

  const { control, handleSubmit } = form
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const onSubmit = async (values: FormValues) => {
    // payload already matches schema (cantidad es number por Zod)
    try {
      const res = await fetch('/api/sales', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || 'Error al crear venta')
        return
      }
      toast.success('Venta registrada correctamente')
      form.reset({ headquartersId: '', userId, items: [{ commodityId: '', quantity: 1 }] })
      console.log('result', data)
    } catch {
      toast.error('Error de red al crear venta')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white rounded shadow">
        <FormField
          control={form.control}
          name="headquartersId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sede</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {field.value ? headquarters.find(h => h.value === field.value)?.label : 'Seleccionar sede'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Buscar sede..." />
                      <CommandList>
                        <CommandEmpty>No hay sedes</CommandEmpty>
                        <CommandGroup>
                          {headquarters.map(h => (
                            <CommandItem key={h.value} value={h.label} onSelect={() => form.setValue('headquartersId', h.value)}>
                              {h.label}
                              <Check className={`ml-auto ${h.value === field.value ? 'opacity-100' : 'opacity-0'}`} />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-3 gap-2 items-end">
            <div className="col-span-2">
              <FormField
                control={form.control}
                name={`items.${index}.commodityId` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Producto</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full border rounded px-2 py-1">
                        <option value="">Seleccionar</option>
                        {products.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name={`items.${index}.quantity` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-3 flex gap-2">
              <Button type="button" variant="ghost" onClick={() => append({ commodityId: '', quantity: 1 })}>Añadir item</Button>
              {fields.length > 1 && <Button type="button" variant="destructive" onClick={() => remove(index)}>Eliminar</Button>}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <Button type="submit">Registrar Venta</Button>
        </div>
      </form>
    </Form>
  )
}
