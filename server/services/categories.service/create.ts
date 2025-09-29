import { CreateItemCategorySchema } from "@/app/(protected)/live/_schema";
import { adminProcedure } from "@/server/trpc/init";
import { QueryPayloadType } from "@/types/global";
import { logError } from "@/utils/error";

const SUCCESS_MESSAGE = "Successfully created item category!";
const FAILED_MESSAGE = "Failed to create item category due to: ";

export const createItemCategory = adminProcedure
    .input(CreateItemCategorySchema)
    .mutation(async ({ ctx, input }): Promise<QueryPayloadType<any>> => {
        try {

            await ctx.db!.itemCategory.create({
                data: { ...input }
            })

            return {
                message: SUCCESS_MESSAGE,
                success: true,
            };
        } catch (error: any) {
            return logError(error, FAILED_MESSAGE + error.message);
        }
    });
