import { describe, it, expect } from "vitest";
import { candidateRoleSchema } from "./candidateRoleSchema";

describe("candidateRoleSchema", () => {
  it("accepts valid candidate role data", () => {
    const result = candidateRoleSchema.safeParse({
      phone: "+55 11 99999-9999",
      area: "Tecnologia",
      role: "Desenvolvedor Front-end",
      experience: "junior",
      location: "São Paulo, SP",
      resume: "https://linkedin.com/in/teste",
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty required fields", () => {
    const result = candidateRoleSchema.safeParse({
      phone: "",
      area: "",
      role: "",
      experience: "",
      location: "",
      resume: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      expect(fieldErrors.phone).toContain("Informe o telefone");
      expect(fieldErrors.area).toContain("Informe a área de interesse");
      expect(fieldErrors.role).toContain("Informe o cargo desejado");
      expect(fieldErrors.experience).toContain(
        "Informe o nível de experiência",
      );
      expect(fieldErrors.location).toContain("Informe a localização");
      expect(fieldErrors.resume).toContain("Informe o link do currículo");
    }
  });
});
