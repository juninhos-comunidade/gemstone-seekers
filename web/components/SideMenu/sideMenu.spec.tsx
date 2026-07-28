import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SideMenu } from "./SideMenu";

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

describe("Side Menu", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the side menu heading + help text", () => {
    render(<SideMenu items={[]} />);
    expect(screen.getByText(/menu principal/i)).toBeInTheDocument();
    expect(
      screen.getByText(/acesse rapidamente as principais áreas/i),
    ).toBeInTheDocument();
  });

  it("renders the side menu items with labels", () => {
    render(
      <SideMenu
        items={[
          { label: "Dashboard", href: "/candidate/dashboard", icon: "home" },
          { label: "Vagas", href: "/candidate/jobs", icon: "briefcase" },
          { label: "Sem link" },
        ]}
      />,
    );
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/vagas/i)).toBeInTheDocument();
    expect(screen.getByText(/sem link/i)).toBeInTheDocument();
  });

  it("renders menu items as <Link> with correct href when href is provided", () => {
    render(
      <SideMenu
        items={[{ label: "Dashboard", href: "/candidate/dashboard" }]}
      />,
    );
    const link = screen.getByRole("link", { name: /dashboard/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/candidate/dashboard");
  });

  it("marks the current page item as active based on usePathname", () => {
    render(
      <SideMenu
        items={[
          { label: "Dashboard", href: "/candidate/dashboard" },
          { label: "Vagas", href: "/candidate/jobs" },
        ]}
      />,
    );

    // usePathname mock retorna "/candidate/dashboard"
    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    const jobsLink = screen.getByRole("link", { name: /vagas/i });

    expect(dashboardLink.className).toMatch(/sidebar-primary/i);
    expect(jobsLink.className).not.toMatch(/sidebar-primary/i);
  });

  it("navigates correctly (via Next Link — href is the contract)", () => {
    render(
      <SideMenu
        items={[
          { label: "Testes", href: "/candidate/tests" },
          { label: "Perfil", href: "/candidate/user" },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: /testes/i })).toHaveAttribute(
      "href",
      "/candidate/tests",
    );
    expect(screen.getByRole("link", { name: /perfil/i })).toHaveAttribute(
      "href",
      "/candidate/user",
    );
  });
});
