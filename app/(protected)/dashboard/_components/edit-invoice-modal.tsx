'use client'
import { useLoading } from '@/components/providers/loading-provider';
import { showToast } from '@/lib/utils';
import { trpc } from '@/server/trpc/client';
import { FullInvoiceType } from '@/types/db';
import UpdateInvoiceForm from '../_forms/update-invoice';
import { UpdateInvoiceType } from '../_schemas';

type Props = {
    isOpen: boolean
    onClose: () => void
    invoice: FullInvoiceType | null
}

const EditInvoiceModal = ({ isOpen, invoice, onClose }: Props) => {
    const platformData = trpc.platform.getList.useQuery();
    const categoryData = trpc.category.getList.useQuery();
    const sellerData = trpc.seller.getList.useQuery();
    const { setIsLoading, setLoadingMessage } = useLoading();
    const utils = trpc.useUtils();
    console.log({ invoice })

    const onUpdateInvoice = trpc.invoice.update.invoice.useMutation({
        onMutate: (data) => {
            setIsLoading(true)
            setLoadingMessage(`Updating invoice ${data.invoiceId}`);
        },
        onSuccess: (data) => {
            if (data.success) {
                showToast("success", "Success", data.message)
                utils.invoice.getList.invalidate()
                onClose();
            } else {
                showToast("error", "Something went wrong!", data.message)
            }
        },
        onError: (error) => {
            showToast("error", "Something went wrong!", error.message)
        },
        onSettled: () => {
            setIsLoading(false)
            setLoadingMessage("")
        }
    })

    const handleSaveChanges = async (values: UpdateInvoiceType) => {
        onUpdateInvoice.mutate(values);
    }

    if (isOpen && invoice)
        return (
            <div className='fixed w-screen h-screen top-0 left-0 z-[10] bg-black/70 flex justify-center items-center'>
                <UpdateInvoiceForm invoice={invoice} onSave={handleSaveChanges} onClose={onClose}
                    sellers={sellerData.data?.payload}
                    platforms={platformData.data?.payload}
                    categories={categoryData.data?.payload}
                />
            </div>
        )
}

export default EditInvoiceModal
