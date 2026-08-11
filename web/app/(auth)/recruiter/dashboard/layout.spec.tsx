import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Layout from "./layout";

vi.mock("@/components/DashboardHeader/DashboardHeader", () => ({
  DashboardHeader: ({
    role,
    menuItems,
  }: {
    role: string;
    menuItems: Array<{ label: string; href?: string }>;
  }) => (
    <div data-testid="dashboard-header">
      {role} - {menuItems.map((item) => item.label).join(",")}
    </div>
  ),
}));

vi.mock("@/components/SideMenu/SideMenu", () => ({
  SideMenu: ({ items }: { items: Array<{ label: string }> }) => (
    <div data-testid="side-menu">
      {items.map((item) => item.label).join(",")}
    </div>
  ),
}));

describe("Recruiter Dashboard Layout", () => {
  it("renders dashboard header, side menu and children", () => {
    render(
      <Layout>
        <div>Conteúdo do dashboard recrutador</div>
      </Layout>,
    );

    expect(screen.getByTestId("side-menu")).toHaveTextContent(
      "Dashboard,Vagas,Radar",
    );
    expect(
      screen.getByText(/conteúdo do dashboard recrutador/i),
    ).toBeInTheDocument();
  });
});
