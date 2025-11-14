import { object, string, number } from 'zod'

export const formProductSchema = object({
  name: string().min(2).max(200),
  description: string().min(2).max(1000),
  price: number().min(0.01),
  supplierId: string().optional(),
  headquartersId: string().optional(),
})
