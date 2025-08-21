import React from 'react'
import { Form } from '../ui/form'
import { FieldValues, UseFormReturn } from 'react-hook-form'
import { cn } from '@/lib/utils'

interface FormContainerProps<T extends FieldValues> {
    form: UseFormReturn<T>
    onSubmit: (values: T) => Promise<void>
    children: React.ReactNode
    className?: string
}

const FormContainer = <T extends FieldValues>({ form, onSubmit, children, className }: FormContainerProps<T>) => {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
                {children}
            </form>
        </Form>
    )
}

export default FormContainer