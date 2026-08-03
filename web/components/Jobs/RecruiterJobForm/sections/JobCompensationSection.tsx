"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { JobFormData } from "@/lib/schemas/forms/jobFormSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Banknote } from "lucide-react";

export function JobCompensationSection() {
  const { register } = useFormContext<JobFormData>();

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Banknote className="size-4 text-emerald-500" />
          Faixa Salarial / Remuneração (Opcional)
        </CardTitle>
        <CardDescription>
          Informe os valores mínimo e máximo em R$ para maior atratividade.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="salaryMin">Salário Mínimo (R$)</Label>
            <Input
              id="salaryMin"
              type="number"
              {...register("salaryMin")}
              placeholder="Ex: 8000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryMax">Salário Máximo (R$)</Label>
            <Input
              id="salaryMax"
              type="number"
              {...register("salaryMax")}
              placeholder="Ex: 12000"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
