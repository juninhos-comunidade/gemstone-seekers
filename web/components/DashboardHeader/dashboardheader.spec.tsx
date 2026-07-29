import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { DashboardHeader } from "./DashboardHeader";

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

vi.mock("@/components/NotificationsModal/NotificationsModal", () => ({
  NotificationsModal: () => (
    <button
      type="button"
      data-testid="mock-notifications-modal"
      aria-label="Notificações"
    />
  ),
}));

vi.mock("@/components/SettingsModal/SettingsModal", () => ({
  SettingsModal: () => (
    <button
      type="button"
      data-testid="mock-settings-modal"
      aria-label="Configurações"
    />
  ),
}));

describe("DashboardHeader", () => {
  afterEach(() => {
    cleanup();
  });

  describe("when role is candidate", () => {
    it("renders the candidate role label", () => {
      render(<DashboardHeader role="candidate" />);
      expect(screen.getByText(/painel do candidato/i)).toBeInTheDocument();
      expect(screen.getByText(/visão geral da sua conta/i)).toBeInTheDocument();
    });

    it("shows 'CA' initials on the profile button", () => {
      render(<DashboardHeader role="candidate" />);
      expect(screen.getByRole("button", { name: /perfil/i })).toHaveTextContent(
        /CA/,
      );
    });
  });

  describe("when role is recruiter", () => {
    it("renders the recruiter role label", () => {
      render(<DashboardHeader role="recruiter" />);
      expect(screen.getByText(/painel do recrutador/i)).toBeInTheDocument();
    });

    it("shows 'RE' initials on the profile button", () => {
      render(<DashboardHeader role="recruiter" />);
      expect(screen.getByRole("button", { name: /perfil/i })).toHaveTextContent(
        /RE/,
      );
    });
  });

  it("renders the logo link pointing to the role dashboard", () => {
    render(<DashboardHeader role="candidate" />);
    const logoLink = screen.getByRole("link", { name: /gemstone seekers/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/candidate/dashboard");
  });

  it("renders both modals (notifications + settings)", () => {
    render(<DashboardHeader role="candidate" />);

    expect(screen.getByTestId("mock-notifications-modal")).toBeInTheDocument();
    expect(screen.getByTestId("mock-settings-modal")).toBeInTheDocument();
  });

  it("renders the profile button", () => {
    render(<DashboardHeader role="candidate" />);
    expect(screen.getByRole("button", { name: /perfil/i })).toBeInTheDocument();
  });
});
