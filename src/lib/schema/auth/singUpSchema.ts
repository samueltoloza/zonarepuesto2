import { number, object, string } from "zod";

export const signUpSchema = object({
    document: number().min(1000000000).max(1999999999),
    email: string().email(),
    name: string(),
    password: string().min(8),
    confirmPassword: string().min(8),
});
