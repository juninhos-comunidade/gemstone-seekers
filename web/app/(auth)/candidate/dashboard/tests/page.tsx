"use client";

import { SelectFilter } from "@/components/SelectFilter/SelectFilter";
import { TestCard } from "@/components/tests/TestCard/TestCard";
import { questionarios } from "@/lib/mocks/testsMock";
import { technologies } from "@/lib/mocks/technologies";
import { useState, useMemo } from "react";
import { SkeletonCard } from "@/components/SkeletonCard/SkeletonCard";

export default function Page() {
  const [selectedTechnology, setSelectedTechnology] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [loading] = useState(false);

  const questionariosFiltrados = useMemo(() => {
    return questionarios.filter((q) => {
      const matchTech = !selectedTechnology || q.Tech === selectedTechnology;
      const matchLevel = !selectedLevel || q.Nivel === selectedLevel;
      return matchTech && matchLevel;
    });
  }, [selectedTechnology, selectedLevel]);

  function handleFilterTech(value: string) {
    setSelectedTechnology(value);
  }
  function handleFilterLevel(value: string) {
    setSelectedLevel(value);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Testes
          </h1>
          <p className="text-muted-foreground text-sm">
            Explore os questionários disponíveis por tecnologia.
          </p>
        </div>
        <div className="flex w-full gap-5 sm:w-64">
          {/*filtro por tecnologia*/}
          <SelectFilter
            items={[
              { value: "", label: "Todas as tecnologias" },
              ...technologies.map((tech) => ({
                value: tech,
                label: tech,
              })),
            ]}
            value={selectedTechnology}
            onValueChange={handleFilterTech}
            placeholder="Filtrar por tecnologia"
          />
          {/*filtro por nivel*/}
          <SelectFilter
            items={[
              { value: "", label: "Todos os níveis" },
              { value: "iniciante", label: "Iniciante" },
              { value: "intermediario", label: "Intermediário" },
              { value: "avancado", label: "Avançado" },
            ]}
            value={selectedLevel}
            onValueChange={handleFilterLevel}
            placeholder="Filtrar por nível"
          />
        </div>
      </div>
      {!loading && questionariosFiltrados.length === 0 && (
        <p className="text-muted-foreground text-sm">
          Nenhum questionário encontrado.
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : questionariosFiltrados.map((questionario) => (
              <TestCard key={questionario.Titulo} {...questionario} />
            ))}
      </div>
    </section>
  );
}
