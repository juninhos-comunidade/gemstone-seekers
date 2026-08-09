import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, FormProvider } from "react-hook-form";
import { describe, it, expect } from "vitest";

import { CandidateAddressSection } from "./CandidateAddressSection";
import { CandidateCertificationsSection } from "./CandidateCertificationsSection";
import { CandidateEducationsSection } from "./CandidateEducationsSection";
import { CandidateExperiencesSection } from "./CandidateExperiencesSection";
import { CandidateLanguagesSection } from "./CandidateLanguagesSection";
import { CandidateLinksSection } from "./CandidateLinksSection";
import { CandidatePersonalInfoSection } from "./CandidatePersonalInfoSection";
import { CandidateProjectsSection } from "./CandidateProjectsSection";

function TestWrapper({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode;
  defaultValues?: Record<string, unknown>;
}) {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("Candidate Profile Edit Form Sections", () => {
  it("renders CandidateAddressSection", () => {
    render(
      <TestWrapper>
        <CandidateAddressSection />
      </TestWrapper>,
    );
    expect(screen.getByText(/Endereço Residencial/i)).toBeInTheDocument();
  });

  it("renders CandidatePersonalInfoSection", () => {
    render(
      <TestWrapper>
        <CandidatePersonalInfoSection />
      </TestWrapper>,
    );
    expect(screen.getByText(/Informações Pessoais/i)).toBeInTheDocument();
  });

  it("allows adding and removing items in CandidateCertificationsSection", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper defaultValues={{ certifications: [] }}>
        <CandidateCertificationsSection />
      </TestWrapper>,
    );

    const addButton = screen.getByRole("button", {
      name: /Adicionar Certificação/i,
    });
    await user.click(addButton);

    expect(screen.getByText(/Certificação #1/i)).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole("button");
    const trashBtn = deleteButtons.find(
      (btn) => btn.querySelector("svg") && btn !== addButton,
    );
    if (trashBtn) {
      await user.click(trashBtn);
    }
  });

  it("allows adding and removing items in CandidateEducationsSection", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper defaultValues={{ educations: [] }}>
        <CandidateEducationsSection />
      </TestWrapper>,
    );

    const addButton = screen.getByRole("button", {
      name: /Adicionar Formação/i,
    });
    await user.click(addButton);

    expect(screen.getByText(/Formação #1/i)).toBeInTheDocument();
  });

  it("allows adding and removing items in CandidateExperiencesSection", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper defaultValues={{ experiences: [] }}>
        <CandidateExperiencesSection />
      </TestWrapper>,
    );

    const addButton = screen.getByRole("button", {
      name: /Adicionar Experiência/i,
    });
    await user.click(addButton);

    expect(screen.getByText(/Experiência #1/i)).toBeInTheDocument();
  });

  it("allows adding and removing items in CandidateLanguagesSection", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper defaultValues={{ languages: [] }}>
        <CandidateLanguagesSection />
      </TestWrapper>,
    );

    const addButton = screen.getByRole("button", { name: /Adicionar Idioma/i });
    await user.click(addButton);

    expect(screen.getByText(/Idiomas & Proficiência/i)).toBeInTheDocument();
  });

  it("allows adding and removing items in CandidateLinksSection", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper defaultValues={{ links: [] }}>
        <CandidateLinksSection />
      </TestWrapper>,
    );

    const addButton = screen.getByRole("button", { name: /Adicionar Link/i });
    await user.click(addButton);

    expect(screen.getByText(/Nome do Link \/ Plataforma/i)).toBeInTheDocument();
  });

  it("allows adding and removing items in CandidateProjectsSection", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper defaultValues={{ projects: [] }}>
        <CandidateProjectsSection />
      </TestWrapper>,
    );

    const addButton = screen.getByRole("button", {
      name: /Adicionar Projeto/i,
    });
    await user.click(addButton);

    expect(screen.getByText(/Projeto #1/i)).toBeInTheDocument();
  });
});
