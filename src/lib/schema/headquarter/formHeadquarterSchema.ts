import { object, string } from 'zod';

export const formHeadquarterSchema = object({
  name: string().min(2).max(100),
  city: string().min(2).max(100),
});
