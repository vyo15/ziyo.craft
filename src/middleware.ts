import { NextResponse, NextRequest, NextFetchEvent } from "next/server";
import { getToken } from "next-auth/jwt";
import withAuth from "./middlewares/withAuth";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const pathname = req.nextUrl.pathname;

  // Middleware untuk rute /admin dan /member
  if (pathname.startsWith("/admin") || pathname.startsWith("/member")) {
    return withAuth(
      async (req: NextRequest, event: NextFetchEvent) => {
        ("Middleware dijalankan untuk rute /admin atau /member"); // Debug log
        return NextResponse.next();
      },
      ["admin", "member"]
    )(req, event);
  }

  // Middleware untuk rute /auth/login dan /auth/register
  if (pathname === "/auth/login" || pathname === "/auth/register") {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/member/:path*", "/auth/login", "/auth/register"], // Mencocokkan semua rute di bawah /admin, /member, halaman login, dan register
};
