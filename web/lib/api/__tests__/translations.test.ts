import { describe, it, expect } from "vitest";
import {
  translateErrorMessage,
  translateValidationMessage,
  translateSuccessMessage,
  ENABLE_ERROR_TRANSLATION,
} from "@/lib/api/translations";

describe("Error Translation Module", () => {
  it("should translate known error codes", () => {
    expect(
      translateErrorMessage("Invalid email or password", "INVALID_CREDENTIALS"),
    ).toBe("E-mail ou senha inválidos.");
    expect(translateErrorMessage(undefined, "DATA_INTEGRITY_VIOLATION")).toBe(
      "Conflito de dados no sistema. Registro duplicado ou com dependências.",
    );
    expect(
      translateErrorMessage(
        "Database constraint violation occurred",
        "DATA_INTEGRITY_VIOLATION",
      ),
    ).toBe("Ocorreu um conflito de dados no sistema.");
    expect(translateErrorMessage("Access denied", "ACCESS_DENIED")).toBe(
      "Acesso negado. Você não tem permissão para esta ação.",
    );
    expect(
      translateErrorMessage("Invalid email or password", "ACCESS_DENIED"),
    ).toBe("E-mail ou senha inválidos.");
    expect(
      translateErrorMessage("timeout of 10000ms exceeded", "ECONNABORTED"),
    ).toBe(
      "O servidor demorou muito para responder. Tente novamente em instantes.",
    );
  });

  it("should translate known success messages", () => {
    expect(translateSuccessMessage("Login successful")).toBe(
      "Login realizado com sucesso!",
    );
    expect(translateSuccessMessage("User registered successfully")).toBe(
      "Conta criada com sucesso!",
    );
    expect(translateSuccessMessage("Job created successfully")).toBe(
      "Vaga criada com sucesso!",
    );
    expect(translateSuccessMessage("Custom unmapped success message")).toBe(
      "Custom unmapped success message",
    );
  });

  it("should translate known exact English messages when code is absent", () => {
    expect(translateErrorMessage("Invalid email or password")).toBe(
      "E-mail ou senha inválidos.",
    );
    expect(
      translateErrorMessage("Technology is already linked to this job"),
    ).toBe("Esta tecnologia já está vinculada a esta vaga.");
  });

  it("should support regex replacement for dynamic entity IDs in NOT_FOUND messages", () => {
    expect(
      translateErrorMessage(
        "User with id test@example.com not found",
        "NOT_FOUND",
      ),
    ).toBe("Usuário com ID 'test@example.com' não encontrado.");
    expect(translateErrorMessage("Job with id job-101 not found")).toBe(
      "Vaga com ID 'job-101' não encontrada.",
    );
    expect(translateErrorMessage("Company with id comp-456 not found")).toBe(
      "Empresa com ID 'comp-456' não encontrada.",
    );
  });

  it("should fallback to original message if translation is missing", () => {
    const unknownMessage = "Custom unmapped backend exception message";
    expect(translateErrorMessage(unknownMessage)).toBe(unknownMessage);
  });

  it("should translate validation messages", () => {
    expect(translateValidationMessage("must not be blank")).toBe(
      "não pode estar em branco.",
    );
    expect(
      translateValidationMessage("must be a well-formed email address"),
    ).toBe("deve ser um endereço de e-mail válido.");
    expect(translateValidationMessage("Custom unknown validation")).toBe(
      "Custom unknown validation",
    );
  });

  it("should export ENABLE_ERROR_TRANSLATION flag", () => {
    expect(typeof ENABLE_ERROR_TRANSLATION).toBe("boolean");
  });
});
