import { z } from "zod";

export const jobTechnologySchema = z.object({
  technologyId: z.number(),
  name: z.string().min(1, "Nome da tecnologia é obrigatório"),
  category: z.string().optional(),
  isMandatory: z.boolean().default(true),
});

export const jobFormSchema = z.object({
  title: z.string().min(3, "O título da vaga deve ter no mínimo 3 caracteres"),
  companyName: z.string().min(2, "Nome da empresa é obrigatório"),
  department: z.string().min(2, "Informe o departamento ou área"),
  seniorityLevel: z.enum([
    "Junior",
    "Pleno",
    "Sênior",
    "Especialista",
    "Tech Lead",
  ]),
  location: z.string().min(2, "Informe a localização ou regime de trabalho"),
  status: z.enum(["OPEN", "PAUSED", "CLOSED", "CANCELLED"]).default("OPEN"),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  description: z
    .string()
    .min(10, "A descrição deve ter no mínimo 10 caracteres"),
  technologies: z.array(jobTechnologySchema).default([]),
});

export type JobFormData = z.infer<typeof jobFormSchema>;
