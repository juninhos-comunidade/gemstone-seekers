import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "@/lib/api/client";

const protectedRoutes = ["/role", "/candidate", "/recruiter"];

type RefreshResponse = {
  success: boolean;
  result?: {
    accessToken?: string;
    refreshToken?: string;
    registrationCompleted?: boolean;
  };
};

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("auth_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const userRole = req.cookies.get("user_role")?.value?.toUpperCase();

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  if (token) {
    if (pathname.startsWith("/candidate") && userRole === "RECRUITER") {
      return NextResponse.redirect(new URL("/recruiter/dashboard", req.url));
    }
    if (pathname.startsWith("/recruiter") && userRole === "CANDIDATE") {
      return NextResponse.redirect(new URL("/candidate/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!token && refreshToken) {
    try {
      const res = await httpClient.post<RefreshResponse>("auth/refresh", {
        data: { refreshToken },
      });

      const newAccessToken = res.result?.accessToken;

      if (!newAccessToken) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      const destination =
        pathname.startsWith("/candidate") && userRole === "RECRUITER"
          ? "/recruiter/dashboard"
          : pathname.startsWith("/recruiter") && userRole === "CANDIDATE"
            ? "/candidate/dashboard"
            : null;

      const response = destination
        ? NextResponse.redirect(new URL(destination, req.url))
        : NextResponse.next();

      response.cookies.set("auth_token", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      });
      return response;
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/role", "/role/:path*", "/candidate/:path*", "/recruiter/:path*"],
};
