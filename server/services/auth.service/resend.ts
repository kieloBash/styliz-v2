import { verificationSchema } from "@/app/auth/verify-email/_schema";
import { publicProcedure } from "@/server/trpc/init";
import { transporter } from "@/utils/mail";
import { TRPCError } from "@trpc/server";

import { prisma } from "@/prisma"
import { logger } from "@/utils/logger";

export const resend = publicProcedure
    .input(verificationSchema)
    .mutation(async ({ input, ctx }) => {
        console.log("RESENDING TOKEN");
        const { token, identifier: email } = input;
        logger.info("Called resend publicProcedure");

        const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
        await prisma.verificationToken.create({
            data: {
                identifier: email,
                expires,
                token
            }
        })

        const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}&email=${email}`;

        try {
            await transporter.sendMail({
                from: `"${process.env.NEXT_PUBLIC_APP_NAME}" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Verify your email",
                html: `<p>Click below to verify your email:</p><p><a href="${verifyUrl}">Verify Email</a></p>`,
            });

        } catch (error) {
            await prisma.verificationToken.deleteMany({ where: { identifier: email } });
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An error occurred while verifying email.",
            });
        }

        return { message: "A new verication has been sent to your email" }
    })