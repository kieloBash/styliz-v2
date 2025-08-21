//FOR ROUTINGS

/**
 * An array of routes that is accessible even when user is logged out
 * Do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/auth/verify-email",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/api/trpc/auth.verify",
  "/api/trpc/auth.resend",
  "/api/trpc/auth.forgotPassword",
  "/api/trpc/auth.resetPassword",
];

/**
 * An array of routes that is NOT accessible if user is logged out.
 * REQUIRES authentication
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/sign-up",
  "/auth/sign-in",
  "/auth/error",
  "/auth/reset-password",
  "/api/auth/register",
];

/**
 * Prefix for API authentication routes
 * Routes that start with this prefix are used for api authentication
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth"; //always allowed for middleware

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
