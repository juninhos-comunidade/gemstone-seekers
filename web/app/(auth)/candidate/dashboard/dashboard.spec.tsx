import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Dashboard from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/candidate/dashboard",
}));

describe("Candidate Dashboard Page", () => {
  it("should render welcome header and explanation about side menu", () => {
    render(<Dashboard />);
    expect(
      screen.getByRole("heading", { name: /bem-vindo ao gemstone seekers/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/utilize o menu lateral para navegar/i),
    ).toBeInTheDocument();
  });

  it("should render quick action cards with links to jobs, radar, and profile", () => {
    render(<Dashboard />);
    const jobsLink = screen.getByRole("link", { name: /buscar vagas/i });
    expect(jobsLink).toHaveAttribute("href", "/candidate/dashboard/jobs");

    const radarLink = screen.getByRole("link", {
      name: /radar de tecnologias/i,
    });
    expect(radarLink).toHaveAttribute("href", "/candidate/dashboard/radar");

    const profileLink = screen.getByRole("link", { name: /meu perfil/i });
    expect(profileLink).toHaveAttribute("href", "/candidate/user");
  });
});
