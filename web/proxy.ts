import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "@/lib/api/client";

const protectedRoutes = ["/candidate/dashboard", "/recruiter/dashboard"];

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

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Token válido presente -> segue
  if (token) {
    return NextResponse.next();
  }

  // Token ausente, mas tem refresh -> tenta renovar
  if (!token && refreshToken) {
    try {
      const res = await httpClient.post<RefreshResponse>("auth/refresh", {
        data: { refreshToken },
      });

      const newAccessToken = res.result?.accessToken;

      if (!newAccessToken) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      const response = NextResponse.next();
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

  // Sem token e sem refresh -> login
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/candidate/:path*", "/recruiter/:path*"],
};
