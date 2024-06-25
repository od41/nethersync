import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiHandler } from "next";
import { AUTH_SECRET } from "@/server/config";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@mail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Replace this with your actual user authentication logic
        const user = { id: "1", email: credentials?.email };
        if (user) {
          return user;
        }
        return null;
      },
    }),
  ],
  secret: AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  // callbacks: {
  //   async session({ session, token }) {
  //     // @ts-ignore
  //     session!.user!.id! = token.id;
  //     return session;
  //   },
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.id = user.id;
  //     }
  //     return token;
  //   },
  // },
};

// const authHandler: NextApiHandler = (req, res) =>
//   NextAuth(req, res, authOptions);
const authHandler = NextAuth(authOptions);
export { authHandler as GET, authHandler as POST };
