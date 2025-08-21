import { cn } from "@/lib/utils"

interface SkeletonLoaderProps {
    className?: string
    lines?: number
    showAvatar?: boolean
}

export function SkeletonLoader({ className, lines = 3, showAvatar = false }: SkeletonLoaderProps) {
    return (
        <div className={cn("animate-pulse space-y-4", className)}>
            {showAvatar && (
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                    <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/6"></div>
                    </div>
                </div>
            )}
            <div className="space-y-3">
                {Array.from({ length: lines }).map((_, i) => (
                    <div key={i} className={cn("h-4 bg-slate-200 rounded", i === lines - 1 ? "w-3/4" : "w-full")}></div>
                ))}
            </div>
        </div>
    )
}
