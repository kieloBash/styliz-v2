import { FullInvoiceType } from "@/types/db";
import { create } from "zustand";

type SelectedInvoiceType = FullInvoiceType;
type StoreType = {
    selectedInvoice: SelectedInvoiceType | null;
    actions: {
        setSelectedInvoice: (e: SelectedInvoiceType | null) => void
    };
}

const initialValues: Omit<StoreType, "actions"> = {
    selectedInvoice: null,
}


export const useUserDashboardStore = create<StoreType>((set) => ({
    ...initialValues,
    actions: {
        setSelectedInvoice: (invoice) => set({ selectedInvoice: invoice })
    }
}))