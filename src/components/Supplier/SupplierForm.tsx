"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSupplierSchema } from '@/lib/schema/supplier/formSupplierSchema'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'
import { createSupplier } from '@/app/protected/supplier/services/supplier.services'

export default function SupplierForm() {
  const form = useForm<z.infer<typeof formSupplierSchema>>({
    resolver: zodResolver(formSupplierSchema),
    defaultValues: { document: 0, email: '', name: '' },
  })

  const onSubmit = async (values: z.infer<typeof formSupplierSchema>) => {
    try {
      const data = await createSupplier(values)
      toast.success('Proveedor creado correctamente')
      form.reset()
      console.log('Nuevo proveedor:', data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      toast.error(message || 'Error al crear proveedor')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white rounded shadow">
        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documento</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Documento" value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))} />
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
                <Input placeholder="Email" {...field} />
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
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Creando...' : 'Crear Proveedor'}</Button>
        </div>
      </form>
    </Form>
  )
}
