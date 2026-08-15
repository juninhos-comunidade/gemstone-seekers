import { describe, it, expect } from "vitest";
import {
  proficiencyLevels,
  languagesLabels,
  getLanguageLabel,
  getProficiencyLabel,
} from "@/lib/utils/languages";

describe("Language helpers and constants", () => {
  it("exports proficiencyLevels and languagesLabels arrays", () => {
    expect(proficiencyLevels.length).toBeGreaterThanOrEqual(5);
    expect(languagesLabels.length).toBeGreaterThanOrEqual(5);
  });

  describe("getLanguageLabel", () => {
    it("returns translated label for known English language names", () => {
      expect(getLanguageLabel("Portuguese")).toBe("Português");
      expect(getLanguageLabel("English")).toBe("Inglês");
      expect(getLanguageLabel("Spanish")).toBe("Espanhol");
      expect(getLanguageLabel("French")).toBe("Francês");
      expect(getLanguageLabel("German")).toBe("Alemão");
    });

    it("returns the label when given the Portuguese label directly", () => {
      expect(getLanguageLabel("Português")).toBe("Português");
      expect(getLanguageLabel("Inglês")).toBe("Inglês");
    });

    it("returns fallback name for unknown language", () => {
      expect(getLanguageLabel("Klingon")).toBe("Klingon");
    });

    it("returns empty string for null/undefined/empty input", () => {
      expect(getLanguageLabel(null)).toBe("");
      expect(getLanguageLabel(undefined)).toBe("");
      expect(getLanguageLabel("")).toBe("");
    });
  });

  describe("getProficiencyLabel", () => {
    it("returns translated label for proficiency levels", () => {
      expect(getProficiencyLabel("BASIC")).toBe("Básico");
      expect(getProficiencyLabel("INTERMEDIATE")).toBe("Intermediário");
      expect(getProficiencyLabel("ADVANCED")).toBe("Avançado");
      expect(getProficiencyLabel("FLUENT")).toBe("Fluente");
      expect(getProficiencyLabel("NATIVE")).toBe("Nativo");
    });

    it("is case-insensitive", () => {
      expect(getProficiencyLabel("intermediate")).toBe("Intermediário");
      expect(getProficiencyLabel("advanced")).toBe("Avançado");
    });

    it("returns fallback for unknown level", () => {
      expect(getProficiencyLabel("UNKNOWN_LEVEL")).toBe("UNKNOWN_LEVEL");
    });

    it("returns empty string for null/undefined/empty input", () => {
      expect(getProficiencyLabel(null)).toBe("");
      expect(getProficiencyLabel(undefined)).toBe("");
      expect(getProficiencyLabel("")).toBe("");
    });
  });
});
