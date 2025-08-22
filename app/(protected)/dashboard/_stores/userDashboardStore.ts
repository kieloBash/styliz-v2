import { FullInvoiceType } from "@/types/db";
import { create } from "zustand";

type SelectedInvoiceType = FullInvoiceType;
type StoreType = {
    selectedInvoice: SelectedInvoiceType | null;
    isEdittingInvoice: boolean;
    isEdittingBulk: boolean;
    isSelectingInvoice: boolean;
    rowsSelected: SelectedInvoiceType[];
    actions: {
        setSelectedInvoice: (e: SelectedInvoiceType | null) => void
        setIsEdittingInvoice: (e: boolean) => void
        setIsEdittingBulk: (e: boolean) => void
        setIsSelectingInvoice: (e: boolean) => void
        setRowsSelected: (rows: SelectedInvoiceType[]) => void
        addRow: (row: SelectedInvoiceType) => void
        addRows: (row: SelectedInvoiceType[]) => void
        removeRow: (row: SelectedInvoiceType) => void
        isRowSelected: (row: SelectedInvoiceType) => boolean
    };
}

const initialValues: Omit<StoreType, "actions"> = {
    selectedInvoice: null,
    isEdittingInvoice: false,
    isEdittingBulk: false,
    isSelectingInvoice: false,
    rowsSelected: []
}


export const useUserDashboardStore = create<StoreType>((set, get) => ({
    ...initialValues,
    actions: {
        setSelectedInvoice: (invoice) => set({ selectedInvoice: invoice }),
        setIsEdittingInvoice: (b) => set({ isEdittingInvoice: b }),
        setIsEdittingBulk: (b) => set({ isEdittingBulk: b }),
        setIsSelectingInvoice: (b) => set({ isSelectingInvoice: b }),
        setRowsSelected: (b) => set({ rowsSelected: b }),
        addRow: (b) => set((state) => ({ rowsSelected: [...state.rowsSelected, b] })),
        addRows: (b) => set((state) => ({ rowsSelected: [...state.rowsSelected, ...b] })),
        removeRow: (b) => set((state) => ({ rowsSelected: state.rowsSelected.filter(d => d.id !== b.id) })),
        isRowSelected: (b) => get().rowsSelected.some((row) => row.id === b.id),
    }
}))