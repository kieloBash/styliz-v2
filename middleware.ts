import { auth } from "./auth";


export default auth(async (req: any) => {
    // const { nextUrl } = req;
    // const isLoggedIn = !!req.auth;

    // const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    // const isPublicRoute = publicRoutes.some((route) => {
    //     return route === "/"
    //         ? nextUrl.pathname === route
    //         : nextUrl.pathname.startsWith(route);
    // });
    // const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    // if (isApiAuthRoute || isPublicRoute) return;

    // if (isAuthRoute) {
    //     if (isLoggedIn) {
    //         return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    //     }
    //     return;
    // }

    // if (!isLoggedIn && !isPublicRoute) {
    //     // let callbackUrl = nextUrl.pathname;
    //     // if (nextUrl.search) {
    //     //     callbackUrl += nextUrl.search;
    //     // }
    //     // const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    //     const url = new URL("/auth/sign-in", req.url);
    //     // url.searchParams.set("reason", "SignedOut");
    //     // url.searchParams.set("callbackUrl", encodedCallbackUrl);

    //     return NextResponse.redirect(url);
    // }

    return;
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"], //for targeting all urls
};
