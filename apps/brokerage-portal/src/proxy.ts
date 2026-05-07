import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/api/webhooks/clerk(.*)",
])

const protectedProxy = clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect({
      unauthenticatedUrl: new URL("/sign-in", request.url).toString(),
    })
  }
})

function isLocalPreviewBypassRequest(request: NextRequest) {
  if (process.env.BROKERAGE_PORTAL_DEV_AUTH_BYPASS !== "1") return false
  if (
    process.env.NODE_ENV === "production" &&
    process.env.BROKERAGE_PORTAL_LOCAL_PREVIEW_AUTH !== "1"
  ) {
    return false
  }

  const hostname = request.nextUrl.hostname
  const isLocalhost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname.endsWith(".localhost")

  return isLocalhost
}

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (isLocalPreviewBypassRequest(request)) {
    return NextResponse.next()
  }

  return protectedProxy(request, event)
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
