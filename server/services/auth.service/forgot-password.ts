import { emailSchema } from "@/app/auth/forgot-password/_schema";
import { publicProcedure } from "@/server/trpc/init";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/prisma"

import { addHours } from "date-fns"
import { transporter } from "@/utils/mail";
import { createPasswordResetRequestAuditLog } from "@/lib/audit-logs";
import { logger } from "@/utils/logger";

export const forgotPassword = publicProcedure
    .input(emailSchema)
    .mutation(async ({ input }) => {
        console.log("FORGOT PASSWORD")
        logger.info("Called forgotPassword publicProcedure");

        const { email: identifier } = input

        const token = uuidv4();

        if (!token || !identifier) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid token",
            });
        }

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}&email=${identifier}`;

        const existingUser = await prisma.user.findUnique({ where: { email: identifier } })
        if (!existingUser) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "User does not exist",
            });
        }

        const existingToken = await prisma.passwordToken.findFirst({
            where: {
                identifier, token, expires: { gte: new Date() }
            }
        })

        if (existingToken) {
            return { message: "You already requested a reset token, please check your mail" }
        }


        try {
            await prisma.passwordToken.create({
                data: {
                    identifier,
                    token,
                    expires: addHours(new Date(), 1)
                }
            })

            await transporter.sendMail({
                from: `"${process.env.NEXT_PUBLIC_APP_NAME}" <${process.env.EMAIL_USER}>`,
                to: identifier,
                subject: "Create a new password",
                html: `<p>Click below to reset your password:</p><p><a href="${resetUrl}">Reset Password</a></p>`,
            });

            await createPasswordResetRequestAuditLog({
                userId: existingUser.id,
                metadata: {
                    reason: "Password request reset via token",
                    identifier
                }
            })

            return { message: "A reset password token has been sent to your mail" }

        } catch (error) {
            console.error("Password reset failed:", error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while creating a reset password token",
            });
        }
    });
