import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
  it("renders heading and menu items with links and icons", () => {
    render(
      <SideMenu
        items={[
          { label: "Dashboard", href: "/candidate/dashboard", icon: "home" },
          { label: "Vagas", href: "/candidate/jobs", icon: "briefcase" },
          { label: "Sem link" },
        ]}
      />,
    );
    expect(screen.getByText(/menu principal/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "href",
      "/candidate/dashboard",
    );
    expect(screen.getByRole("link", { name: /vagas/i })).toHaveAttribute(
      "href",
      "/candidate/jobs",
    );
    expect(screen.getByText(/sem link/i)).toBeInTheDocument();
  });

  it("marks active page based on usePathname", () => {
    render(
      <SideMenu
        items={[
          { label: "Dashboard", href: "/candidate/dashboard" },
          { label: "Vagas", href: "/candidate/jobs" },
        ]}
      />,
    );

    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    const jobsLink = screen.getByRole("link", { name: /vagas/i });

    expect(dashboardLink.className).toMatch(/sidebar-primary/i);
    expect(jobsLink.className).not.toMatch(/sidebar-primary/i);
  });
});
