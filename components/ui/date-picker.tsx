"use client"

import { ChevronDownIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface IProps {
    placeholder?: string;
    date: Date | undefined;
    setDate: (e: Date | undefined) => void;
    onChange?: (e: Date | undefined) => void;
    containerClassName?: string;
    popOverClassName?: string;
    popOverContentClassName?: string;
}

export function DatePicker({ date, setDate, onChange, placeholder = "Select date", containerClassName, popOverContentClassName, popOverClassName }: IProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className={cn("flex flex-col gap-3", containerClassName)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className={cn("lg:w-48 justify-between font-normal", popOverClassName)}
                    >
                        {date ? date.toLocaleDateString() : placeholder}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={cn("w-auto overflow-hidden p-0", popOverContentClassName)} align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            setDate(date)
                            setOpen(false)
                            if (onChange)
                                onChange(date)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
