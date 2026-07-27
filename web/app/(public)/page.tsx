import Header from "@/components/Header/Header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
        <span className="mb-4 rounded-full border px-4 py-1 text-sm text-muted-foreground">
          Plataforma de recrutamento para tecnologia
        </span>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight">
          Encontre a <span className="text-primary">vaga ideal</span> ou o
          <span className="text-primary"> candidato perfeito</span>.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          O Gemstone Seekers conecta recrutadores e profissionais de tecnologia
          através de avaliações inteligentes, perfil técnico e matching por
          habilidades.
        </p>

        <div className="mt-10 flex gap-4">
          <Button size="lg">Começar Agora</Button>
          <Button size="lg" variant="outline">
            Saiba Mais
          </Button>
        </div>
      </section>
    </main>
  );
}
