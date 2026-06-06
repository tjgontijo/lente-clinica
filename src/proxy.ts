import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthPage = request.nextUrl.pathname.startsWith("/sign-in");
  const isApiAuth = request.nextUrl.pathname.startsWith("/api/auth");
  const isPublicPage = request.nextUrl.pathname === "/";

  if (!session && !isAuthPage && !isApiAuth && !isPublicPage) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (session && (isAuthPage || isPublicPage)) {
    return NextResponse.redirect(new URL("/medications", request.url));
  }

  return;
}

export const config = {
  matcher: [
    "/",

    "/medications",
    "/medications/:path*",
    "/sign-in",
  ],
};
