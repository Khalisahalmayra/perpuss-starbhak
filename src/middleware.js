import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = token?.role;

  const authPath = ["/auth/Login", "/auth/Register"];

  console.log("🔍 Middleware:", { pathname, role, hasToken: !!token });

  // Belum login → redirect
  if (!token) return NextResponse.redirect(new URL(authPath[0], req.url));

  // User biasa tidak boleh ke /admin
  if (role !== "admin" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/user/home", req.url));
  }

  // Admin tidak boleh ke /user
  if (role === "admin" && pathname.startsWith("/user")) {
    return NextResponse.redirect(new URL("/admin/dasboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
