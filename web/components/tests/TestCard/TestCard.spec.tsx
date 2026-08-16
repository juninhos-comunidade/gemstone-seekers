import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TestCard } from "./TestCard";

vi.mock("@iconify/react", () => ({
  Icon: ({ icon, className }: { icon: string; className?: string }) => (
    <div data-testid="tech-icon" data-icon={icon} className={className} />
  ),
}));

describe("TestCard", () => {
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
    const startLink = screen.getByRole("link", { name: /começar/i });
    expect(startLink).toBeInTheDocument();
    expect(startLink).toHaveAttribute(
      "href",
      "/candidate/test/react-iniciantes?difficulty=BEGINNER",
    );
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
});
