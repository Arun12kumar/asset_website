import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  const refreshToken = request.cookies.get("refreshToken")?.value;
  console.log(`Middleware Debug: Path: ${pathname}, Token: ${refreshToken ? "Present" : "Missing"}`);

    // ✅ Routes that require authentication
  const privateAdminRoutes = [
    "/admin/user",
    "/admin/subcategory",
    "/admin/category",
    "/admin/contact",
    "/admin/asset",
    // add more private routes here
  ];

  // ✅ If user already logged in, prevent them from visiting /login
  if (pathname.startsWith("/admin/login") && (refreshToken)) {
    return NextResponse.redirect(new URL("/admin/user", request.url));
  }

  // Protect only private admin routes
  if (privateAdminRoutes.some((route) => pathname.startsWith(route))) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/login",
    "/admin/user/:path*",
    "/admin/category/:path*",
    "/admin/subcategory/:path*",
    "/admin/contact/:path*",
    "/admin/asset/:path*",
  ],
};