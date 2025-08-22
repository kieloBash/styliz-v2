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