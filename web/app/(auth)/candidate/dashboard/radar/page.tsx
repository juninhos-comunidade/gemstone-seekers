"use client";

import { useMemo } from "react";
import {
  Activity,
  Briefcase,
  CheckCircle,
  Cpu,
  TrendingUp,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useJobs, useTechnologyDemand } from "@/lib/api/radar";
import { RADAR_COLORS } from "@/components/dashboard/radar/chart-config";
import { EmptyState } from "@/components/dashboard/radar/EmptyState";
import { MetricCard } from "@/components/dashboard/radar/MetricCard";
import { TopTechnologiesChart } from "@/components/dashboard/radar/TopTechnologiesChart";
import { TechnologyRequirementRateChart } from "@/components/dashboard/radar/TechnologyRequirementChart";

export default function RadarPage() {
  const {
    data: jobsResponse,
    isLoading: isLoadingJobs,
    error: jobsError,
  } = useJobs();
  const {
    data: technologyDemandResponse,
    isLoading: isLoadingDemand,
    error: demandError,
  } = useTechnologyDemand();

  const jobs = useMemo(() => jobsResponse?.result ?? [], [jobsResponse]);
  const technologies = useMemo(
    () => technologyDemandResponse?.result ?? [],
    [technologyDemandResponse],
  );

  const isLoading = isLoadingJobs || isLoadingDemand;
  const hasError = Boolean(jobsError || demandError);

  const totalVagas = jobs.length;
  const tecnologiasMonitoradas = technologies.length;

  const mediaObrigatorias = useMemo(() => {
    if (!technologies.length) return 0;

    return Math.round(
      technologies.reduce((sum, item) => sum + item.mandatoryCount, 0) /
        technologies.length,
    );
  }, [technologies]);

  const topTecnologia = useMemo(() => {
    if (!technologies.length) return null;

    return technologies.reduce((max, item) =>
      item.jobCount > max.jobCount ? item : max,
    );
  }, [technologies]);

  const topTecnologias = useMemo(
    () =>
      [...technologies]
        .sort((a, b) => b.jobCount - a.jobCount)
        .slice(0, 6)
        .map((item, index) => ({
          tecnologia: item.technologyName,
          vagas: item.jobCount,
          fill: RADAR_COLORS[index % RADAR_COLORS.length],
        })),
    [technologies],
  );

  const requirementRate = useMemo(
    () =>
      [...technologies]
        .filter((item) => item.jobCount > 0)
        .map((item, index) => ({
          tecnologia: item.technologyName,
          percentual: (item.mandatoryCount / item.jobCount) * 100,
          fill: RADAR_COLORS[index % RADAR_COLORS.length],
        }))
        .sort((a, b) => b.percentual - a.percentual)
        .slice(0, 6),
    [technologies],
  );

  return (
    <div className="bg-background min-h-screen p-4 sm:p-5 md:p-6 lg:p-8">
      <div className="mb-8 md:mb-10">
        <div className="mb-2 flex items-start gap-3">
          <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-xl">
            <Activity size={20} />
          </div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Radar do Mercado
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
          Visualize tendências, tecnologias mais requisitadas e indicadores do
          mercado de trabalho.
        </p>
      </div>

      {isLoading ? (
        <div className="flex min-h-80 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      ) : hasError ? (
        <EmptyState message="Não foi possível carregar os dados do radar agora." />
      ) : !technologies.length ? (
        <EmptyState message="Ainda não existem dados suficientes no radar de mercado." />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={<Briefcase size={20} />}
              value={totalVagas.toLocaleString()}
              label="Total de vagas"
            />
            <MetricCard
              icon={<Cpu size={20} />}
              value={tecnologiasMonitoradas}
              label="Tecnologias monitoradas"
            />
            <MetricCard
              icon={<CheckCircle size={20} />}
              value={mediaObrigatorias}
              label="Média de obrigatórias"
            />
            <MetricCard
              icon={<TrendingUp size={20} />}
              value={topTecnologia?.technologyName ?? "-"}
              label="Tecnologia em destaque"
            />
          </div>

          <div className="grid gap-4 md:gap-6 xl:grid-cols-2">
            <TopTechnologiesChart data={topTecnologias} />
            <TechnologyRequirementRateChart data={requirementRate} />
          </div>
        </>
      )}
    </div>
  );
}
