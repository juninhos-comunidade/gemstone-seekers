import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BadgesPage from "./page";
import { useCandidateBadgesQuery } from "@/lib/api/badges";

vi.mock("@/lib/api/badges");

const mockUseCandidateBadgesQuery = vi.mocked(useCandidateBadgesQuery);

describe("Badges Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state when isLoading is true", () => {
    mockUseCandidateBadgesQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as ReturnType<typeof useCandidateBadgesQuery>);

    render(<BadgesPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders list of earned badges with all fields", () => {
    mockUseCandidateBadgesQuery.mockReturnValue({
      data: [
        {
          id: 1,
          name: "React Specialist",
          description: "Domínio em React e Hooks.",
          technologyName: "React",
          testScore: 90.0,
          earnedAt: "2026-07-15T14:30:00Z",
        },
      ],
      isLoading: false,
      error: null,
    } as ReturnType<typeof useCandidateBadgesQuery>);

    render(<BadgesPage />);

    expect(
      screen.getByRole("heading", { name: /minhas badges/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("React Specialist")).toBeInTheDocument();
    expect(screen.getByText("Domínio em React e Hooks.")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("90.0%")).toBeInTheDocument();
    expect(screen.getByText("Pontuação Obtida")).toBeInTheDocument();
  });

  it("renders badge without optional fields (no tech name, no description, no test score) and handles invalid date fallback", () => {
    mockUseCandidateBadgesQuery.mockReturnValue({
      data: [
        {
          id: 2,
          name: "General Achievement",
          earnedAt: "invalid-date-string",
        },
      ],
      isLoading: false,
      error: null,
    } as ReturnType<typeof useCandidateBadgesQuery>);

    render(<BadgesPage />);

    expect(screen.getByText("General Achievement")).toBeInTheDocument();
    expect(screen.queryByText("Pontuação Obtida")).not.toBeInTheDocument();
    expect(screen.getByText("invalid-date-string")).toBeInTheDocument();
  });

  it("renders empty state message when candidate has no badges or data is undefined", () => {
    mockUseCandidateBadgesQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useCandidateBadgesQuery>);

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
});
