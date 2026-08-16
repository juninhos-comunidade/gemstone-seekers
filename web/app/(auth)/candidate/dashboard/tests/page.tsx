"use client";

import { SelectFilter } from "@/components/SelectFilter/SelectFilter";
import { TestCard } from "@/components/tests/TestCard/TestCard";
import { useState, useMemo } from "react";
import { SkeletonCard } from "@/components/SkeletonCard/SkeletonCard";
import { useTechnologiesQuery } from "@/lib/api/technologies/getTechnologies";

export default function Page() {
  const [selectedTechnology, setSelectedTechnology] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const { data: technologies, isLoading: loadingTech } = useTechnologiesQuery();

  const filteredTechnologies = useMemo(() => {
    if (!technologies) return [];
    if (!selectedTechnology) return technologies;
    return technologies.filter((tech) => tech.name === selectedTechnology);
  }, [technologies, selectedTechnology]);

  function handleFilterTech(value: string) {
    setSelectedTechnology(value);
  }

  function handleFilterLevel(value: string) {
    setSelectedLevel(value);
  }

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "Iniciante";
      case "INTERMEDIATE":
        return "Intermediário";
      case "ADVANCED":
        return "Avançado";
      default:
        return level;
    }
  };

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
              ...(technologies?.map((tech) => ({
                value: tech.name,
                label: tech.name,
              })) || []),
            ]}
            value={selectedTechnology}
            onValueChange={handleFilterTech}
            placeholder="Filtrar por tecnologia"
            disabled={loadingTech}
          />
          {/*filtro por nivel*/}
          <SelectFilter
            items={[
              { value: "", label: "Todos os níveis" },
              { value: "BEGINNER", label: "Iniciante" },
              { value: "INTERMEDIATE", label: "Intermediário" },
              { value: "ADVANCED", label: "Avançado" },
            ]}
            value={selectedLevel}
            onValueChange={handleFilterLevel}
            placeholder="Filtrar por nível"
          />
        </div>
      </div>

      {!loadingTech && filteredTechnologies.length === 0 && (
        <p className="text-muted-foreground text-sm">
          Nenhuma tecnologia encontrada.
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {loadingTech
          ? Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : filteredTechnologies.map((technology) => (
              <TestCard
                key={technology.id}
                id={technology.name}
                Tech={technology.name}
                Titulo={`${technology.name} Assessment`}
                Descricao={`Teste seus conhecimentos em ${technology.name}`}
                NumQuestoes={10}
                Nivel={
                  selectedLevel
                    ? getDifficultyLabel(selectedLevel)
                    : "Iniciante"
                }
                difficulty={selectedLevel || "BEGINNER"}
              />
            ))}
      </div>
    </section>
  );
}
