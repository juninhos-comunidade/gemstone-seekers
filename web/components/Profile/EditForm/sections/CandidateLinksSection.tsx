"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { CandidateProfileFormData } from "@/lib/schemas/forms/candidateProfileSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Link2, Plus, Trash2 } from "lucide-react";

export function CandidateLinksSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CandidateProfileFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Link2 className="text-primary size-4" />
            Links & Redes Sociais
          </CardTitle>
          <CardDescription>
            Portfólio, GitHub, LinkedIn e outros links relevantes.
          </CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1 text-xs"
          onClick={() => append({ name: "", url: "" })}
        >
          <Plus className="size-3.5" />
          Adicionar Link
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.length === 0 ? (
          <p className="text-muted-foreground/70 py-2 text-xs italic">
            Nenhum link adicionado. Clique acima para incluir seus links.
          </p>
        ) : (
          fields.map((field, index) => (
            <div
              key={field.id}
              className="border-border/40 bg-muted/20 flex items-start gap-3 rounded-lg border p-3"
            >
              <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor={`links.${index}.name`} className="text-xs">
                    Nome do Link / Plataforma
                  </Label>
                  <Input
                    id={`links.${index}.name`}
                    {...register(`links.${index}.name`)}
                    placeholder="Ex: GitHub, LinkedIn, Blog"
                  />
                  {errors.links?.[index]?.name && (
                    <p className="text-destructive text-[11px]">
                      {errors.links[index]?.name?.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`links.${index}.url`} className="text-xs">
                    URL / Endereço Web
                  </Label>
                  <Input
                    id={`links.${index}.url`}
                    {...register(`links.${index}.url`)}
                    placeholder="Ex: https://github.com/usuario"
                  />
                  {errors.links?.[index]?.url && (
                    <p className="text-destructive text-[11px]">
                      {errors.links[index]?.url?.message}
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive mt-5 shrink-0"
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
