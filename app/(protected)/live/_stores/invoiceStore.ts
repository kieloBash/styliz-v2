import { Item, Platform, User } from '@prisma/client'
import { create } from 'zustand'

type NewItemType = Omit<Item, "id" | "invoiceId"> & { isFreebie: boolean };
type SelectedSellerType = Pick<User, "id" | "email" | "name">;
type SelectedCustomerType = Pick<User, "id" | "name">;
type SelectedPlatformType = Pick<Platform, "id" | "name">;

type InvoiceStore = {
    selectedPlatform: SelectedPlatformType | null,
    selectedSeller: SelectedSellerType | null,
    selectedCustomer: SelectedCustomerType | null,
    items: (Omit<Item, "invoiceId"> & { isFreebie: boolean })[],
    openCustom: boolean,
    selectedCategory: string | null,
    taxRate: number,
    selectedDate: Date | undefined,

    actions: {
        setSelectedPlatform: (u: SelectedPlatformType | null) => void;
        setSelectedSeller: (u: SelectedSellerType | null) => void;
        setSelectedCustomer: (u: SelectedCustomerType | null) => void;
        addItem: (newItem: NewItemType) => void;
        removeItem: (removedItem: Pick<Item, "id">) => void;
        setOpenCustomModal: (e: boolean) => void;
        setSelectedCategory: (e: string | null) => void;
        clearItems: () => void;
        setSelectedDate: (e: Date | undefined) => void;
        reset: () => void
    }
}

const initialValues: Omit<InvoiceStore, "actions"> = {
    selectedPlatform: null,
    selectedSeller: null,
    selectedCustomer: null,
    items: [],
    openCustom: false,
    selectedCategory: null,
    taxRate: 0.08,
    selectedDate: new Date(),
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
    ...initialValues,
    actions: {
        setSelectedPlatform: (u) => set({ selectedPlatform: u }),
        setSelectedSeller: (u) => set({ selectedSeller: u }),
        setSelectedCustomer: (u) => set({ selectedCustomer: u }),
        addItem: (newItem) => set((state) => ({ items: [...state.items, { ...newItem, id: Math.random().toString() }] })),
        removeItem: (removedItem) => set((state) => ({ items: state.items.filter((d) => d.id !== removedItem.id) })),
        setOpenCustomModal: (u) => set({ openCustom: u }),
        setSelectedCategory: (u) => set({ selectedCategory: u }),
        clearItems: () => set({ items: [] }),
        setSelectedDate: (u) => set({ selectedDate: u }),
        reset: () => set({
            ...initialValues
        })
    }
}))