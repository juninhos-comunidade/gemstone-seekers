// // proxy.ts (na raiz do projeto)
// import { NextRequest, NextResponse } from "next/server";

// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // valores fixos só pra teste
//   const isLoggedIn = true;
//   const userRole = "candidate"; // ou "recruiter"

//   // se não estiver "logado", manda pro login
//   if (!isLoggedIn) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // se for candidato tentando entrar na área de recrutador
//   if (userRole === "candidate" && pathname.startsWith("/recruiter")) {
//     return NextResponse.redirect(new URL("/candidate/dashboard", request.url));
//   }

//   // se for recrutador tentando entrar na área de candidato
//   if (userRole === "recruiter" && pathname.startsWith("/candidate")) {
//     return NextResponse.redirect(new URL("/recruiter/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/candidate/:path*", "/recruiter/:path*"],
// };

// proxy.ts
import { NextResponse } from "next/server";

export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
