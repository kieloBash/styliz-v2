import { ColumnDef } from "@tanstack/react-table";
import { UserRole } from "./roles";

export interface IClientProps {
    role: UserRole;
}

export type MetaType = {
    total: number;
    page: number;
    pageCount: number;
}

export type QueryPayloadType<T> = {
    success: boolean;
    message: string;
    payload?: T;
    meta?: MetaType
}

export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}
