import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyWithJose } from "./helpers/jwt";

export type Role = "CS FTTH" | "Helpdesk" | "NOC" | "Super NOC" | "Admin";

interface DecodedToken {
  _id: string;
  email: string;
  role: Role;
  username: string;
}

// Konfigurasi RBAC untuk API routes
const API_RBAC: {
  prefix: string;
  rules: { methods?: string[]; roles: Role[] }[];
}[] = [
  {
    prefix: "/api/users",
    rules: [{ roles: ["Admin", "CS FTTH"] }],
  },
  {
    prefix: "/api/sla",
    rules: [{ roles: ["Admin"] }],
  },
  {
    prefix: "/api/categories",
    rules: [
      {
        methods: ["GET"],
        roles: ["Admin", "CS FTTH", "Helpdesk", "NOC", "Super NOC"],
      },
      { methods: ["POST", "PUT", "PATCH", "DELETE"], roles: ["Admin"] },
    ],
  },
  {
    prefix: "/api/services",
    rules: [
      {
        methods: ["GET"],
        roles: ["Admin", "CS FTTH", "Helpdesk", "NOC", "Super NOC"],
      },
      { methods: ["POST", "PUT", "PATCH", "DELETE"], roles: ["Admin"] },
    ],
  },
  {
    prefix: "/api/exports-excel",
    rules: [{ roles: ["Admin"] }],
  },
  {
    prefix: "/api/customers",
    rules: [
      {
        methods: ["GET"],
        roles: ["Admin", "CS FTTH", "Helpdesk", "NOC", "Super NOC"],
      },
      {
        methods: ["POST", "PUT", "PATCH", "DELETE"],
        roles: ["Admin", "CS FTTH", "Helpdesk"],
      },
    ],
  },
  {
    prefix: "/api/tickets",
    rules: [
      {
        methods: ["GET"],
        roles: ["Admin", "CS FTTH", "Helpdesk", "NOC", "Super NOC"],
      },
      { methods: ["POST"], roles: ["Admin", "CS FTTH", "Helpdesk"] },
      {
        methods: ["PATCH", "PUT", "DELETE"],
        roles: ["Admin", "Helpdesk", "NOC", "Super NOC"],
      },
    ],
  },
  {
    prefix: "/api/news",
    rules: [
      {
        methods: ["GET"],
        roles: ["Admin", "CS FTTH", "Helpdesk", "NOC", "Super NOC"],
      },
      { methods: ["POST", "PUT", "PATCH", "DELETE"], roles: ["Admin"] },
    ],
  },
  {
    prefix: "/api/profile",
    rules: [{ roles: ["Admin", "CS FTTH", "Helpdesk", "NOC", "Super NOC"] }],
  },
];

// Konfigurasi RBAC untuk Dashboard routes
const DASHBOARD_RBAC: { prefix: string; roles: Role[] }[] = [
  { prefix: "/dashboard/users", roles: ["Admin"] },
  { prefix: "/dashboard/sla", roles: ["Admin"] },
  { prefix: "/dashboard/categories", roles: ["Admin"] },
  { prefix: "/dashboard/services", roles: ["Admin", "CS FTTH", "Helpdesk"] },
  { prefix: "/dashboard/reports", roles: ["Admin"] },
  {
    prefix: "/dashboard/customers",
    roles: ["Admin", "CS FTTH", "Helpdesk"],
  },
  {
    prefix: "/dashboard/tickets",
    roles: ["Admin", "CS FTTH", "Helpdesk", "NOC", "Super NOC"],
  },
  {
    prefix: "/dashboard/news",
    roles: ["Admin"],
  },
  {
    prefix: "/dashboard",
    roles: ["Admin", "CS FTTH", "Helpdesk", "NOC", "Super NOC"],
  },
];

// helper untuk decode token dan verify valid atau tidak
async function decodeToken(rawValue: string): Promise<DecodedToken | null> {
  const [type, token] = rawValue.split(" ");
  if (type !== "Bearer" || !token) return null;
  try {
    return await verifyWithJose<DecodedToken>(token);
  } catch {
    return null;
  }
}

// helper cek roles saat akses api
function findAllowedRolesForApi(
  pathname: string,
  method: string,
): Role[] | null {
  for (const route of API_RBAC) {
    if (!pathname.startsWith(route.prefix)) continue;
    for (const rule of route.rules) {
      if (!rule.methods || rule.methods.includes(method)) {
        return rule.roles;
      }
    }
    return [];
  }
  return null;
}

// helper cek roles saat akses dashboard
function findAllowedRolesForDashboard(pathname: string): Role[] | null {
  for (const route of DASHBOARD_RBAC) {
    if (pathname.startsWith(route.prefix)) return route.roles;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const authorization = cookieStore.get("authorization");
  const pathname = request.nextUrl.pathname;

  // Redirect root → login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Already logged-in users should not see the login page
  if (pathname === "/login") {
    if (authorization) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // ------------------------------------------------------------------
  // API routes
  // ------------------------------------------------------------------
  if (pathname.startsWith("/api/")) {
    const allowedRoles = findAllowedRolesForApi(pathname, request.method);

    if (allowedRoles === null) {
      // Public API — no auth required
      return NextResponse.next();
    }

    if (!authorization) {
      return Response.json({ message: "Please login first!" }, { status: 401 });
    }

    const decoded = await decodeToken(authorization.value);
    if (!decoded) {
      return Response.json({ message: "Invalid token!" }, { status: 401 });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      return Response.json(
        { message: "You don't have permission to access this resource!" },
        { status: 403 },
      );
    }

    // Forward user context in request headers for use in route handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", decoded._id);
    requestHeaders.set("x-user-email", decoded.email);
    requestHeaders.set("x-user-role", decoded.role);
    requestHeaders.set("x-user-username", decoded.username);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // ------------------------------------------------------------------
  // Dashboard pages
  // ------------------------------------------------------------------
  if (pathname.startsWith("/dashboard")) {
    if (!authorization) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const decoded = await decodeToken(authorization.value);
    if (!decoded) {
      // Token invalid / expired — force re-login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("authorization");
      return response;
    }

    const allowedRoles = findAllowedRolesForDashboard(pathname);
    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      // Redirect to main dashboard instead of a hard 403
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/api/tickets/:path*",
    "/api/customers/:path*",
    "/api/users/:path*",
    "/api/profile/:path*",
    "/api/news/:path*",
    "/api/sla/:path*",
    "/api/categories/:path*",
    "/api/services/:path*",
    "/api/exports-excel",
  ],
};
