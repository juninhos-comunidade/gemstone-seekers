import { ProficiencyLevel } from "@/lib/types/candidate";

export interface ProficiencyOption {
  value: ProficiencyLevel;
  label: string;
}

export interface LanguageLabelOption {
  name: string;
  label: string;
}

export const proficiencyLevels: readonly ProficiencyOption[] = [
  { value: "BASIC", label: "Básico" },
  { value: "INTERMEDIATE", label: "Intermediário" },
  { value: "ADVANCED", label: "Avançado" },
  { value: "FLUENT", label: "Fluente" },
  { value: "NATIVE", label: "Nativo" },
] as const;

export const languagesLabels: readonly LanguageLabelOption[] = [
  { name: "Portuguese", label: "Português" },
  { name: "English", label: "Inglês" },
  { name: "Spanish", label: "Espanhol" },
  { name: "French", label: "Francês" },
  { name: "German", label: "Alemão" },
  { name: "Italian", label: "Italiano" },
  { name: "Mandarin", label: "Mandarim" },
  { name: "Japanese", label: "Japonês" },
  { name: "Russian", label: "Russo" },
] as const;

export function getLanguageLabel(name?: string | null): string {
  if (!name) return "";
  const found = languagesLabels.find(
    (lang) =>
      lang.name.toLowerCase() === name.toLowerCase() ||
      lang.label.toLowerCase() === name.toLowerCase(),
  );
  return found?.label || name;
}

export function getProficiencyLabel(level?: string | null): string {
  if (!level) return "";
  const found = proficiencyLevels.find(
    (item) => item.value.toUpperCase() === level.toUpperCase(),
  );
  return found?.label || level;
}
