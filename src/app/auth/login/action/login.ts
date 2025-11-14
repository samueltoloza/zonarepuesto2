"use server";

import * as z from "zod";

import { signIn } from "@/lib/auth";
import { signInSchema } from "@/lib";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const login = async (values: z.infer<typeof signInSchema>) => {
  const validatedFields = signInSchema.safeParse({
    document: Number(values.document),
    password: values.password
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { document, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      document,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "An unknown error occurred" };
      }
    }
    throw error; // Re-throw the error if it's not an AuthError
  }
};