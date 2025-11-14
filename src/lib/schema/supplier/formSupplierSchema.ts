import { object, string, number } from 'zod'

export const formSupplierSchema = object({
  document: number().int().positive(),
  email: string().email(),
  name: string().min(2).max(200),
})
