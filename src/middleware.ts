import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyWithJose } from "./helpers/jwt";
export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const authorization = cookieStore.get("authorization");

  // Redirect untuk halaman dashboard

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    request.nextUrl.pathname?.startsWith("/dashboard") ||
    request.nextUrl.pathname?.startsWith("/dashboard/tickets") ||
    request.nextUrl.pathname?.startsWith("/dashboard/users") ||
    request.nextUrl.pathname?.startsWith("/dashboard/customers") ||
    request.nextUrl.pathname?.startsWith("/dashboard/services") ||
    request.nextUrl.pathname?.startsWith("/dashboard/news")
  ) {
    if (!authorization) {
      return NextResponse.redirect(new URL("/login", request.url)); // Kalau belum login, arahkan ke halaman login
    }
  }

  // Redirect jika sudah login, dan user mencoba mengakses halaman utama
  if (request.nextUrl.pathname === "/login") {
    if (authorization) {
      return NextResponse.redirect(new URL("/dashboard", request.url)); // Kalau sudah login, arahkan ke dashboard
    }
  }

  // Route untuk API Users, Customers, dan Tickets
  if (
    request.nextUrl.pathname?.startsWith("/api/users") ||
    request.nextUrl.pathname?.startsWith("/api/customers") ||
    request.nextUrl.pathname?.startsWith("/api/tickets") ||
    request.nextUrl.pathname?.startsWith("/api/profile") ||
    (request.nextUrl.pathname?.startsWith("/api/news") &&
      ["POST", "PUT", "PATCH", "DELETE"].includes(request.method))
  ) {
    if (!authorization) {
      return Response.json({ message: "Please login first!" }, { status: 401 });
    }

    const [type, token] = authorization.value.split(" ");
    if (type !== "Bearer") {
      return Response.json({ message: "Invalid token!" }, { status: 401 });
    }

    const decoded = await verifyWithJose<{
      _id: string;
      email: string;
      role: string;
      username: string;
    }>(token);

    if (!decoded) {
      return Response.json({ message: "Invalid token!" }, { status: 401 });
    }

    // Menambahkan header user di request
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", decoded._id);
    requestHeaders.set("x-user-email", decoded.email);

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    return response;
  }
}
export const config = {
  matcher: [
    "/api/tickets/:id*",
    "/api/customers/(.)*",
    "/api/users/(.)*",
    "/api/tickets/(.)*",
    "/api/profile/(.)*",
    "/api/news/(.)*",
    "/login",
    "/dashboard",
    "/dashboard/tickets",
    "/",
  ],
};
