import { secretKey } from "@/config";
import { auth } from "@/services/auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  secret: secretKey,
  callbacks: {
    session({ session, token }) {
      // console.log(token);
      session.user.id = token?.id ?? "";
      session.user.apiToken = token?.apiToken ?? "";

      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.apiToken = user.apiToken;
        token.id = user.id;
      }

      return token;
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          if (typeof credentials !== "undefined") {
            const { data } = await auth(
              credentials.email,
              credentials.password
            );

            if (typeof data !== "undefined") {
              return {
                ...data.user,
                apiToken: data.token,
              };
            } else {
              return null;
            }
          } else {
            return null;
          }
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
});
