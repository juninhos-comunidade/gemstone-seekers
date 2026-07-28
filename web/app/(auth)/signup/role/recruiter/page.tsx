import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  return (
    <main className="bg-muted/30 flex min-h-screen items-center justify-center">
      <div className="bg-background w-full max-w-md rounded-xl border p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Criar Conta Recrutador
        </h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full-name">Nome completo</Label>
            <Input id="full-name" type="text" placeholder="Nome completo" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="E-mail" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="Senha" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar senha</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirmar senha"
            />
          </div>

          <Button className="w-full">Cadastrar</Button>
        </div>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Já possui uma conta?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
