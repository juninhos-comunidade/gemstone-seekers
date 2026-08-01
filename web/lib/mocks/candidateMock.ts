import { CandidateProfile } from "@/lib/types/candidate";

export const INITIAL_MOCK_CANDIDATE: CandidateProfile = {
  id: "cand-001",
  userId: "user-100",
  user: {
    id: "user-100",
    name: "Thiago Silva",
    email: "thiago.silva@exemplo.com",
    role: "CANDIDATE",
    documentType: "CPF",
    documentNumber: "123.456.789-00",
    createdAt: "2026-01-15T10:00:00.000Z",
  },
  phone: "(11) 98765-4321",
  summary:
    "Desenvolvedor Front-end especializado no ecossistema React e Next.js, apaixonado por criar interfaces rápidas, modernas e acessíveis. Experiência em integração de APIs REST, Design Systems e otimização de performance web.",
  address: {
    id: "addr-001",
    street: "Avenida Paulista",
    number: "1000",
    neighborhood: "Bela Vista",
    complement: "Apto 1204",
    zipCode: "01310-100",
    cityName: "São Paulo",
    stateName: "São Paulo",
    stateCode: "SP",
    countryName: "Brasil",
  },
  links: [
    { id: "lnk-1", name: "GitHub", url: "https://github.com/thiago-dev" },
    {
      id: "lnk-2",
      name: "LinkedIn",
      url: "https://linkedin.com/in/thiago-dev",
    },
    {
      id: "lnk-3",
      name: "Portfólio",
      url: "https://thiago-portfolio.vercel.app",
    },
  ],
  languages: [
    { languageId: 1, languageName: "Português", proficiency: "NATIVE" },
    { languageId: 2, languageName: "Inglês", proficiency: "ADVANCED" },
    { languageId: 3, languageName: "Espanhol", proficiency: "INTERMEDIATE" },
  ],
  experiences: [
    {
      id: "exp-1",
      title: "Desenvolvedor Front-end Senior",
      companyName: "TechLab Studio",
      startDate: "2023-03-01",
      isCurrent: true,
      description:
        "Liderança no desenvolvimento de interfaces web com Next.js (App Router), TypeScript e Tailwind CSS. Criação de Design Systems escaláveis e otimização de métricas Core Web Vitals.",
    },
    {
      id: "exp-2",
      title: "Desenvolvedor Front-end Pleno",
      companyName: "Nexus Soluções Digitais",
      startDate: "2021-06-01",
      endDate: "2023-02-28",
      isCurrent: false,
      description:
        "Construção de aplicações SPA em React e integração de APIs RESTful. Desenvolvimento de testes automatizados com Jest e React Testing Library.",
    },
  ],
  educations: [
    {
      id: "edu-1",
      institution: "Faculdade de Tecnologia de São Paulo (Fatec)",
      fieldOfStudy: "Gestão de Tecnologia da Informação",
      degree: "Tecnólogo",
      startDate: "2019-02-01",
      completionDate: "2022-12-15",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "React & Next.js Advanced Architecture",
      issuingOrganization: "Rocketseat",
      issueDate: "2023-08-10",
      credentialUrl: "https://rocketseat.com.br/certificates/react-next",
    },
    {
      id: "cert-2",
      name: "Web Accessibility (WCAG 2.1)",
      issuingOrganization: "W3Cx",
      issueDate: "2022-11-05",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Gemstone Seekers Platform",
      description:
        "Plataforma interativa para caça de talentos em tecnologia com avaliação automatizada e gamificação.",
      projectUrl: "https://github.com/thiago-dev/gemstone-seekers",
      startDate: "2026-01-10",
    },
    {
      id: "proj-2",
      name: "NextTasks Productivity App",
      description:
        "Gerenciador de tarefas minimalista focado em performance no ambiente web.",
      projectUrl: "https://github.com/thiago-dev/next-tasks",
      startDate: "2025-05-01",
      endDate: "2025-09-30",
    },
  ],
  createdAt: "2026-01-15T10:00:00.000Z",
  updatedAt: "2026-07-30T14:30:00.000Z",
};

export const EMPTY_CANDIDATE_MOCK: CandidateProfile = {
  id: "cand-002",
  userId: "user-101",
  user: {
    id: "user-101",
    name: "Novo Candidato",
    email: "candidato.novo@exemplo.com",
    role: "CANDIDATE",
    documentType: "CPF",
    documentNumber: "",
    createdAt: "2026-07-31T10:00:00.000Z",
  },
  phone: "",
  summary: "",
  address: undefined,
  links: [],
  languages: [],
  experiences: [],
  educations: [],
  certifications: [],
  projects: [],
  createdAt: "2026-07-31T10:00:00.000Z",
  updatedAt: "2026-07-31T10:00:00.000Z",
};
