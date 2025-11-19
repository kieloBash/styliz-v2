import { protectedProcedure } from "@/server/trpc/init";
import { logger } from "@/utils/logger";
import { InvoiceStatus } from "@prisma/client";
import { endOfDay, format, startOfDay } from "date-fns";
import z from "zod";

export type ExtractType = z.infer<typeof ExtractSchema>;
export const ExtractSchema = z.object({
    to: z.string(),
    from: z.string(),
});

export const extractAnalytics = protectedProcedure
    .input(ExtractSchema)
    .mutation(async ({ input, ctx }) => {
        try {
            const { from, to } = input;

            const invoices = await ctx.db.invoice.findMany({
                where: {
                    dateIssued: {
                        gte: startOfDay(new Date(from)),
                        lte: endOfDay(new Date(to)),
                    },
                    status: InvoiceStatus.COMPLETED
                },
                include: {
                    seller: true,
                    platform: true,
                    items: true,
                },
            });



            console.log(invoices)

            const getShift = (date: Date) => {
                const hour = date.getHours(); // 0–23

                if (hour >= 9 && hour < 12) return "MORNING";
                if (hour >= 12 && hour < 18) return "AFTERNOON";
                return "EVENING"; // includes 18–23 AND 00–04
            };

            function capitalize(str: string) {
                if (!str) return "";
                return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            }

            // --- GROUPING LOGIC ---
            const grouped: Record<string, {
                Date: string;
                Seller: string;
                SHIFT: string;
                AmountShopee: number;
                AmountTikTok: number;
                TotalAmount: number;
                CompletedItems: number;
                Earnings: number;
            }> = {};

            for (const inv of invoices) {
                const date = inv.dateIssued.toISOString().split("T")[0];
                const seller = inv.seller.name;
                const shift = getShift(inv.dateIssued);

                const key = `${date}-${seller}`;
                const completedItems = inv.items.filter(i => i.status === "COMPLETED").length;

                if (!grouped[key]) {
                    grouped[key] = {
                        Date: format(date, "[eeee] MMMM dd, yyyy"),
                        Seller: capitalize(seller),
                        SHIFT: "",
                        AmountShopee: 0,
                        AmountTikTok: 0,
                        TotalAmount: 0,
                        CompletedItems: 0,
                        Earnings: 0,
                    };
                }

                if (inv.platform.name === "Shopee") {
                    grouped[key].AmountShopee += inv.subTotal;
                }

                if (inv.platform.name === "Tiktok") {
                    grouped[key].AmountTikTok += inv.subTotal;
                }

                grouped[key].TotalAmount += inv.subTotal
                grouped[key].CompletedItems += completedItems;
            }

            const rows = Object.values(grouped);
            const tax = 0.718;
            const food = 70;
            const pricePerItem = 70;

            const SALARY_SELLER: Record<string, number> = {
                "PHALOMA": 550,
                "JAI": 500,
                "LIZ": 300,
                "ZIA": 550,
                "SHEIN": 450,
                "SAM": 450,
            };

            const results = rows.map(row => {
                const sellerKey = row.Seller.toUpperCase(); // ensure matching keys
                const salary = SALARY_SELLER[sellerKey] || 0;

                const earnings = (row.TotalAmount * tax) - salary - food - (pricePerItem * row.CompletedItems);

                return {
                    ...row,
                    Earnings: earnings,
                    "Gain/Loss": earnings <= 0 ? "LOSS" : "GAIN"
                };
            });

            console.log({ results });

            const lossSheet = results.filter((d) => d["Gain/Loss"] === "LOSS");
            const gainSheet = results.filter((d) => d["Gain/Loss"] === "GAIN");

            // --- ANALYTICS SHEET ---
            const analyticsMap: Record<
                string,
                { Seller: string; TOTAL_GAIN: number; TOTAL_LOSS: number; GRAND_TOTAL: number }
            > = {};

            for (const row of results) {
                const seller = row.Seller;
                if (!analyticsMap[seller]) {
                    analyticsMap[seller] = {
                        Seller: seller,
                        TOTAL_GAIN: 0,
                        TOTAL_LOSS: 0,
                        GRAND_TOTAL: 0,
                    };
                }

                if (row["Gain/Loss"] === "GAIN") {
                    analyticsMap[seller].TOTAL_GAIN += row.Earnings;
                } else {
                    analyticsMap[seller].TOTAL_LOSS += row.Earnings;
                }

                analyticsMap[seller].GRAND_TOTAL += row.Earnings;
            }

            // Convert to array and calculate PERCENTAGE_OF_LOSS
            const analyticsSheet = Object.values(analyticsMap).map(s => ({
                Seller: s.Seller,
                "TOTAL GAIN": s.TOTAL_GAIN,
                "TOTAL LOSS": s.TOTAL_LOSS,
                "GRAND TOTAL": s.GRAND_TOTAL,
                "PERCENTAGE OF LOSS":
                    s.GRAND_TOTAL !== 0 ? ((s.TOTAL_LOSS / s.TOTAL_GAIN) * 100).toFixed(2) + "%" : "0%",
            }));

            return {
                success: true,
                message: "Successfully extracted invoices",
                payload: { total: results, lossSheet, gainSheet, analyticsSheet },
            };
        } catch (error) {
            const message = "failed to extract invoices";
            logger.error(`Error: ${message}`, { error });

            return {
                success: false,
                message,
            };
        }
    });
