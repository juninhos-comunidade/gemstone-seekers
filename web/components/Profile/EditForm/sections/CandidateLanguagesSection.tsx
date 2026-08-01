"use client";

import React from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages, Plus, Trash2 } from "lucide-react";

export function CandidateLanguagesSection() {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<CandidateProfileFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "languages",
  });

  const languagesWatch = useWatch({ control, name: "languages" });

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Languages className="text-primary size-4" />
            Idiomas & Proficiência
          </CardTitle>
          <CardDescription>
            Idiomas que você domina e seus respectivos níveis de conhecimento.
          </CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1 text-xs"
          onClick={() =>
            append({ languageName: "", proficiency: "INTERMEDIATE" })
          }
        >
          <Plus className="size-3.5" />
          Adicionar Idioma
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.length === 0 ? (
          <p className="text-muted-foreground/70 py-2 text-xs italic">
            Nenhum idioma adicionado. Clique acima para incluir seus idiomas.
          </p>
        ) : (
          fields.map((field, index) => {
            const currentProficiency =
              languagesWatch?.[index]?.proficiency || "INTERMEDIATE";
            return (
              <div
                key={field.id}
                className="border-border/40 bg-muted/20 flex items-start gap-3 rounded-lg border p-3"
              >
                <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label
                      htmlFor={`languages.${index}.languageName`}
                      className="text-xs"
                    >
                      Idioma
                    </Label>
                    <Input
                      id={`languages.${index}.languageName`}
                      {...register(`languages.${index}.languageName`)}
                      placeholder="Ex: Português, Inglês, Espanhol"
                    />
                    {errors.languages?.[index]?.languageName && (
                      <p className="text-destructive text-[11px]">
                        {errors.languages[index]?.languageName?.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor={`languages.${index}.proficiency`}
                      className="text-xs"
                    >
                      Nível de Proficiência
                    </Label>
                    <Select
                      value={currentProficiency}
                      onValueChange={(val) =>
                        setValue(
                          `languages.${index}.proficiency`,
                          val as CandidateProfileFormData["languages"][number]["proficiency"],
                        )
                      }
                    >
                      <SelectTrigger id={`languages.${index}.proficiency`}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BASIC">Básico</SelectItem>
                        <SelectItem value="INTERMEDIATE">
                          Intermediário
                        </SelectItem>
                        <SelectItem value="ADVANCED">Avançado</SelectItem>
                        <SelectItem value="FLUENT">Fluente</SelectItem>
                        <SelectItem value="NATIVE">Nativo</SelectItem>
                      </SelectContent>
                    </Select>
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
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
