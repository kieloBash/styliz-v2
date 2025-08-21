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

interface IProps {
    placeholder?: string;
    date: Date | undefined;
    setDate: (e: Date | undefined) => void;
    onChange?: (e: Date | undefined) => void;
}

export function DatePicker({ date, setDate, onChange, placeholder = "Select date" }: IProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className="flex flex-col gap-3">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className="lg:w-48 justify-between font-normal"
                    >
                        {date ? date.toLocaleDateString() : placeholder}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
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
