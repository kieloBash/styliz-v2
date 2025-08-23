import { FullInvoiceType } from "@/types/db";
import { InvoiceStatus } from "@prisma/client";
import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function showToast(
  type: "success" | "error",
  title: string,
  description?: string
) {
  const isSuccess = type === "success";

  toast(title, {
    description,
    duration: 4000,
    style: {
      backgroundColor: isSuccess ? "#16a34a" : "#dc2626", // green vs red
      color: "white",
      border: "1px solid",
      borderColor: isSuccess ? "#15803d" : "#b91c1c",
      boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
    },
    icon: isSuccess ? "✅" : "❌",
  });
}

export const getStatusBadgeColor = (status: InvoiceStatus) => {
  switch (status) {
    case InvoiceStatus.COMPLETED:
      return "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0"
    case InvoiceStatus.JOYJOY:
      return "bg-gradient-to-r from-red-400 to-pink-500 text-white border-0"
    case InvoiceStatus.RTS:
      return "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0"
    default:
      return "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0"
  }
}

export const getStatusColor = (status: InvoiceStatus) => {
  switch (status) {
    case InvoiceStatus.COMPLETED:
      return "bg-green-500"
    case InvoiceStatus.JOYJOY:
      return "bg-red-500"
    case InvoiceStatus.RTS:
      return "bg-gray-500"
    default:
      return "bg-gray-500"
  }
}

export const copyInvoiceToClipboard = (invoice: FullInvoiceType) => {
  if (!invoice) return;

  const formattedItems = invoice.items
    .map((item, idx) => `  ${idx + 1}. ${item.category.name} - ₱${item.price.toLocaleString()}`)
    .join("\n");

  const text = `
Hi sis ${invoice.customer.name}! 👋

Thanks for shopping at StylizBoutique! Here's your order summary:

🛍 Items:
${formattedItems}

💰 Total: ₱${invoice.subTotal}
🎁 Freebies: ${invoice.freebies ?? 0}

Seller: ${invoice.seller.name}
Date: ${new Date(invoice.dateIssued).toLocaleDateString()}

We hope you love your items! ❤️
Looking forward to seeing you again soon!
`.trim();

  // Copy to clipboard
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log("Invoice copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy invoice:", err);
    });
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount)
}