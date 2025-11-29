import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// ✅ PERBAIKAN 2: GANTI SEMUA ISI middleware.ts dengan ini
export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = token?.role;

  console.log("🔍 Middleware:", { pathname, role, hasToken: !!token });

  // Redirect user yang sudah login dari Login/Register
  if (pathname === "/auth/Login" || pathname === "/auth/Register") {
    if (token && role) {
      const redirectUrl = role === "admin" ? "/admin" : "/user";
      console.log("✅ Redirecting logged-in user to:", redirectUrl);
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
    return NextResponse.next();
  }

  // Protected routes - harus login
  if (!token) {
    console.log("❌ No token, redirecting to login");
    return NextResponse.redirect(
      new URL(`/auth/Login?callbackUrl=${pathname}`, req.url)
    );
  }

  // Admin routes
  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      console.log("❌ Not admin, redirecting");
      return NextResponse.redirect(new URL("/auth/Login", req.url));
    }
  }

  // User routes
  if (pathname.startsWith("/user")) {
    if (role !== "user" && role !== "admin") {
      console.log("❌ Not user/admin, redirecting");
      return NextResponse.redirect(new URL("/auth/Login", req.url));
    }
  }

  console.log("✅ Access granted");
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/auth/Login", "/auth/Register"],
};