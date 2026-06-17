/**
 * Clerk middleware — required for Clerk auth helpers (currentUser/auth) to work.
 * Conditional: if Clerk isn't configured, pass requests through untouched so the
 * app still runs (inert-without-keys).
 */
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY;

export default clerkEnabled ? clerkMiddleware() : (_req: NextRequest) => NextResponse.next();

export const config = {
  matcher: [
    // Skip Next internals and static files; run on everything else + API routes.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ico|webp|woff2?|ttf|map)).*)",
    "/(api|trpc)(.*)",
  ],
};
