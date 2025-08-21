import { prisma } from "@/prisma";

export const createUser = async ({ email, name, hashedPassword, phone, roleId, isOnboarded = false, emailVerified }: {
    email: string,
    name: string,
    hashedPassword: string,
    phone: string,
    roleId: string,
    isOnboarded?: boolean,
    emailVerified?: Date,
}) => {
    const user = await prisma.user.create({
        data: {
            email,
            name,
            hashedPassword,
            phone,
            roleId,
            isOnboarded,
            emailVerified
        },
    });

    const [] = await Promise.all([
        await prisma.userProfile.upsert({
            where: { userId: user.id },
            update: {},
            create: {
                userId: user.id
            },
        }),
        await prisma.userPreferences.upsert({
            where: { userId: user.id },
            update: {},
            create: {
                userId: user.id,
                theme: "light"
            }
        })
    ])


    return user;
}