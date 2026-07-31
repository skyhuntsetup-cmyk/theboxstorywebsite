import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidSessionToken } from "./lib/adminAuth";

// Next.js 16 renamed `middleware.ts` to `proxy.ts` (this app's own
// node_modules/next/dist/docs/.../version-16.md confirms it); the `proxy`
// runtime is always Node.js, so lib/adminAuth's use of the `crypto` module
// works here without an edge-runtime workaround.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  if (isLoginPage || isLoginApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (isValidSessionToken(token)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ success: false, error: "Not authenticated." }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
