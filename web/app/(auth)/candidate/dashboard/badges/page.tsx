"use client";

import Link from "next/link";
import { FaAward, FaCalendarAlt, FaCheckCircle, FaCode } from "react-icons/fa";
import { useCandidateBadgesQuery } from "@/lib/api/badges/badges";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export default function BadgesPage() {
  const { data: badges = [], isLoading } = useCandidateBadgesQuery();

  const formatDate = (dateString: string) => {
    try {
      const parsed = new Date(dateString);
      if (isNaN(parsed.getTime())) return dateString;
      return parsed.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="text-primary size-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
          Minhas Badges
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Acompanhe todas as conquistas e insígnias obtidas em seus testes de
          conhecimento.
        </p>
      </div>

      {badges.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center sm:p-12">
          <div className="bg-muted flex size-16 items-center justify-center rounded-full">
            <FaAward className="text-muted-foreground size-8" />
          </div>
          <CardTitle className="mt-4 text-xl font-semibold">
            Você não tem badges ainda, conclua os testes para ganhar
          </CardTitle>
          <CardDescription className="mt-2 max-w-md text-sm">
            Realize testes técnicos de conhecimento na plataforma e atinja a
            pontuação mínima necessária para conquistar suas primeiras
            insígnias.
          </CardDescription>
          <div className="mt-6">
            <Link
              href="/candidate/dashboard/tests"
              className={cn(buttonVariants({ variant: "default" }), "gap-2")}
            >
              <FaCode className="size-4" />
              <span>Ir para Testes</span>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badgeItem) => (
            <Card
              key={badgeItem.id}
              className="group hover:border-primary/50 relative flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105">
                    <FaAward className="size-5" />
                  </div>
                  {badgeItem.technologyName && (
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {badgeItem.technologyName}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-foreground mt-3 text-lg font-bold">
                  {badgeItem.name}
                </CardTitle>
                {badgeItem.description && (
                  <CardDescription className="line-clamp-3 text-xs leading-relaxed">
                    {badgeItem.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="pt-0">
                <div className="border-border/60 bg-muted/30 mt-2 space-y-2 rounded-lg border p-3 text-xs">
                  {badgeItem.testScore !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                        <FaCheckCircle className="size-3.5 text-emerald-500" />
                        Pontuação Obtida
                      </span>
                      <span className="text-foreground font-bold">
                        {badgeItem.testScore.toFixed(1)}%
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                      <FaCalendarAlt className="size-3.5" />
                      Conquistado em
                    </span>
                    <span className="text-foreground font-medium">
                      {formatDate(badgeItem.earnedAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
