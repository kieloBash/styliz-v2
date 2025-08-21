import { prisma } from "@/prisma";

export const AUDIT_LEVELS = {
    INFO: "INFO",
    WARNING: "WARNING",
    CRITICAL: "CRITICAL",
} as const;

export const AUDIT_ACTIONS = {
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    PASSWORD_RESET: "PASSWORD_RESET",
    PASSWORD_RESET_REQUEST: "PASSWORD_RESET_REQUEST",
    DELETE_ACCOUNT: "DELETE_ACCOUNT",
    EMAIL_VERIFIED: "EMAIL_VERIFIED",
    REGISTER: "REGISTER",
    UPDATE_PROFILE: "UPDATE_PROFILE",
    UPDATE_SETTINGS: "UPDATE_SETTINGS",
} as const;

export type AuditLevel = keyof typeof AUDIT_LEVELS;
export type AuditAction = keyof typeof AUDIT_ACTIONS;

type BaseLog = {
    userId: string;
    metadata?: Record<string, any>;
    level?: (typeof AUDIT_LEVELS)[AuditLevel];
};

export async function createAuditLog({
    userId,
    action,
    metadata,
    level = AUDIT_LEVELS.INFO,
}: BaseLog & {
    action: (typeof AUDIT_ACTIONS)[AuditAction];
}) {
    await prisma.auditLog.create({
        data: {
            userId,
            action,
            metadata,
            level,
        },
    });
}

export const createLoginAuditLog = (params: BaseLog) =>
    createAuditLog({ ...params, action: AUDIT_ACTIONS.LOGIN });

export const createLogoutAuditLog = (params: BaseLog) =>
    createAuditLog({ ...params, action: AUDIT_ACTIONS.LOGOUT });

export const createPasswordResetAuditLog = (params: BaseLog) =>
    createAuditLog({ ...params, action: AUDIT_ACTIONS.PASSWORD_RESET });

export const createPasswordResetRequestAuditLog = (params: BaseLog) =>
    createAuditLog({ ...params, action: AUDIT_ACTIONS.PASSWORD_RESET_REQUEST });

export const createDeleteAccountAuditLog = (params: BaseLog) =>
    createAuditLog({ ...params, action: AUDIT_ACTIONS.DELETE_ACCOUNT, level: AUDIT_LEVELS.CRITICAL });

export const createEmailVerifiedAuditLog = (params: BaseLog) =>
    createAuditLog({ ...params, action: AUDIT_ACTIONS.EMAIL_VERIFIED });

export const createRegisterAuditLog = (params: BaseLog) =>
    createAuditLog({ ...params, action: AUDIT_ACTIONS.REGISTER });

export const createUpdateProfileAuditLog = (params: BaseLog) =>
    createAuditLog({ ...params, action: AUDIT_ACTIONS.UPDATE_PROFILE });

export const createUpdateSettingsAuditLog = (params: BaseLog) =>
    createAuditLog({ ...params, action: AUDIT_ACTIONS.UPDATE_SETTINGS });
