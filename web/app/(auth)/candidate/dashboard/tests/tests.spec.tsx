import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TestsPage from "./page";

const mockSelectFilter = vi.fn();

// Mock da API de tecnologias
vi.mock("@/lib/api/technologies/getTechnologies", () => ({
  useTechnologiesQuery: () => ({
    data: [
      { id: 1, name: "JavaScript", category: "Programming" },
      { id: 2, name: "TypeScript", category: "Programming" },
      { id: 3, name: "Python", category: "Programming" },
      { id: 4, name: "Java", category: "Programming" },
    ],
    isLoading: false,
  }),
}));

// Mock do SelectFilter para incluir o disabled prop
vi.mock("@/components/SelectFilter/SelectFilter", () => ({
  SelectFilter: ({
    items,
    value,
    onValueChange,
    placeholder,
    disabled,
  }: {
    items: Array<{ value: string; label: string }>;
    value?: string;
    onValueChange?: (_value: string) => void;
    placeholder?: string;
    disabled?: boolean;
  }) => {
    mockSelectFilter({ items, value, onValueChange, placeholder, disabled });

    return (
      <label>
        <span>{placeholder}</span>
        <select
          aria-label={placeholder}
          value={value}
          onChange={(event) => onValueChange?.(event.target.value)}
          disabled={disabled}
        >
          {items.map((item) => (
            <option key={item.value || item.label} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
    );
  },
}));

vi.mock("@/components/tests/TestCard/TestCard", () => ({
  TestCard: ({
    Tech,
    Titulo,
    Nivel,
  }: {
    Tech: string;
    Titulo: string;
    Nivel: string;
  }) => (
    <article data-testid="test-card">
      <h2>{Titulo}</h2>
      <p>{Tech}</p>
      <p>{Nivel}</p>
    </article>
  ),
}));

vi.mock("@/components/SkeletonCard/SkeletonCard", () => ({
  SkeletonCard: () => <div data-testid="skeleton-card" />,
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
  usePathname: () => "/candidate/dashboard/tests",
}));

describe("Candidate Tests Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page heading, helper text and all test cards by default", () => {
    render(<TestsPage />);

    expect(
      screen.getByRole("heading", { name: /testes/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/explore os questionários disponíveis por tecnologia/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /filtrar por tecnologia/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /filtrar por nível/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("test-card")).toHaveLength(4);
  });

  it("filters cards by selected technology", () => {
    render(<TestsPage />);

    fireEvent.change(
      screen.getByRole("combobox", { name: /filtrar por tecnologia/i }),
      {
        target: { value: "JavaScript" },
      },
    );

    expect(screen.getAllByTestId("test-card")).toHaveLength(1);
    expect(screen.getByText(/javascript assessment/i)).toBeInTheDocument();
    expect(screen.queryByText(/python assessment/i)).not.toBeInTheDocument();
  });

  it("filters cards by technology and level together", () => {
    render(<TestsPage />);

    fireEvent.change(
      screen.getByRole("combobox", { name: /filtrar por tecnologia/i }),
      {
        target: { value: "JavaScript" },
      },
    );

    fireEvent.change(
      screen.getByRole("combobox", { name: /filtrar por nível/i }),
      {
        target: { value: "BEGINNER" },
      },
    );

    expect(screen.getAllByTestId("test-card")).toHaveLength(1);
    expect(screen.getByText(/javascript assessment/i)).toBeInTheDocument();
    expect(screen.queryByText(/python assessment/i)).not.toBeInTheDocument();
  });

  it("restores all cards when technology filter is cleared", () => {
    render(<TestsPage />);

    const technologySelect = screen.getByRole("combobox", {
      name: /filtrar por tecnologia/i,
    });

    fireEvent.change(technologySelect, {
      target: { value: "Java" },
    });
    expect(screen.getAllByTestId("test-card")).toHaveLength(1);

    fireEvent.change(technologySelect, {
      target: { value: "" },
    });
    expect(screen.getAllByTestId("test-card")).toHaveLength(4);
  });
});
