"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRouter } from "next/navigation";
export default function Page() {
  const route = useRouter();

  const handleNext = () => {
    route.push("/candidate/dashboard");
  };

  return (
    <main className="bg-muted/30 flex min-h-screen items-center justify-center">
      <div className="bg-background w-full max-w-md rounded-xl border p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-bold">
          Informações do Candidato
        </h1>
        <p className="text-muted-foreground mb-6 text-center text-sm">
          Complete seu perfil para finalizar o cadastro
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" type="tel" placeholder="(00) 00000-0000" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Área de interesse</Label>
            <Input
              id="area"
              type="text"
              placeholder="Ex: Tecnologia, Marketing, Vendas..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Cargo desejado</Label>
            <Input
              id="role"
              type="text"
              placeholder="Ex: Desenvolvedor Front-end"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Nível de experiência</Label>
            <Input
              id="experience"
              type="text"
              placeholder="Ex: Estágio, Júnior, Pleno, Sênior"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input id="location" type="text" placeholder="Cidade, Estado" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">Currículo (link)</Label>
            <Input
              id="resume"
              type="url"
              placeholder="Link do LinkedIn ou currículo"
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
