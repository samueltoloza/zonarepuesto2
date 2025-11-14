"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formHeadquarterSchema } from '@/lib/schema/headquarter/formHeadquarterSchema'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'
import { createHeadquarter } from '@/app/protected/headquarter/services/headquarter.services'

export default function HeadquarterForm() {
  const form = useForm<z.infer<typeof formHeadquarterSchema>>({
    resolver: zodResolver(formHeadquarterSchema),
    defaultValues: { name: '', city: '' },
  })

  const onSubmit = async (values: z.infer<typeof formHeadquarterSchema>) => {
    try {
      const data = await createHeadquarter(values)
      toast.success('Sede creada correctamente')
      form.reset()
      console.log('Nueva sede:', data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      toast.error(message || 'Error al crear la sede')
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
                <Input placeholder="Nombre de la sede" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ciudad</FormLabel>
              <FormControl>
                <Input placeholder="Ciudad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Creando...' : 'Crear Sede'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
