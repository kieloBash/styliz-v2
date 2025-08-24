import { logger } from "./logger";

export function logError(error: any, message: string) {
    logger.error(`Error: ${message}`, { error });

    return {
        success: false,
        message,
    };
}