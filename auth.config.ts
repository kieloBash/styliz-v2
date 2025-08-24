import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/prisma";
import GoogleProvider from "next-auth/providers/google";
import { createLoginAuditLog } from "./lib/audit-logs";
import { UserRole } from "./types/roles";

class InvalidLoginError extends CredentialsSignin {
    code = "InvalidCredentials"
}

class LoginTooManyAttemptsExceeded extends CredentialsSignin {
    code = "TooManyAttempts"
}

export default {
    providers: [
        Credentials({
            id: "admin-login",
            credentials: {
                email: {
                    type: "email",
                    label: "Email",
                    placeholder: "johndoe@gmail.com",
                },
                password: { label: "Password", type: "password", placeholder: "*****", },
            },
            async authorize(credentials, req) {
                console.log("Start authorize")

                const ip =
                    req.headers.get("x-forwarded-for")?.toString().split(",")[0] ??
                    req.headers.get("x-real-ip")?.toString() ??
                    "anonymous";

                const userAgentHeader = req.headers.get("user-agent") ?? "";

                const email = credentials.email as string;
                const password = credentials.password as string;

                const user = await prisma.user.findUnique({
                    where: {
                        email, role: { roleName: UserRole.ADMIN }
                    },
                    include: { role: true, preferences: true },
                })

                if (!user || !user.hashedPassword) return null;

                const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);

                await createLoginAuditLog({
                    userId: user?.id ?? "unknown",
                    metadata: {
                        ipAddress: ip,
                        method: "credentials",
                        success: !!(user && passwordsMatch),
                        rawUserAgent: userAgentHeader,
                    },
                });

                if (!passwordsMatch) {
                    throw new InvalidLoginError()
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role.roleName,
                    image: user.image,
                    isOnboarded: user?.isOnboarded ?? false,
                    emailVerified: user?.emailVerified ?? undefined,
                    preferences: {
                        theme: user?.preferences?.theme ?? "light"
                    }
                };
            },
        }),
        Credentials({
            id: "seller-login",
            credentials: {
                username: {
                    type: "text",
                    label: "Username",
                },
            },
            async authorize(credentials, req) {
                console.log("Start authorize")

                const ip =
                    req.headers.get("x-forwarded-for")?.toString().split(",")[0] ??
                    req.headers.get("x-real-ip")?.toString() ??
                    "anonymous";

                const userAgentHeader = req.headers.get("user-agent") ?? "";

                const username = credentials.username as string;

                const user = await prisma.user.findFirst({
                    where: {
                        name: {
                            equals: username,
                            mode: "insensitive"
                        },
                        role: { roleName: UserRole.SELLER }
                    },
                    include: { role: true, preferences: true }
                })

                if (!user) return null;

                await createLoginAuditLog({
                    userId: user?.id ?? "unknown",
                    metadata: {
                        ipAddress: ip,
                        method: "credentials",
                        success: !!(user),
                        rawUserAgent: userAgentHeader,
                    },
                });

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role.roleName,
                    image: user.image,
                    isOnboarded: user?.isOnboarded ?? false,
                    emailVerified: user?.emailVerified ?? undefined,
                    preferences: {
                        theme: user?.preferences?.theme ?? "light"
                    }
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
} satisfies NextAuthConfig;
