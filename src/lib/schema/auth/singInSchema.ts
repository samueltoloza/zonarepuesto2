import { number, object, string } from "zod";

export const signInSchema = object({
    document: number().min(1000000000).max(1999999999),
    password: string().min(8),
});
