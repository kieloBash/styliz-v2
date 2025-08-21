import { registerSchema } from "@/app/auth/sign-in/_schema";
import { NextResponse } from "next/server";

import { prisma } from "@/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { transporter } from "@/utils/mail";
import { createUser } from "@/lib/user";
import { logger } from "@/utils/logger";

export async function POST(req: Request) {
    try {
        logger.info("Called register REST API");

        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0] ??
            req.headers.get("x-real-ip") ??
            "anonymous";

        const body = await req.json();

        const parsed = registerSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: "Invalid input", issues: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { email, firstName, lastName, phone, password } = parsed.data;
        const hashedPassword = await bcrypt.hash(password, 10);

        const existing = await prisma.user.findUnique({ where: { email } })

        if (existing) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        const role = await prisma.role.findFirst({ where: { roleName: "USER" }, select: { id: true } })
        if (!role) {
            return NextResponse.json(
                { error: "Invalid role" },
                { status: 400 }
            );
        }

        await createUser({
            email,
            name: `${firstName} ${lastName}`,
            phone, hashedPassword,
            roleId: role.id,
            isOnboarded: true,
        });

        const token = uuidv4();
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
            await prisma.user.delete({ where: { email } });
            await prisma.passwordToken.deleteMany({ where: { identifier: email } });
            return NextResponse.json(
                { error: "Email failed, registration aborted." },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: "Registered successfully, a verification has been sent to your email!" }, { status: 201 });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
