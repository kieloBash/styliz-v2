import fs from "fs";
import path from "path";
import { createLogger, format, transports } from "winston";

const logFormat = format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

const logDir = path.join(process.cwd(), "logs");

// only ensure dir in non-production where filesystem is writable
if (process.env.NODE_ENV !== "production") {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
}

export const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
        logFormat
    ),
    transports: [
        new transports.Console(),
        ...(process.env.NODE_ENV !== "production"
            ? [
                new transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
                new transports.File({ filename: path.join(logDir, "combined.log") }),
            ]
            : []),
    ],
});
