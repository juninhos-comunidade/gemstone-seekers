import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BadgesPage from "./page";
import { useCandidateBadgesQuery } from "@/lib/api/badges/badges";

vi.mock("@/lib/api/badges/badges");

const mockUseCandidateBadgesQuery = vi.mocked(useCandidateBadgesQuery);

describe("Badges Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state when isLoading is true", () => {
    mockUseCandidateBadgesQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useCandidateBadgesQuery>);

    render(<BadgesPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders list of earned badges with all fields", () => {
    mockUseCandidateBadgesQuery.mockReturnValue({
      data: [
        {
          badgeName: "React Specialist",
          description: "Domínio em React e Hooks.",
          technologyName: "React",
          scoreAchieved: 90.0,
          earnedAt: "2026-07-15T14:30:00Z",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useCandidateBadgesQuery>);

    render(<BadgesPage />);

    expect(
      screen.getByRole("heading", { name: /minhas badges/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("React Specialist")).toBeInTheDocument();
    expect(screen.getByText("Domínio em React e Hooks.")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("90.0%")).toBeInTheDocument();
    expect(screen.getByText("Pontuação Obtida")).toBeInTheDocument();
    expect(screen.getByText("15/07/2026")).toBeInTheDocument();
  });

  it("renders badge without optional fields (no tech name, no description, no scoreAchieved) and handles invalid date fallback", () => {
    mockUseCandidateBadgesQuery.mockReturnValue({
      data: [
        {
          badgeName: "General Achievement",
          earnedAt: "invalid-date-string",
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useCandidateBadgesQuery>);

    render(<BadgesPage />);

    expect(screen.getByText("General Achievement")).toBeInTheDocument();
    expect(screen.queryByText("Pontuação Obtida")).not.toBeInTheDocument();
    expect(screen.getByText("invalid-date-string")).toBeInTheDocument();
  });

  it("renders empty state message when candidate has no badges or data is undefined", () => {
    mockUseCandidateBadgesQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useCandidateBadgesQuery>);

    render(<BadgesPage />);

    expect(
      screen.getByText(
        /você não tem badges ainda, conclua os testes para ganhar/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /ir para testes/i }),
    ).toHaveAttribute("href", "/candidate/dashboard/tests");
  });

  it("renders error state when isError is true", () => {
    mockUseCandidateBadgesQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Network Error"),
    } as unknown as ReturnType<typeof useCandidateBadgesQuery>);

    render(<BadgesPage />);

    expect(screen.getByText("Erro ao carregar badges")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Não foi possível recuperar suas badges no momento. Verifique sua conexão ou tente novamente mais tarde.",
      ),
    ).toBeInTheDocument();
  });
});
