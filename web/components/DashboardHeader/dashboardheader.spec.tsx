import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import DashboardHeader from "./DashboardHeader";

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

// =====================================================================
// ESTRATÉGIA A (recomendada para este arquivo):
// Mocka os dois modais. Aqui a gente SÓ testa se o DashboardHeader
// está renderizando os componentes filhos no lugar certo + labels certos.
// O comportamento "clicar e abrir" é testado NO PRÓPRIO teste de cada modal.
// =====================================================================
vi.mock("../NotifcationsModal/NotificationsModal", () => ({
  default: () => (
    <button
      type="button"
      data-testid="mock-notifications-modal"
      aria-label="Notificações"
    />
  ),
}));

vi.mock("../SettingsModal/SettingsModal", () => ({
  default: () => (
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

  // ---------- role = "candidate" ----------
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

  // ---------- role = "recruiter" ----------
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

  // ---------- sempre renderiza ----------
  it("renders the logo link pointing to home", () => {
    render(<DashboardHeader role="candidate" />);
    const logoLink = screen.getByRole("link", { name: /gemstone seekers/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders both modals (notifications + settings)", () => {
    render(<DashboardHeader role="candidate" />);

    // Como mockamos, é só confirmar que os botões existem na DOM:
    expect(screen.getByTestId("mock-notifications-modal")).toBeInTheDocument();
    expect(screen.getByTestId("mock-settings-modal")).toBeInTheDocument();
  });

  it("renders the profile button", () => {
    render(<DashboardHeader role="candidate" />);
    expect(screen.getByRole("button", { name: /perfil/i })).toBeInTheDocument();
  });
});

// =====================================================================
// ESTRATÉGIA B (exemplo — teste REAL de modal, SEM mock):
// Descomenta o bloco abaixo se quiser testar o Dialog abrindo de verdade.
// Observação: aqui NÃO mockamos os modais. Ele clica no trigger e
// valida que o conteúdo do Dialog foi para a DOM.
// =====================================================================
/*
describe("DashboardHeader — modal integration (no mock)", () => {
  afterEach(() => {
    cleanup();
  });

  it("opens the notifications modal when clicking the bell button", async () => {
    render(<DashboardHeader role="candidate" />);

    const bellButton = screen.getByRole("button", {
      name: /notificações/i,
    });
    fireEvent.click(bellButton);

    // O title do Dialog deve aparecer depois do clique
    expect(
      await screen.findByRole("dialog", { name: /notificações/i }),
    ).toBeInTheDocument();
  });

  it("opens the settings modal when clicking the settings button", async () => {
    render(<DashboardHeader role="candidate" />);

    const settingsButton = screen.getByRole("button", {
      name: /configurações/i,
    });
    fireEvent.click(settingsButton);

    expect(
      await screen.findByRole("dialog", { name: /configurações/i }),
    ).toBeInTheDocument();
  });
});
*/
