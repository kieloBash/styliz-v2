import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg"
    className?: string
    text?: string
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    }

    return (
        <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
            <div className="relative">
                <div
                    className={cn("border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin", sizeClasses[size])}
                ></div>
                <div
                    className={cn(
                        "absolute inset-0 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animate-reverse",
                        sizeClasses[size],
                    )}
                ></div>
            </div>
            {text && <p className="text-slate-600 text-sm animate-pulse">{text}</p>}
        </div>
    )
}
