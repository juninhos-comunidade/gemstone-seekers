import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import type { MenuItem } from "@/components/SideMenu/SideMenu";
import Layout from "./layout";

type MockMenuItem = Pick<MenuItem, "label" | "href" | "icon">;

vi.mock("@/components/DashboardHeader/DashboardHeader", () => ({
  DashboardHeader: ({ role }: { role: string }) => (
    <header data-testid="mock-dashboard-header" data-role={role} />
  ),
}));

vi.mock("@/components/SideMenu/SideMenu", () => ({
  SideMenu: ({ items }: { items: MockMenuItem[] }) => (
    <aside data-testid="mock-side-menu">
      {items.map((item) => (
        <span key={item.label} data-href={item.href}>
          {item.label}
        </span>
      ))}
    </aside>
  ),
}));

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

describe("Recruiter Layout", () => {
  afterEach(() => cleanup());

  it("passes role='recruiter' to the DashboardHeader", () => {
    render(
      <Layout>
        <p>children content</p>
      </Layout>,
    );
    expect(screen.getByTestId("mock-dashboard-header")).toHaveAttribute(
      "data-role",
      "recruiter",
    );
  });

  it("renders the 3 recruiter side menu items (Dashboard / Vagas / Candidatos)", () => {
    render(
      <Layout>
        <p>oi</p>
      </Layout>,
    );
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/vagas/i)).toBeInTheDocument();
    expect(screen.getByText(/candidatos/i)).toBeInTheDocument();
    // Garante que NÃO tem item "Testes" (é do candidate)
    expect(screen.queryByText(/^testes$/i)).not.toBeInTheDocument();
  });

  it("renders the children content", () => {
    render(
      <Layout>
        <p data-testid="my-child">Conteudo da pagina</p>
      </Layout>,
    );
    expect(screen.getByTestId("my-child")).toBeInTheDocument();
  });
});
