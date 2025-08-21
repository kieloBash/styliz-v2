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
