import { prisma } from "@/prisma";
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import authConfig from "./auth.config";
import { CustomPrismaAdapter } from "./lib/adapter";
import { getIpFromRequest } from "./lib/request";
import { createLoginAuditLog } from "./lib/audit-logs";
import { logger } from "./utils/logger";

export type ExtendedUser = DefaultSession["user"] & {
    role: string;
    isOnboarded: boolean;
    emailVerified?: Date;
    preferences: {
        theme: string
    }
};

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
        isOnboarded: boolean;
        emailVerified?: Date;
        preferences: {
            theme: string
        };
        accessTokenExpires?: number;
        error?: string;
    }
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
        error?: string;
    }

    interface User {
        id: string;
        role: string;
        isOnboarded: boolean;
        emailVerified?: Date;
        preferences: {
            theme: string
        }
    }
}

const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION ? parseInt(process.env.TOKEN_EXPIRATION) : 60 * 60 * 24; // default 24 hours

export const { handlers, auth } = NextAuth({
    pages: {
        signIn: "/auth/sign-in",
        signOut: "/",
        error: "/auth/error",           // 🔁 show custom messages
        verifyRequest: "/auth/verify-email",
    },
    adapter: CustomPrismaAdapter(),
    secret: process.env.AUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: "jwt",
        maxAge: TOKEN_EXPIRATION,
        updateAge: TOKEN_EXPIRATION,
    },
    callbacks: {
        async jwt({ token, user }) {
            const now = Math.floor(Date.now() / 1000);
            const TOKEN_EXPIRATION = 60 * 60 * 24;

            if (user) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email ?? undefined },
                    include: { role: true, preferences: true },
                });

                return {
                    ...token,
                    id: dbUser?.id ?? "",
                    role: dbUser?.role.roleName ?? "",
                    isOnboarded: dbUser?.isOnboarded ?? false,
                    emailVerified: dbUser?.emailVerified ?? undefined,
                    preferences: {
                        theme: dbUser?.preferences?.theme ?? "light"
                    },
                    accessTokenExpires: now + TOKEN_EXPIRATION,
                };
            }

            if (token.accessTokenExpires && now < token.accessTokenExpires) return token;

            return { ...token, error: "TokenExpired" };
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    role: token.role,
                    image: token.picture,
                    isOnboarded: token.isOnboarded,
                    emailVerified: token.emailVerified,
                    preferences: token.preferences,
                },
                error: token.error,
            }
        },
        async signIn({ user, account }) {
            if ((user as any)?.name === "CredentialsSignin") {
                const url = new URL("/auth/error", process.env.NEXT_PUBLIC_APP_URL);
                url.searchParams.set("error", "TooManyAttempts");
                return url.toString();
            }

            if (account?.provider === "credentials") {
                if (!user.emailVerified) {
                    const url = new URL("/auth/sign-in", process.env.NEXT_PUBLIC_APP_URL);
                    url.searchParams.set("code", "EmailVerify");
                    return url.toString();
                }
                if (!user.isOnboarded) {
                    return `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`;
                }
            } else if (account?.provider === "google") {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email!, emailVerified: { not: null } },
                });


                if (existingUser) {

                    await createLoginAuditLog({
                        userId: user.id,
                        metadata: {
                            method: "google",
                            success: true,
                        },
                    });

                    await prisma.account.upsert({
                        where: {
                            provider_providerAccountId: {
                                provider: "google",
                                providerAccountId: account.providerAccountId,
                            },
                        },
                        update: {},
                        create: {
                            userId: existingUser.id,
                            provider: account.provider,
                            type: account.type,
                            providerAccountId: account.providerAccountId,
                            access_token: account.access_token,
                            id_token: account.id_token,
                        },
                    });

                    return true;
                }
            }
            return true;
        },
    },
    ...authConfig
})
