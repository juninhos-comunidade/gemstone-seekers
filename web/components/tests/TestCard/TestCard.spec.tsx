import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { TestCard } from "./TestCard";
import { startAssessment } from "@/lib/api/assessments";

vi.mock("@iconify/react", () => ({
  Icon: ({ icon, className }: { icon: string; className?: string }) => (
    <div data-testid="tech-icon" data-icon={icon} className={className} />
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/lib/api/assessments", () => ({
  startAssessment: vi.fn(),
}));

describe("TestCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders test title, description, metadata and action", () => {
    render(
      <TestCard
        id="react-iniciantes"
        Tech="React"
        Titulo="React para Iniciantes"
        Descricao="Teste sobre componentes e props."
        NumQuestoes={10}
        Nivel="iniciante"
        difficulty="BEGINNER"
      />,
    );

    expect(screen.getByText(/react para iniciantes/i)).toBeInTheDocument();
    expect(
      screen.getByText(/teste sobre componentes e props\./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/10 questões/i)).toBeInTheDocument();
    expect(screen.getByText(/^iniciante$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /começar/i })).toBeInTheDocument();
  });

  it("uses mapped technology icon when available", () => {
    render(
      <TestCard
        id="react-intermediario"
        Tech="React"
        Titulo="React Intermediário"
        Descricao="Teste de hooks."
        NumQuestoes={15}
        Nivel="intermediario"
      />,
    );

    expect(screen.getByTestId("tech-icon")).toHaveAttribute(
      "data-icon",
      "devicon:react",
    );
  });

  it("falls back to default icon when technology is unknown", () => {
    render(
      <TestCard
        id="teste-desconhecido"
        Tech="Tecnologia X"
        Titulo="Teste Desconhecido"
        Descricao="Teste sem ícone mapeado."
        NumQuestoes={8}
        Nivel="iniciante"
      />,
    );

    expect(screen.getByTestId("tech-icon")).toHaveAttribute(
      "data-icon",
      "mdi:code-tags",
    );
  });

  it("shows loading state when starting test", async () => {
    vi.mocked(startAssessment).mockImplementation(() => new Promise(() => {}));

    render(
      <TestCard
        id="react-test"
        Tech="React"
        Titulo="React Test"
        Descricao="Test description"
        NumQuestoes={10}
        Nivel="iniciante"
        difficulty="BEGINNER"
      />,
    );

    const startButton = screen.getByRole("button", { name: /começar/i });
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/verificando\.\.\./i)).toBeInTheDocument();
    });
  });

  it("shows error message when technology has no tests", async () => {
    vi.mocked(startAssessment).mockRejectedValue(new Error("No tests available"));

    render(
      <TestCard
        id="tech-sem-testes"
        Tech="Tecnologia Sem Testes"
        Titulo="Teste Sem Testes"
        Descricao="Test description"
        NumQuestoes={10}
        Nivel="iniciante"
        difficulty="BEGINNER"
      />,
    );

    const startButton = screen.getByRole("button", { name: /começar/i });
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(
        screen.getByText(/esta tecnologia não possui testes disponíveis no momento\./i),
      ).toBeInTheDocument();
    });
  });
});
