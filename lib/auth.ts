import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        
        // Fetch bio for the user if it's there
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { bio: true }
        });
        if (dbUser) {
          (session.user as any).bio = dbUser.bio;
        }
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
});