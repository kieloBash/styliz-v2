import { verificationSchema } from "@/app/auth/verify-email/_schema";
import { publicProcedure } from "@/server/trpc/init";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/prisma"
import { createEmailVerifiedAuditLog } from "@/lib/audit-logs";
import { logger } from "@/utils/logger";

export const verify = publicProcedure
    .input(verificationSchema)
    .mutation(async ({ input }) => {
        console.log("VERIFYING TOKEN");
        logger.info("Called verify publicProcedure");

        const { token, identifier } = input;

        if (!token || !identifier) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "TOKEN_INVALID",
            });
        }

        const verificationToken = await prisma.verificationToken
            .findUnique({
                where: {
                    identifier_token: { token, identifier, },
                    expires: { gte: new Date() }
                }
            })

        if (!verificationToken) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Invalid or expired verification token.",
            });
        }


        const isExpired = new Date() > verificationToken.expires;
        if (isExpired) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "TOKEN_EXPIRED",
            });
        }

        try {
            const { updatedUser } = await prisma.$transaction(async (tx) => {
                const updatedUser = await tx.user.update({
                    where: { email: identifier },
                    data: { emailVerified: new Date() },
                });

                await tx.verificationToken.deleteMany({
                    where: { identifier },
                });

                return { updatedUser }
            });

            await createEmailVerifiedAuditLog({
                userId: updatedUser.id,
                metadata: {
                    verifiedAt: new Date().toISOString(),
                    verificationMethod: "token", // or "magic-link", "admin", etc.
                },
            })

            return {
                message: "Email successfully verified.",
            };
        } catch (error) {
            console.error("Email verification failed:", error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while verifying email.",
            });
        }
    });