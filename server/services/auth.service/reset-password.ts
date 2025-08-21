import { publicProcedure } from "@/server/trpc/init";
import { resetPasswordSchema } from "@/app/auth/reset-password/_schema";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/prisma"
import bcrypt from "bcryptjs";
import { createPasswordResetAuditLog } from "@/lib/audit-logs";
import { logger } from "@/utils/logger";

export const resetPassword = publicProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ input }) => {
        console.log("RESETING TOKEN");
        logger.info("Called resetPassword publicProcedure");

        const { token, identifier, password } = input;

        if (!token || !identifier || !password) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "TOKEN_INVALID",
            });
        }

        const passwordToken = await prisma.passwordToken
            .findUnique({
                where: {
                    identifier_token: { token, identifier, },
                    expires: { gte: new Date() }
                }
            })

        if (!passwordToken) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Invalid or expired reset password token.",
            });
        }

        const isExpired = new Date() > passwordToken.expires;
        if (isExpired) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "TOKEN_EXPIRED",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const { updatedUser } = await prisma.$transaction(async (tx) => {
                const updatedUser = await tx.user.update({
                    where: { email: identifier },
                    data: { hashedPassword },
                });

                await tx.passwordToken.deleteMany({
                    where: { identifier },
                });

                return { updatedUser }
            });

            await createPasswordResetAuditLog({
                userId: updatedUser.id,
                metadata: {
                    reason: "Password reset via token",
                    email: identifier,
                },
            });

            return {
                message: "User password has been updated, please sign up again.",
            };
        } catch (error) {
            console.error("Reset password failed:", error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while resetting password.",
            });
        }
    })