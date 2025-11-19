'use client'
import { useLoading } from '@/components/providers/loading-provider'
import { Button } from '@/components/ui/button'
import { showToast } from '@/lib/utils'
import { trpc } from '@/server/trpc/client'
import { format } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import * as XLSX from "xlsx"

const ExtractCSV = () => {
    const searchParams = useSearchParams()
    const filterFromDateParams = searchParams.get("from") ?? format(new Date, "yyyy-MM-dd");
    const filterToDateParams = searchParams.get("to") ?? format(new Date, "yyyy-MM-dd");

    const { setIsLoading, setLoadingMessage } = useLoading()

    const { mutate } = trpc.invoice.extract.useMutation({
        onMutate: () => {
            setIsLoading(true)
            setLoadingMessage(`Exporting analytics to CSV ${filterFromDateParams} to ${filterToDateParams}`);
        },
        onSuccess: (data) => {
            showToast("success", "Success", data.message);

            const totalRows = data.payload?.total || [];
            const lossRows = data.payload?.lossSheet || [];
            const gainRows = data.payload?.gainSheet || [];

            if (totalRows.length === 0) return;

            // Create a new workbook
            const wb = XLSX.utils.book_new();

            // Helper: convert JSON to worksheet
            const jsonToSheet = (rows: any[]) => XLSX.utils.json_to_sheet(rows);

            // Add sheets
            XLSX.utils.book_append_sheet(wb, jsonToSheet(totalRows), "Total");
            XLSX.utils.book_append_sheet(wb, jsonToSheet(lossRows), "Loss");
            XLSX.utils.book_append_sheet(wb, jsonToSheet(gainRows), "Gain");

            // Filename
            const filename = `Analytics-${filterFromDateParams}-to-${filterToDateParams}.xlsx`;

            // Trigger download
            XLSX.writeFile(wb, filename);
        },
        onError: (error) => {
            showToast("error", "Something went wrong!", error.message)
        },
        onSettled: () => {
            setIsLoading(false)
            setLoadingMessage("")
        }
    })

    async function handleExtract() {
        mutate({ from: filterFromDateParams, to: filterToDateParams })
    }
    return (
        <Button className='bg-gradient-to-br from-red-500 to-rose-600' type='button' onClick={handleExtract}>Export</Button>
    )
}

export default ExtractCSV