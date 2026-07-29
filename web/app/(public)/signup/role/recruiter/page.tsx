"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRouter } from "next/navigation";
export default function Page() {
  const route = useRouter();

  const handleNext = () => {
    route.push("/recruiter/dashboard");
  };

  return (
    <main className="bg-muted/30 flex min-h-screen items-center justify-center">
      <div className="bg-background w-full max-w-md rounded-xl border p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-bold">
          Informações do Recrutador
        </h1>
        <p className="text-muted-foreground mb-6 text-center text-sm">
          Complete seu perfil para finalizar o cadastro
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nome da empresa</Label>
            <Input
              id="company-name"
              type="text"
              placeholder="Nome da empresa"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-title">Cargo</Label>
            <Input
              id="job-title"
              type="text"
              placeholder="Ex: Analista de RH"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" type="tel" placeholder="(00) 00000-0000" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-website">Site da empresa</Label>
            <Input
              id="company-website"
              type="url"
              placeholder="https://suaempresa.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-size">Tamanho da empresa</Label>
            <Input
              id="company-size"
              type="text"
              placeholder="Ex: 1-10, 11-50, 51-200..."
            />
          </div>

          <Button className="w-full" onClick={handleNext}>
            Concluir cadastro
          </Button>
        </div>

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Prefere fazer isso depois?{" "}
          <Link href="/dashboard" className="text-primary hover:underline">
            Pular por enquanto
          </Link>
        </p>
      </div>
    </main>
  );
}
