import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DashboardHeader } from "./DashboardHeader";

vi.mock("@/components/SettingsModal/SettingsModal", () => ({
  SettingsModal: () => <div>Settings</div>,
}));

vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SheetContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SheetHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SheetTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/SideMenu/SideMenu", () => ({
  SideMenu: ({ items }: { items: Array<{ label: string }> }) => (
    <div data-testid="mobile-side-menu">
      {items.map((item) => item.label).join(",")}
    </div>
  ),
}));

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

const mockLogout = vi.fn();
vi.mock("@/lib/api/auth", () => ({
  logout: () => mockLogout(),
}));

describe("DashboardHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders candidate layout, initials, logo link and handles profile redirect", () => {
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

  it("renders recruiter layout and hides avatar button", () => {
    render(<DashboardHeader role="recruiter" />);
    expect(screen.getByText(/painel do recrutador/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /perfil/i }),
    ).not.toBeInTheDocument();

    const logoLink = screen.getByRole("link", { name: /gemstone seekers/i });
    expect(logoLink).toHaveAttribute("href", "/recruiter/dashboard");
  });

  it("handles logout when clicking the logout button", () => {
    render(<DashboardHeader role="candidate" />);
    const logoutBtn = screen.getByRole("button", { name: /sair da conta/i });
    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("renders mobile menu trigger content when menu items are provided", () => {
    render(
      <DashboardHeader
        role="candidate"
        menuItems={[
          { label: "Dashboard", href: "/candidate/dashboard", icon: "home" },
          {
            label: "Radar",
            href: "/candidate/dashboard/radar",
            icon: "LuRadar",
          },
        ]}
      />,
    );

    expect(screen.getByText("Menu")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-side-menu")).toHaveTextContent(
      "Dashboard,Radar",
    );
  });
});
