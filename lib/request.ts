export function getIpFromRequest(req: any): string {
    return (
        req.headers?.["x-forwarded-for"]?.toString().split(",")[0] ??
        req.headers?.["x-real-ip"]?.toString() ??
        "anonymous"
    );
}
