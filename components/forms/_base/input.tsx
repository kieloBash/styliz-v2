// components/form/BaseInput.tsx
import React, { InputHTMLAttributes, ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: ReactNode
    rightIcon?: ReactNode
}

export const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
    ({ leftIcon, rightIcon, className, ...props }, ref) => {
        return (
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {leftIcon}
                    </div>
                )}
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {rightIcon}
                    </div>
                )}
                <Input
                    ref={ref}
                    className={cn(
                        "h-11 w-full",
                        leftIcon && "pl-10",
                        rightIcon && "pr-10",
                        className
                    )}
                    {...props}
                />
            </div>
        )
    }
)

BaseInput.displayName = "BaseInput"
