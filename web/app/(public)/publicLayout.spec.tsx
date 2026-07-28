import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import PublicLayout from "./layout";

vi.mock("@/components/Header/Header", () => ({
  default: () => (
    <header data-testid="mock-public-header">
      <span>Mocked Public Header</span>
    </header>
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
  usePathname: () => "/",
}));

describe("Public Layout", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the Header component", () => {
    render(
      <PublicLayout>
        <p>children content</p>
      </PublicLayout>,
    );
    expect(screen.getByTestId("mock-public-header")).toBeInTheDocument();
    expect(screen.getByText(/mocked public header/i)).toBeInTheDocument();
  });

  it("renders its children content", () => {
    render(
      <PublicLayout>
        <p data-testid="public-child">Hello Public Page!</p>
      </PublicLayout>,
    );
    expect(screen.getByTestId("public-child")).toBeInTheDocument();
    expect(screen.getByText(/Hello Public Page!/i)).toBeInTheDocument();
  });

  it("renders both the header and multiple children together", () => {
    render(
      <PublicLayout>
        <main>
          <h1>Home Page</h1>
          <section data-testid="hero-section">Hero content here</section>
        </main>
      </PublicLayout>,
    );

    expect(screen.getByTestId("mock-public-header")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: /home page/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
  });
});
