import { beforeEach, describe, expect, it, vi } from "vitest";
import { httpClient } from "@/lib/api/client";
import {
  defaultIcon,
  getTechnologies,
  techIcons,
  type Technology,
} from "./techIcons";

vi.mock("@/lib/api/client", () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

describe("techIcons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches registered technologies from the API", async () => {
    const mockTechnologies: Technology[] = [
      { id: 1, name: "React", category: "Frontend" },
      { id: 2, name: "Node.js", category: "Backend" },
    ];

    vi.mocked(httpClient.get).mockResolvedValueOnce({
      success: true,
      message: "ok",
      result: mockTechnologies,
      error: null,
    } as Awaited<ReturnType<typeof httpClient.get>>);

    const result = await getTechnologies();

    expect(httpClient.get).toHaveBeenCalledWith("/api/v1/technologies");
    expect(result).toEqual(mockTechnologies);
  });

  it("throws API error message when technology request fails", async () => {
    vi.mocked(httpClient.get).mockResolvedValueOnce({
      success: false,
      message: "erro",
      result: [],
      error: {
        code: "TECH_FETCH_ERROR",
        message: "Falha ao buscar tecnologias",
        validations: [],
      },
    } as Awaited<ReturnType<typeof httpClient.get>>);

    await expect(getTechnologies()).rejects.toThrow(
      "Falha ao buscar tecnologias",
    );
  });

  it("throws fallback error message when API error has no message", async () => {
    vi.mocked(httpClient.get).mockResolvedValueOnce({
      success: false,
      message: "erro",
      result: [],
      error: null,
    } as Awaited<ReturnType<typeof httpClient.get>>);

    await expect(getTechnologies()).rejects.toThrow(
      "Erro ao buscar tecnologias",
    );
  });

  it("exposes known icon mappings and default icon", () => {
    expect(techIcons.React).toBe("devicon:react");
    expect(techIcons["Node.js"]).toBe("vscode-icons:file-type-node");
    expect(techIcons.TypeScript).toBe("devicon:typescript");
    expect(defaultIcon).toBe("mdi:code-tags");
  });
});
