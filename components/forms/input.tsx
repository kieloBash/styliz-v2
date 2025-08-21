// components/form/FormInput.tsx
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { UseFormReturn, FieldValues, Path } from "react-hook-form"
import { InputHTMLAttributes, ReactNode, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { BaseInput } from "./_base/input"

interface FormInputProps<T extends FieldValues>
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "form"> {
    name: Path<T>
    label?: string
    description?: string
    placeholder?: string
    form: UseFormReturn<T>
    leftIcon?: ReactNode
    className?: string
}

const FormInput = <T extends FieldValues = any>({
    form,
    name,
    label,
    description,
    placeholder = "Enter here",
    type = "text",
    className,
    leftIcon,
    ...rest
}: FormInputProps<T>) => {
    const [showPassword, setShowPassword] = useState(false)

    const isPasswordField = type === "password"

    const finalType = isPasswordField ? (showPassword ? "text" : "password") : type

    const rightIcon = isPasswordField ? (
        <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
        >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
    ) : null

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
                    <FormControl>
                        <BaseInput
                            {...field}
                            {...rest}
                            id={name}
                            type={finalType}
                            placeholder={placeholder}
                            className={className}
                            leftIcon={leftIcon}
                            rightIcon={rightIcon}
                        />
                    </FormControl>
                    {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default FormInput
