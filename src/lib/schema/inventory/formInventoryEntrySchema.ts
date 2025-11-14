import { number, object, string } from "zod";

export const formInventoryEntrySchema = object({
    commodityId: string().min(2).max(100),
    headquartersId: string().min(2).max(100),
    cantidad: number().min(1),
    userId: string().min(2).max(100),
});