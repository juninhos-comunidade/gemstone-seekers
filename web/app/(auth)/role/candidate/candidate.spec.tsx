import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CandidateSignup from "./page";
import { useUpdateCandidate } from "@/lib/api/auth/UpdateCandidate";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

vi.mock("@/lib/api/auth/UpdateCandidate", () => ({
  useUpdateCandidate: vi.fn(),
}));

interface PhoneInputMockProps {
  value?: string;
  onChange?: (_value: string) => void;
  id?: string;
}

vi.mock("@/components/reui/phone-input", () => ({
  PhoneInput: ({ value, onChange, id = "phone" }: PhoneInputMockProps) => (
    <input
      id={id}
      type="tel"
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}));

interface SelectLevelMockProps {
  value?: string;
  onValueChange?: (_value: string) => void;
}

vi.mock("@/components/SelectLevel/SelectLevel", () => ({
  SelectLevel: ({ value, onValueChange }: SelectLevelMockProps) => (
    <select
      aria-label="Nível de experiência"
      value={value ?? ""}
      onChange={(e) => onValueChange?.(e.target.value)}
    >
      <option value="">Selecione</option>
      <option value="junior">Júnior</option>
      <option value="pleno">Pleno</option>
    </select>
  ),
}));

type UseUpdateCandidateReturn = ReturnType<typeof useUpdateCandidate>;

describe("Candidate Signup Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders completion form fields and submits candidate registration data", async () => {
    const mockMutate = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useUpdateCandidate).mockReturnValue({
      mutateAsync: mockMutate,
      isPending: false,
    } as unknown as UseUpdateCandidateReturn);

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
    ).toHaveAttribute("href", "/role");

    fireEvent.change(screen.getByLabelText(/tipo de documento/i), {
      target: { value: "CPF" },
    });
    fireEvent.change(screen.getByLabelText(/número do documento/i), {
      target: { value: "123.456.789-00" },
    });
    fireEvent.change(
      document.querySelector("input[type='tel']") as HTMLInputElement,
      { target: { value: "+55 11 99999-9999" } },
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

    const submitBtn = screen.getByRole("button", {
      name: /concluir cadastro/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        phone: "+55 11 99999-9999",
        area: "Tecnologia",
        role: "Desenvolvedor Front-end",
        documentType: "CPF",
        documentNumber: "123.456.789-00",
        experience: "junior",
        location: "São Paulo, SP",
        resume: "https://linkedin.com/in/teste",
      });
    });
  });

  it("shows loading state when submitting", () => {
    vi.mocked(useUpdateCandidate).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    } as unknown as UseUpdateCandidateReturn);

    render(<CandidateSignup />);

    const submitBtn = screen.getByRole("button", { name: /salvando/i });
    expect(submitBtn).toBeDisabled();
  });
});
