import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { prisma } from "@/lib/prisma";

function getRequiredGoogleOAuthConfig() {
  const clientId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || ""
  const clientSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || ""

  const isPlaceholder = (value: string) =>
    value.includes("your-google-client") || value.includes("changeme") || value.trim() === ""

  if (isPlaceholder(clientId) || isPlaceholder(clientSecret)) {
    throw new Error(
      "Google OAuth is not configured. Set real GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (or AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET) in .env."
    )
  }

  return { clientId, clientSecret }
}

const googleOAuth = getRequiredGoogleOAuthConfig()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any) as Adapter,
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: googleOAuth.clientId,
      clientSecret: googleOAuth.clientSecret,
      // Avoid runtime OIDC discovery request failures by using explicit Google endpoints.
      wellKnown: undefined,
      issuer: "https://accounts.google.com",
      authorization: {
        url: "https://accounts.google.com/o/oauth2/v2/auth",
        params: { scope: "openid email profile" },
      },
      token: {
        url: "https://oauth2.googleapis.com/token",
      },
      userinfo: {
        url: "https://openidconnect.googleapis.com/v1/userinfo",
      },
      jwks_endpoint: "https://www.googleapis.com/oauth2/v3/certs",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;

        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { bio: true },
          });
          if (dbUser) {
            (session.user as any).bio = dbUser.bio;
          }
        } catch {
          // Keep session usable even if DB is briefly unavailable.
        }
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
};

export function auth() {
  return getServerSession(authOptions);
}

export const authHandler = NextAuth(authOptions);
