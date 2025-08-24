import { NewSellerSchema } from "@/app/(protected)/dashboard/_schemas";
import { adminProcedure } from "@/server/trpc/init";
import { QueryPayloadType } from "@/types/global";
import { UserRole } from "@/types/roles";
import { logError } from "@/utils/error";
import bcrypt from "bcryptjs";

const SUCCESS_MESSAGE = "Successfully created seller!";
const FAILED_MESSAGE = "Failed to create seller due to: ";

export const createSeller = adminProcedure
    .input(NewSellerSchema)
    .mutation(async ({ ctx, input }): Promise<QueryPayloadType<any>> => {
        try {
            // 1. Check if email already exists
            const existingUser = await ctx.db!.user.findUnique({
                where: { email: input.email },
            });

            if (existingUser) {
                throw new Error("Email already exists.")
            }

            // 2. Get seller role
            const sellerRole = await ctx.db!.role.findFirst({
                where: { roleName: UserRole.SELLER },
            });

            if (!sellerRole) {
                throw new Error("Seller role not found.")
            }

            // 3. Hash password (never store raw!)
            const hashedPassword = await bcrypt.hash(input.password, 10);

            // 4. Create seller
            await ctx.db!.user.create({
                data: {
                    name: input.name,
                    email: input.email,
                    hashedPassword,
                    roleId: sellerRole.id,
                    isOnboarded: true,
                    emailVerified: new Date(),
                },
            });

            return {
                message: SUCCESS_MESSAGE,
                success: true,
            };
        } catch (error: any) {
            return logError(error, FAILED_MESSAGE + error.message);
        }
    });
