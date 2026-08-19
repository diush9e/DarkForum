import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./db";

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login", newUser: "/auth/register" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error("البريد وكلمة المرور مطلوبان");
        const user = await prisma.user.findUnique({ where: { email: credentials.email as string } });
        if (!user || !user.password) throw new Error("المستخدم غير موجود");
        const isMatch = await bcrypt.compare(credentials.password as string, user.password);
        if (!isMatch) throw new Error("كلمة المرور غير صحيحة");
        return { id: user.id, email: user.email, name: user.name, username: user.username, image: user.image };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) { 
        session.user.id = token.id as string; 
        (session.user as any).username = token.username as string; 
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.username = (user as any).username; }
      return token;
    },
  },
});