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