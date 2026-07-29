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
  links: SocialLinks;
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  projects: Project[];
}

export const MOCK_CANDIDATE_USER: UserMock = {
  id: "1",
  name: "Thiago Silva",
  role: "Desenvolvedor Front-end & Gestor de TI",
  email: "thiago.dev@exemplo.com",
  bio: "Desenvolvedor Front-end focado no ecossistema React e Next.js, com background em Gestão de Tecnologia da Informação. Especialista na criação de interfaces modernas, acessíveis e focadas em performance.",

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

export const MOCK_RECRUITER_USER: UserMock = {
  id: "2",
  name: "Ana Souza",
  role: "Recrutadora de Tecnologia",
  email: "ana.recruiter@exemplo.com",
  bio: "Recrutadora especializada em perfis de tecnologia, com foco em desenvolvimento de software, produto e dados. Experiência em hunting, employer branding e condução de processos seletivos ágeis.",

  links: {
    github: "https://github.com/ana-recruiter",
    linkedin: "https://linkedin.com/in/ana-recruiter",
    portfolio: "https://ana-recruiter.vercel.app",
  },

  experiences: [
    {
      id: "exp-r1",
      role: "Recrutadora Tech Senior",
      company: "Gemstone Seekers",
      period: "2022 - Presente",
      description:
        "Condução de processos seletivos para vagas de engenharia, produto e dados. Parceria com lideranças técnicas na definição de perfis, scorecards e entrevistas estruturadas.",
    },
    {
      id: "exp-r2",
      role: "Talent Acquisition Specialist",
      company: "Nexus Soluções Digitais",
      period: "2019 - 2022",
      description:
        "Atração e triagem de candidatos para squads de tecnologia, gestão de pipeline no ATS e melhoria contínua da experiência do candidato.",
    },
  ],

  education: [
    {
      id: "edu-r1",
      degree: "Graduação em Psicologia Organizacional",
      institution: "Universidade Paulista (UNIP)",
      period: "2014 - 2018",
    },
  ],

  certifications: [
    {
      id: "cert-r1",
      title: "Tech Recruiting Foundations",
      issuer: "LinkedIn Learning",
      year: "2023",
    },
    {
      id: "cert-r2",
      title: "People Analytics para RH",
      issuer: "Google",
      year: "2021",
    },
  ],

  projects: [
    {
      id: "proj-r1",
      title: "Playbook de Entrevistas Técnicas",
      description:
        "Guia interno com roteiros, critérios de avaliação e boas práticas para entrevistas de desenvolvimento.",
      link: "https://github.com/ana-recruiter/tech-interview-playbook",
    },
    {
      id: "proj-r2",
      title: "Dashboard de Pipeline",
      description:
        "Painel para acompanhamento de vagas abertas, candidatos por etapa e tempo médio de contratação.",
      link: "https://github.com/ana-recruiter/hiring-dashboard",
    },
  ],
};

/** @deprecated Use MOCK_CANDIDATE_USER ou MOCK_RECRUITER_USER */
export const MOCK_USER = MOCK_CANDIDATE_USER;
