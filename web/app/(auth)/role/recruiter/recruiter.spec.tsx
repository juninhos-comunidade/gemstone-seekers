import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { InputHTMLAttributes, ReactNode } from "react";
import RecruiterSignup from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
}));

const mockUpdateRecruiter = vi.fn();

vi.mock("@/lib/api/auth/UpdateRecruiter", () => ({
  useUpdateRecruiter: () => ({
    mutateAsync: mockUpdateRecruiter,
    isPending: false,
  }),
}));

type MockPhoneInputProps = InputHTMLAttributes<HTMLInputElement> & {
  value?: string;
  onChange?: (_value: string) => void;
};

type MockSelectProps = {
  value?: string;
  onValueChange?: (_value: string) => void;
  children?: ReactNode;
};

type MockSelectChildrenProps = {
  children?: ReactNode;
};

type MockSelectItemProps = {
  children?: ReactNode;
  value: string;
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

vi.mock("@/components/ui/select", () => ({
  Select: ({ value, onValueChange, children }: MockSelectProps) => (
    <select
      aria-label="Tamanho da empresa"
      value={value ?? ""}
      onChange={(event) => onValueChange?.(event.target.value)}
    >
      <option value="">Selecione</option>
      {children}
    </select>
  ),
  SelectContent: ({ children }: MockSelectChildrenProps) => <>{children}</>,
  SelectItem: ({ children, value }: MockSelectItemProps) => (
    <option value={value}>{children}</option>
  ),
  SelectTrigger: ({ children }: MockSelectChildrenProps) => <>{children}</>,
  SelectValue: () => null,
}));

describe("Recruiter Signup Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders recruiter completion form fields and submits recruiter data", async () => {
    mockUpdateRecruiter.mockResolvedValue(undefined);

    render(<RecruiterSignup />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /complete seu cadastro de recrutador/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/nome da empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^cargo$/i)).toBeInTheDocument();
    expect(screen.getByText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/site da empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tamanho da empresa/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /voltar e alterar perfil/i }),
    ).toHaveAttribute("href", "/role");

    fireEvent.change(screen.getByLabelText(/tipo de documento/i), {
      target: { value: "CNPJ" },
    });
    fireEvent.change(screen.getByLabelText(/número do documento/i), {
      target: { value: "00.000.000/0000-00" },
    });
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
        documentType: "CNPJ",
        documentNumber: "00.000.000/0000-00",
        companyName: "Gemstone Seekers",
        jobTitle: "Analista de RH",
        phone: "+55 11 99999-9999",
        companyWebsite: "https://gemstoneseekers.com",
        companySize: "11-50",
      });
    });
  });
});
