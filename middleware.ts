import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "./routes";

export default async function middleware(req: any) {
    const { nextUrl } = req;

    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    const isLoggedIn = !!token;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

    const isPublicRoute = publicRoutes.some((route) => {
        return route === "/"
            ? nextUrl.pathname === route
            : nextUrl.pathname.startsWith(route);
    });

    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute || isPublicRoute) return;

    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return;
    }

    if (!isLoggedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) callbackUrl += nextUrl.search;

        const url = new URL("/auth/sign-in", req.url);
        url.searchParams.set("reason", "SignedOut");
        url.searchParams.set("callbackUrl", encodeURIComponent(callbackUrl));

        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
