import { getToken } from "next-auth/jwt";
import {
  NextRequest,
  NextResponse,
  NextMiddleware,
  NextFetchEvent,
} from "next/server";

const onlyAdmin = ["admin"];
const authPage = ["auth"];

export default function withAuth(
  middleware: NextMiddleware,
  requireAuth: string[] = []
) {
  return async (req: NextRequest, event: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname.split("/")[1];
    console.log(`Current pathname: ${pathname}`); // Debug log
    console.log(`Require Auth Paths: ${requireAuth}`); // Debug log

    if (requireAuth.includes(pathname)) {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });

      console.log(`Token: ${token ? "Found" : "Not found"}`); // Debug log
      console.log(`Token details: ${JSON.stringify(token)}`); // Debug log

      if (!token) {
        console.log("No token found, redirecting to login"); // Debug log
        const url = new URL("/auth/login", req.url);
        url.searchParams.set("callbackUrl", encodeURI(req.url));
        return NextResponse.redirect(url);
      }

      if (token) {
        if (authPage.includes(pathname)) {
          console.log(
            "Redirecting to home because user is already authenticated"
          ); // Debug log
          return NextResponse.redirect(new URL("/", req.url));
        }

        if (token.role !== "admin" && onlyAdmin.includes(pathname)) {
          console.log("Redirecting to home because user is not admin"); // Debug log
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    }

    console.log("Proceeding with middleware"); // Debug log
    return middleware(req, event);
  };
}
