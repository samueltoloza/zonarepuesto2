import { object, string, array, number } from 'zod'

export const formSaleSchema = object({
  headquartersId: string().min(2),
  userId: string().min(2),
  items: array(
    object({
      commodityId: string().min(2),
      quantity: number().min(1),
    })
  ).min(1),
})
