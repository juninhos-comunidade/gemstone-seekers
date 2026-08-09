"use client";

import React, { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { JobFormData } from "@/lib/schemas/forms/jobFormSchema";
import { useTechnologiesQuery } from "@/lib/api/technologies/getTechnologies";
import { TechnologyItem } from "@/lib/types/technology";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Code2, Search, Plus, CheckCircle2, Trash2 } from "lucide-react";

export function JobTechnologiesSection() {
  const { setValue, control } = useFormContext<JobFormData>();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: catalog = [] } = useTechnologiesQuery();
  const selectedTechnologies =
    useWatch({ control, name: "technologies" }) || [];

  const isSelected = (techId: number) =>
    selectedTechnologies.some((t) => t.technologyId === techId);

  const handleSelectTech = (tech: TechnologyItem) => {
    if (isSelected(tech.id)) return;
    const updated = [
      ...selectedTechnologies,
      {
        technologyId: tech.id,
        technologyName: tech.name,
        category: tech.category,
        isMandatory: true,
      },
    ];
    setValue("technologies", updated);
  };

  const handleRemoveTech = (techId: number) => {
    const updated = selectedTechnologies.filter(
      (t) => t.technologyId !== techId,
    );
    setValue("technologies", updated);
  };

  const handleToggleMandatory = (techId: number) => {
    const updated = selectedTechnologies.map((t) => {
      if (t.technologyId === techId) {
        return { ...t, isMandatory: !t.isMandatory };
      }
      return t;
    });
    setValue("technologies", updated);
  };

  const filteredCatalog = catalog.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Code2 className="text-primary size-4" />
          Tecnologias & Requisitos do Candidato
        </CardTitle>
        <CardDescription>
          Selecione as tecnologias exigidas para a vaga e classifique cada uma
          como &quot;Obrigatória&quot; ou &quot;Diferencial&quot;.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Tecnologias Selecionadas ({selectedTechnologies.length})
          </span>

          {selectedTechnologies.length === 0 ? (
            <p className="text-muted-foreground/70 rounded-lg border border-dashed p-4 py-2 text-center text-xs italic">
              Nenhuma tecnologia selecionada ainda. Busque e adicione no
              catálogo abaixo.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {selectedTechnologies.map((tech) => (
                <div
                  key={tech.technologyId}
                  className="border-border/50 bg-card flex items-center justify-between rounded-lg border p-3 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-medium">
                      {tech.technologyName}
                    </span>
                    {tech.category && (
                      <Badge variant="outline" className="text-[10px]">
                        {tech.category}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={tech.isMandatory ? "default" : "secondary"}
                      size="sm"
                      className="h-7 px-2.5 text-xs"
                      onClick={() => handleToggleMandatory(tech.technologyId)}
                    >
                      {tech.isMandatory ? "Obrigatória" : "Diferencial"}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive size-7"
                      onClick={() => handleRemoveTech(tech.technologyId)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-border/40 space-y-3 border-t pt-4">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Catálogo de Tecnologias Disponíveis
            </span>

            <div className="relative w-full sm:w-64">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-3.5 -translate-y-1/2" />
              <Input
                placeholder="Buscar tecnologia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>

          <div className="bg-muted/20 flex max-h-48 flex-wrap gap-2 overflow-y-auto rounded-xl border p-2">
            {filteredCatalog.length === 0 ? (
              <p className="text-muted-foreground/70 p-2 text-xs italic">
                Nenhuma tecnologia encontrada no catálogo.
              </p>
            ) : (
              filteredCatalog.map((item) => {
                const active = isSelected(item.id);
                return (
                  <Badge
                    key={item.id}
                    variant={active ? "default" : "outline"}
                    className={`cursor-pointer gap-1.5 px-2.5 py-1 text-xs transition-all ${
                      active
                        ? "bg-muted text-muted-foreground border-transparent opacity-60"
                        : "hover:border-primary/50 hover:bg-primary/5"
                    }`}
                    onClick={() => handleSelectTech(item)}
                  >
                    {active ? (
                      <CheckCircle2 className="size-3 text-emerald-500" />
                    ) : (
                      <Plus className="size-3" />
                    )}
                    {item.name}
                  </Badge>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
