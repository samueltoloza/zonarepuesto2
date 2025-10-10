"use server";

import * as z from "zod";

import { hashPassword, signUpSchema } from "@/lib";
import prisma from "@/lib/prisma";

export const register = async (values: z.infer<typeof signUpSchema>) => {
  const validatedFields = signUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { document, password, confirmPassword, email, name } = validatedFields.data;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const hashedPassword = await hashPassword(password);

  const existingUser = await prisma.user.findUnique({
    where: { document },
  });

  if (existingUser) {
    return { error: "User already exists" };
  }

  await prisma.user.create({
    data: {
      document,
      email,
      name,
      password: hashedPassword,
    },
  });

  return { success: "User created successfully" };
};
