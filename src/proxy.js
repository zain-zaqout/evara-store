import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("firebase_token")?.value;
  const { pathname } = request.nextUrl;

  const publicPaths = ["/signin", "/verify-email", "/forgot-password"];
  const isPublicPath = publicPaths.includes(pathname);

  const protectedPaths = ["/checkout", "/profile"];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.json).*)"],
};
