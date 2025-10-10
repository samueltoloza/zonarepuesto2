import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error() { },
    warn() { },
  },
  ...authConfig,
});
