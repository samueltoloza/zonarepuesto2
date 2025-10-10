import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./schema";
import { getUserByDocument } from "@/app/auth/login/services";
// import { loginServiceLayerActionServer, renewSession } from "@/app/auth/login/services";
// import { getUser } from "@/app/auth/login/services";

export default {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        document: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const validatedFields = signInSchema.safeParse({
            document: Number(credentials?.document),
            password: credentials?.password,
          });

          if (validatedFields.success) {
            const { document, password } = validatedFields.data;

            const user = await getUserByDocument(document, password);
            console.log(user);
            
            if (user) {
              return user;
            } else {
              console.error("Error fetching user:", user);
              return null;
            }
          }
          return null;
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // extablecer exp en media hora
        // token.exp = Math.floor(user.expirationTime / 1000);
        // token.SessionId = user.SessionId;
        // token.expirationTime = user.expirationTime;
        token.sub = user.id;
        // token.username = user.firstName + " " + user.lastName;
        // token.firstName = user.firstName;
        // token.lastName = user.lastName;
        token.email = user.email;
        token.name = user.name;
        // token.workbench = user.workbench;
        // token.permissions = user.permissions;
      }

      // 2. Renovación automática (check cada 5 min)
      // const now = Date.now();
      // const shouldRenew = token.expirationTime
      //   && now > token.expirationTime - 5 * 60 * 1000; // 5 min antes de expirar

      // if (shouldRenew && token.SessionId) {
      //   try {
      //     const renewed = await renewSession(token.SessionId);

      //     // Actualiza el token con nueva información
      //     token.SessionId = renewed.SessionId;
      //     token.expirationTime = now + renewed.SessionTimeout * 60 * 1000;
      //     token.exp = Math.floor(token.expirationTime / 1000); // Convertir a segundos
      //   } catch (error) {
      //     console.error("Session renewal failed:", error);
      //     // Forzar logout al fallar
      //     token.exp = 0;
      //   }
      // }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        // session.SessionId = token.SessionId;
        // session.expirationTime = token.expirationTime;
        session.user.id = token.sub ?? "";
        // session.user.username = token.username;
        // session.user.firstName = token.firstName;
        // session.user.lastName = token.lastName;
        session.user.email = token.email ?? "";
        session.user.name = token.name;
        session.user.image = token.picture ?? "";
        // session.user.workbench = token.workbench;
        // session.user.permissions = token.permissions;
        // session.user.SessionId = token.SessionId;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
