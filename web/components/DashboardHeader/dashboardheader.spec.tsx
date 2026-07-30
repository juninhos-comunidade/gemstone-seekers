import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DashboardHeader } from "./DashboardHeader";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/candidate/dashboard",
}));

describe("DashboardHeader", () => {
  it("renders candidate layout, initials, logo link and handles profile redirect", () => {
    vi.clearAllMocks();
    render(<DashboardHeader role="candidate" />);
    expect(screen.getByText(/painel do candidato/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /perfil/i })).toHaveTextContent(
      /CA/,
    );

    const logoLink = screen.getByRole("link", { name: /gemstone seekers/i });
    expect(logoLink).toHaveAttribute("href", "/candidate/dashboard");

    fireEvent.click(screen.getByRole("button", { name: /perfil/i }));
    expect(mockPush).toHaveBeenCalledWith("/candidate/user");
  });

  it("renders recruiter layout, initials, and handles profile redirect", () => {
    vi.clearAllMocks();
    render(<DashboardHeader role="recruiter" />);
    expect(screen.getByText(/painel do recrutador/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /perfil/i })).toHaveTextContent(
      /RE/,
    );

    fireEvent.click(screen.getByRole("button", { name: /perfil/i }));
    expect(mockPush).toHaveBeenCalledWith("/recruiter/user");
  });
});
