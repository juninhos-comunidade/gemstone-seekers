import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
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
  usePathname: vi.fn(),
}));

const mockUsePathname = vi.mocked(usePathname);

describe("Side Menu", () => {
  it("renders heading and menu items with links and icons, including items with icon but no link", () => {
    mockUsePathname.mockReturnValue("/candidate/dashboard");

    render(
      <SideMenu
        items={[
          { label: "Dashboard", href: "/candidate/dashboard", icon: "home" },
          { label: "Vagas", href: "/candidate/jobs", icon: "briefcase" },
          { label: "Sem link", icon: "code" },
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

  it("selects the most specific (longest) active href when nested path matches multiple items", () => {
    mockUsePathname.mockReturnValue("/candidate/jobs/detail");

    render(
      <SideMenu
        items={[
          { label: "Candidate Area", href: "/candidate" },
          { label: "Jobs List", href: "/candidate/jobs" },
        ]}
      />,
    );

    const candidateLink = screen.getByRole("link", { name: /candidate area/i });
    const jobsLink = screen.getByRole("link", { name: /jobs list/i });

    expect(jobsLink.className).toMatch(/sidebar-primary/i);
    expect(candidateLink.className).not.toMatch(/sidebar-primary/i);
  });
});
