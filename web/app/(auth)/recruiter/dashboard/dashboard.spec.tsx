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
  usePathname: () => "/recruiter/dashboard",
}));

describe("Recruiter Dashboard Page", () => {
  it("should render welcome header and explanation about side menu", () => {
    render(<Dashboard />);
    expect(
      screen.getByRole("heading", { name: /bem-vindo ao gemstone seekers/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/navegue pelas opções no menu lateral/i),
    ).toBeInTheDocument();
  });

  it("should render quick action cards with links to jobs and new job", () => {
    render(<Dashboard />);
    const allJobsLink = screen.getByRole("link", { name: /todas as vagas/i });
    expect(allJobsLink).toHaveAttribute("href", "/recruiter/dashboard/jobs");

    const newJobLink = screen.getByRole("link", {
      name: /publicar nova vaga/i,
    });
    expect(newJobLink).toHaveAttribute("href", "/recruiter/dashboard/jobs/new");
  });
});
