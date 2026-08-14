import Link from "next/link";
import { Briefcase, PlusCircle, Sparkles, ArrowRight } from "lucide-react";

export default function RecruiterDashboardPage() {
  const quickActions = [
    {
      title: "Todas as Vagas",
      description:
        "Visualize, filtre e gerencie todas as vagas cadastradas na plataforma.",
      href: "/recruiter/dashboard/jobs",
      icon: Briefcase,
      badge: "Gerenciamento",
    },
    {
      title: "Publicar Nova Vaga",
      description:
        "Crie e divulgue uma nova oportunidade para atrair os melhores talentos.",
      href: "/recruiter/dashboard/jobs/new",
      icon: PlusCircle,
      badge: "Recrutamento",
    },
  ];

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      {/* Welcome Hero */}
      <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-6 shadow-sm md:p-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
            <Sparkles className="size-3.5" />
            <span>Painel do Recrutador</span>
          </div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
            Bem-vindo ao Gemstone Seekers
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            Gerencie seus processos seletivos e encontre profissionais
            qualificados com facilidade. Navegue pelas opções no menu lateral ou
            utilize os atalhos rápidos abaixo.
          </p>
        </div>
      </div>

      {/* Quick Actions Header */}
      <div>
        <h2 className="text-foreground text-lg font-semibold tracking-tight">
          Atalhos Rápidos
        </h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Acesse rapidamente os recursos essenciais de recrutamento
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group bg-card border-border hover:border-primary/50 relative flex flex-col justify-between rounded-xl border p-5 transition-all duration-200 hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-10 items-center justify-center rounded-lg transition-colors">
                    <Icon className="size-5" />
                  </div>
                  <span className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
                    {action.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-foreground group-hover:text-primary text-base font-semibold transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>

              <div className="text-primary mt-4 flex items-center gap-1 text-xs font-medium">
                <span>Acessar</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
