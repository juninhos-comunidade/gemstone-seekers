import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecruiterSignup from "./page";

const mockUpdateRecruiter = vi.fn();

vi.mock("@/lib/api/auth/UpdateRecruiter", () => ({
  useUpdateRecruiter: () => ({
    mutateAsync: mockUpdateRecruiter,
    isPending: false,
  }),
}));

vi.mock("@/components/reui/phone-input", () => ({
  PhoneInput: ({ value, onChange, id = "phone", ...props }: any) => (
    <input
      id={id}
      type="tel"
      value={value ?? ""}
      onChange={(event) => onChange?.(event.target.value)}
      {...props}
    />
  ),
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ value, onValueChange, children }: any) => (
    <select
      aria-label="Tamanho da empresa"
      value={value ?? ""}
      onChange={(event) => onValueChange?.(event.target.value)}
    >
      <option value="">Selecione</option>
      {children}
    </select>
  ),
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ children, value }: any) => (
    <option value={value}>{children}</option>
  ),
  SelectTrigger: ({ children }: any) => <>{children}</>,
  SelectValue: () => null,
}));

describe("Recruiter Signup Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders recruiter profile form fields, submit button and skip link, and handles submit navigation", async () => {
    mockUpdateRecruiter.mockResolvedValue(undefined);

    render(<RecruiterSignup />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /informações do recrutador/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/nome da empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^cargo$/i)).toBeInTheDocument();
    expect(screen.getByText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/site da empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tamanho da empresa/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /pular por enquanto/i }),
    ).toHaveAttribute("href", "/dashboard");

    fireEvent.change(screen.getByLabelText(/nome da empresa/i), {
      target: { value: "Gemstone Seekers" },
    });
    fireEvent.change(screen.getByLabelText(/^cargo$/i), {
      target: { value: "Analista de RH" },
    });
    fireEvent.change(
      document.querySelector("input[type='tel']") as HTMLInputElement,
      {
        target: { value: "+55 11 99999-9999" },
      },
    );
    fireEvent.change(screen.getByLabelText(/site da empresa/i), {
      target: { value: "https://gemstoneseekers.com" },
    });
    fireEvent.change(screen.getByLabelText(/tamanho da empresa/i), {
      target: { value: "11-50" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /concluir cadastro/i,
      }),
    );

    await waitFor(() => {
      expect(mockUpdateRecruiter).toHaveBeenCalledWith({
        companyName: "Gemstone Seekers",
        jobTitle: "Analista de RH",
        phone: "+55 11 99999-9999",
        companyWebsite: "https://gemstoneseekers.com",
        companySize: "11-50",
      });
    });
  });
});
