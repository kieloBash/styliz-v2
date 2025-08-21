import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import { Adapter } from "next-auth/adapters";

export const CustomPrismaAdapter = (): Adapter => {
    const base = PrismaAdapter(prisma);

    return {
        ...base,
        async createUser(data) {
            const role = await prisma.role.findUnique({
                where: { roleName: "USER" },
            });

            if (!role) throw new Error("Role 'USER' not found");

            return prisma.user.create({
                data: {
                    email: data.email,
                    name: data.name ?? "",
                    roleId: role.id,
                    isOnboarded: true,
                    hashedPassword: "pass",
                    emailVerified: new Date(),
                },
            }) as any
        },
    };
};
