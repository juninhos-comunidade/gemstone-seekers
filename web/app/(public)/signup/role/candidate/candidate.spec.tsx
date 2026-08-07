import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import CandidateSignup from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
}));

const mockUpdateCandidate = vi.fn();

vi.mock("@/lib/api/auth/UpdateCandidate", () => ({
  useUpdateCandidate: () => ({
    mutateAsync: mockUpdateCandidate,
    isPending: false,
  }),
}));

type MockPhoneInputProps = InputHTMLAttributes<HTMLInputElement> & {
  value?: string;
  onChange?: (_value: string) => void;
};

type MockSelectLevelProps = SelectHTMLAttributes<HTMLSelectElement> & {
  value?: string;
  onValueChange?: (_value: string) => void;
};

vi.mock("@/components/reui/phone-input", () => ({
  PhoneInput: ({
    value,
    onChange,
    id = "phone",
    ...props
  }: MockPhoneInputProps) => (
    <input
      id={id}
      type="tel"
      value={value ?? ""}
      onChange={(event) => onChange?.(event.target.value)}
      {...props}
    />
  ),
}));

vi.mock("@/components/SelectLevel/SelectLevel", () => ({
  SelectLevel: ({ value, onValueChange }: MockSelectLevelProps) => (
    <select
      aria-label="Nível de experiência"
      value={value ?? ""}
      onChange={(event) => onValueChange?.(event.target.value)}
    >
      <option value="">Selecione</option>
      <option value="junior">Júnior</option>
      <option value="pleno">Pleno</option>
    </select>
  ),
}));

describe("Candidate Signup Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders completion form fields and submits candidate registration data", async () => {
    mockUpdateCandidate.mockResolvedValue(undefined);

    render(<CandidateSignup />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Complete seu cadastro de candidato/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/localização/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/área de interesse/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cargo desejado/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nível de experiência/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/currículo ou linkedin/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /voltar e alterar perfil/i }),
    ).toHaveAttribute("href", "/signup/role");

    fireEvent.change(
      document.querySelector("input[type='tel']") as HTMLInputElement,
      {
        target: { value: "+55 11 99999-9999" },
      },
    );
    fireEvent.change(screen.getByLabelText(/localização/i), {
      target: { value: "São Paulo, SP" },
    });
    fireEvent.change(screen.getByLabelText(/área de interesse/i), {
      target: { value: "Tecnologia" },
    });
    fireEvent.change(screen.getByLabelText(/cargo desejado/i), {
      target: { value: "Desenvolvedor Front-end" },
    });
    fireEvent.change(screen.getByLabelText(/nível de experiência/i), {
      target: { value: "junior" },
    });
    fireEvent.change(screen.getByLabelText(/currículo ou linkedin/i), {
      target: { value: "https://linkedin.com/in/teste" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /concluir cadastro/i,
      }),
    );

    await waitFor(() => {
      expect(mockUpdateCandidate).toHaveBeenCalledWith({
        phone: "+55 11 99999-9999",
        area: "Tecnologia",
        role: "Desenvolvedor Front-end",
        experience: "junior",
        location: "São Paulo, SP",
        resume: "https://linkedin.com/in/teste",
      });
    });
  });
});
