import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
  phone: z.string().optional(),
  documentType: z.string().min(1, "Selecione o tipo de documento"),
  documentNumber: z.string().optional(),
  summary: z.string().optional(),
});

export const addressSchema = z.object({
  street: z.string().optional(),
  number: z.string().optional(),
  neighborhood: z.string().optional(),
  complement: z.string().optional(),
  zipCode: z.string().optional(),
  countryId: z.number().optional(),
  stateId: z.number().optional(),
  cityId: z.number().optional(),
  countryName: z.string().optional(),
  stateName: z.string().optional(),
  cityName: z.string().optional(),
  stateCode: z.string().optional(),
});

export const candidateLinkSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome do link obrigatório"),
  url: z.string().min(1, "URL obrigatória"),
});

export const candidateLanguageSchema = z.object({
  languageId: z.number().optional(),
  languageName: z.string().min(1, "Nome do idioma obrigatório"),
  proficiency: z.enum([
    "BASIC",
    "INTERMEDIATE",
    "ADVANCED",
    "FLUENT",
    "NATIVE",
  ]),
});

export const experienceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Cargo/Título obrigatório"),
  companyName: z.string().min(1, "Empresa obrigatória"),
  startDate: z.string().min(1, "Data de início obrigatória"),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional(),
});

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, "Instituição obrigatória"),
  fieldOfStudy: z.string().min(1, "Área de estudo obrigatória"),
  degree: z.string().optional(),
  startDate: z.string().optional(),
  completionDate: z.string().optional(),
});

export const certificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome da certificação obrigatório"),
  issuingOrganization: z.string().min(1, "Emissor obrigatório"),
  issueDate: z.string().optional(),
  expirationDate: z.string().optional(),
  credentialUrl: z.string().optional(),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome do projeto obrigatório"),
  description: z.string().optional(),
  projectUrl: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const candidateProfileSchema = userSchema.extend({
  address: addressSchema,
  links: z.array(candidateLinkSchema).optional().default([]),
  languages: z.array(candidateLanguageSchema).optional().default([]),
  experiences: z.array(experienceSchema).optional().default([]),
  educations: z.array(educationSchema).optional().default([]),
  certifications: z.array(certificationSchema).optional().default([]),
  projects: z.array(projectSchema).optional().default([]),
});

export type UserFormData = z.infer<typeof userSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type CandidateLinkFormData = z.infer<typeof candidateLinkSchema>;
export type CandidateLanguageFormData = z.infer<typeof candidateLanguageSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
export type CertificationFormData = z.infer<typeof certificationSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type CandidateProfileFormData = z.infer<typeof candidateProfileSchema>;
