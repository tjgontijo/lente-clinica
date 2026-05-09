import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

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
    return NextResponse.redirect(new URL("/cases", request.url));
  }

  return;
}

export const config = {
  matcher: ["/", "/cases", "/cases/:path*", "/medications", "/medications/:path*", "/sign-in"],
};
