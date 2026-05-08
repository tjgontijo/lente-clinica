import type { NextRequest } from "next/server";

export default function proxy(_request: NextRequest) {
  // Autenticação desabilitada temporariamente
  return;
}

export const config = {
  matcher: ["/app/:path*", "/login"],
};
