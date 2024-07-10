import { NextResponse, NextRequest, NextFetchEvent } from "next/server";
import { getToken } from "next-auth/jwt";
import withAuth from "./middlewares/withAuth";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const pathname = req.nextUrl.pathname;
  console.log(`Request to: ${pathname}`); // Debug log

  // Middleware for /admin routes
  if (pathname.startsWith("/admin")) {
    return withAuth(
      async (req: NextRequest, event: NextFetchEvent) => {
        console.log("Middleware executed for /admin routes"); // Debug log
        return NextResponse.next();
      },
      ["admin"]
    )(req, event);
  }

  // Middleware for /auth/login and /auth/register routes
  if (pathname === "/auth/login" || pathname === "/auth/register") {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log(`Token: ${token ? "Found" : "Not found"}`); // Debug log
    if (token) {
      console.log("User is already authenticated, redirecting to home"); // Debug log
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/login", "/auth/register"], // Mencocokkan semua rute di bawah /admin, halaman login, dan register
};
