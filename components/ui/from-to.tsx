'use client'
import { DATE_FORMAT_SHORT } from '@/constants/formats'
import { formatDate } from 'date-fns'
import { Calendar1Icon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from './button'
import { DatePicker } from './date-picker'

type Props = {
    fromParam?: string;
    toParam?: string;
    clearSelected?: () => void;
}

const DateFromAndTo = ({ fromParam = "from", toParam = "to", clearSelected }: Props) => {
    const searchParams = useSearchParams()
    const router = useRouter();

    const filterFromDateParams = searchParams.get(fromParam)
    const filterToDateParams = searchParams.get("to")
    const [from, setFrom] = useState<Date | undefined>(filterFromDateParams ? new Date(filterFromDateParams) : undefined);
    const [to, setTo] = useState<Date | undefined>(filterToDateParams ? new Date(filterToDateParams) : undefined);

    const handleChangeToday = (newDate: Date | undefined) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newDate) {
            const date = newDate ? formatDate(newDate, DATE_FORMAT_SHORT) : "";
            params.set("to", date);
            params.set("from", date);
        } else {
            params.delete("to")
            params.delete("from")
        }

        params.set("page", "1");
        router.push(`?${params.toString()}`);
        if (clearSelected)
            clearSelected();
    }

    const handleChangeDateFrom = (newDate: Date | undefined) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newDate) {
            const date = newDate ? formatDate(newDate, DATE_FORMAT_SHORT) : "";
            params.set(fromParam, date);
        } else {
            params.delete(fromParam)
        }

        params.set("page", "1");
        router.push(`?${params.toString()}`);
        if (clearSelected)
            clearSelected();
    }

    const handleChangeDateTo = (newDate: Date | undefined) => {
        console.log({ newDate })
        const params = new URLSearchParams(searchParams.toString());

        if (newDate) {
            const date = newDate ? formatDate(newDate, DATE_FORMAT_SHORT) : "";
            params.set(toParam, date);
        } else {
            params.delete(toParam)
        }
        params.set("page", "1");
        router.push(`?${params.toString()}`);
        if (clearSelected)
            clearSelected();
    }

    const handleChangeToToday = () => {
        const newDate = from || to ? undefined : new Date()
        setFrom(newDate)
        setTo(newDate)
        handleChangeToday(newDate)
    }

    const handleChangeDateRange = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (from && to) {
            const fromDate = from ? formatDate(from, DATE_FORMAT_SHORT) : "";
            const toDate = to ? formatDate(to, DATE_FORMAT_SHORT) : "";

            params.set(fromParam, fromDate);
            params.set(toParam, toDate);
        } else {
            params.delete(fromParam)
            params.delete(toParam)
        }

        params.set("page", "1");
        router.push(`?${params.toString()}`);
        if (clearSelected)
            clearSelected();
    }


    return (
        <div className="flex gap-3 justify-center items-center">
            <div className="flex gap-2 rounded-xl p-2 bg-gradient-to-br from-red-500 to-rose-600">
                <DatePicker
                    popOverClassName='h-8 lg:w-32'
                    placeholder="Date from"
                    // onChange={handleChangeDateFrom}
                    date={from}
                    setDate={setFrom}
                />
                <DatePicker
                    popOverClassName='h-8 lg:w-32'
                    placeholder="Date to"
                    // onChange={handleChangeDateTo}
                    date={to}
                    setDate={setTo}
                />
                <Button onClick={handleChangeDateRange} type='button' className='size-8 bg-white hover:bg-muted text-red-500'><Calendar1Icon /></Button>
            </div>
            <Button className='bg-gradient-to-br from-red-500 to-rose-600 text-white' type='button' onClick={handleChangeToToday}>
                {from || to ? "Clear Dates" : "Today"}
            </Button>
        </div>
    )
}

export default DateFromAndTo