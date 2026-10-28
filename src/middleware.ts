import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "fallback-secret-for-jwt-change-in-production-min32";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = "auth_session_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isStudentRoute = pathname.startsWith("/student");
  const isCompanyRoute = pathname.startsWith("/company");
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isStudentRoute && !isCompanyRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    if (isStudentRoute) {
      return NextResponse.redirect(new URL("/student-login", request.url));
    }
    if (isCompanyRoute) {
      return NextResponse.redirect(new URL("/company-login", request.url));
    }
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const role = payload.role as string;

    // Strict role separation
    if (isStudentRoute && role !== "student") {
      if (role === "company") return NextResponse.redirect(new URL("/company/dashboard", request.url));
      if (role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      return NextResponse.redirect(new URL("/student-login", request.url));
    }

    if (isCompanyRoute && role !== "company") {
      if (role === "student") return NextResponse.redirect(new URL("/student/dashboard", request.url));
      if (role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      return NextResponse.redirect(new URL("/company-login", request.url));
    }

    if (isAdminRoute && role !== "admin") {
      if (role === "student") return NextResponse.redirect(new URL("/student/dashboard", request.url));
      if (role === "company") return NextResponse.redirect(new URL("/company/dashboard", request.url));
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    // Invalid or expired token
    const redirectUrl = isStudentRoute
      ? "/student-login"
      : isCompanyRoute
      ? "/company-login"
      : "/admin-login";

    const response = NextResponse.redirect(new URL(redirectUrl, request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: [
    "/student/:path*",
    "/company/:path*",
    "/admin/:path*",
  ],
};
