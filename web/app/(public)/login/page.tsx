"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function getDashboardRoute(tipo: "candidate" | "recruiter") {
  if (tipo === "candidate") {
    return "/candidate/dashboard";
  }

  return "/recruiter/dashboard";
}

export default function Page() {
  const router = useRouter();

  const handleLogin = () => {
    const tipo: "candidate" | "recruiter" = "candidate";

    router.push(getDashboardRoute(tipo));
  };

  return (
    <main className="bg-muted/30 flex min-h-screen items-center justify-center">
      <div className="bg-background w-full max-w-sm rounded-xl border p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">Entrar</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="E-mail" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="Senha" />
          </div>

          <Button className="w-full" onClick={handleLogin}>
            Entrar
          </Button>
        </div>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Não possui uma conta?{" "}
          <Link href="/signup/role" className="text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
