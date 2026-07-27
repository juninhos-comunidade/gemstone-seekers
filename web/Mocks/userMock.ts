export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  portfolio: string;
}

export interface UserMock {
  id: string;
  name: string;
  role: string;
  email: string;
  bio: string;
  avatarUrl: string;
  links: SocialLinks;
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  projects: Project[];
}

export const MOCK_USER: UserMock = {
  id: "1",
  name: "Thiago Silva",
  role: "Desenvolvedor Front-end & Gestor de TI",
  email: "thiago.dev@exemplo.com",
  bio: "Desenvolvedor Front-end focado no ecossistema React e Next.js, com background em Gestão de Tecnologia da Informação. Especialista na criação de interfaces modernas, acessíveis e focadas em performance.",
  avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent("Thiago Silva")}&background=0D9488&color=fff`,

  links: {
    github: "https://github.com/thiago-dev",
    linkedin: "https://linkedin.com/in/thiago-dev",
    portfolio: "https://thiago-portfolio.vercel.app",
  },

  experiences: [
    {
      id: "exp-1",
      role: "Desenvolvedor Front-end Senior",
      company: "TechLab Studio",
      period: "2023 - Presente",
      description:
        "Liderança no desenvolvimento de interfaces web com Next.js (App Router), TypeScript e Tailwind CSS. Criação de Design Systems escaláveis e integração de visualizações 3D interativas.",
    },
    {
      id: "exp-2",
      role: "Gestor de Projetos de TI",
      company: "Nexus Soluções Digitais",
      period: "2021 - 2023",
      description:
        "Mapeamento de processos, gestão de equipes ágeis (Scrum/Kanban) e alinhamento entre os objetivos de negócio e entregas técnicas de software.",
    },
  ],

  education: [
    {
      id: "edu-1",
      degree: "Graduação em Gestão de Tecnologia da Informação",
      institution: "Faculdade de Tecnologia (Fatec)",
      period: "2019 - 2022",
    },
  ],

  certifications: [
    {
      id: "cert-1",
      title: "Desenvolvimento Front-end com React e TypeScript",
      issuer: "Rocketseat",
      year: "2023",
    },
    {
      id: "cert-2",
      title: "Arquitetura de Software & Next.js Avançado",
      issuer: "Alura",
      year: "2022",
    },
  ],

  projects: [
    {
      id: "proj-1",
      title: "Plarte Lab",
      description:
        "Plataforma interativa para laboratório de tecnologia, com foco em ecossistemas imersivos e impressão 3D.",
      link: "https://github.com/thiago-dev/plarte-lab",
    },
    {
      id: "proj-2",
      title: "Dashboard Copa do Mundo 2026",
      description:
        "Aplicação em Next.js para acompanhamento em tempo real de estatísticas, dados de estádios e partidas.",
      link: "https://github.com/thiago-dev/copa-2026-dashboard",
    },
    {
      id: "proj-3",
      title: "NextTasks",
      description:
        "Gerenciador de tarefas minimalista focado em produtividade e alta performance no ambiente web.",
      link: "https://github.com/thiago-dev/next-tasks",
    },
  ],
};
