import { z } from "zod";

export const jobTechnologySchema = z.object({
  technologyId: z.number(),
  technologyName: z.string().optional(),
  category: z.string().optional(),
  isMandatory: z.boolean().default(true),
});

export const jobFormSchema = z.object({
  title: z.string().min(3, "O título da vaga deve ter no mínimo 3 caracteres"),
  companyId: z.string().min(1, "Selecione uma empresa"),
  recruiterId: z.string().min(1, "Selecione um recrutador"),
  department: z.string().min(2, "Informe o departamento ou área"),
  seniorityLevel: z.enum([
    "Junior",
    "Pleno",
    "Sênior",
    "Especialista",
    "Tech Lead",
    "Mid",
  ]),
  status: z.enum(["OPEN", "CLOSED", "CANCELLED"]).default("OPEN"),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  description: z
    .string()
    .min(10, "A descrição deve ter no mínimo 10 caracteres"),
  technologies: z.array(jobTechnologySchema).default([]),
});

export type JobFormData = z.infer<typeof jobFormSchema>;
