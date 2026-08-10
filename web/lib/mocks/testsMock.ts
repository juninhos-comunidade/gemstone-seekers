export type Questionario = {
  Tech: string;
  Titulo: string;
  Descricao: string;
  NumQuestoes: number;
  Nivel: string;
};

export const questionarios = [
  // JavaScript
  {
    Tech: "JavaScript",
    Titulo: "JavaScript para Iniciantes",
    Descricao: "Teste sobre os conceitos básicos da linguagem JavaScript.",
    NumQuestoes: 10,
    Nivel: "iniciante",
  },
  {
    Tech: "JavaScript",
    Titulo: "JavaScript Intermediário",
    Descricao: "Teste sobre funções, arrays, objetos e programação assíncrona.",
    NumQuestoes: 15,
    Nivel: "intermediario",
  },
  {
    Tech: "JavaScript",
    Titulo: "JavaScript Avançado",
    Descricao: "Teste sobre closures, promises, event loop e conceitos avançados.",
    NumQuestoes: 20,
    Nivel: "avancado",
  },

  // TypeScript
  {
    Tech: "TypeScript",
    Titulo: "TypeScript para Iniciantes",
    Descricao: "Teste sobre tipos básicos, variáveis e funções em TypeScript.",
    NumQuestoes: 10,
    Nivel: "iniciante",
  },
  {
    Tech: "TypeScript",
    Titulo: "TypeScript Intermediário",
    Descricao: "Teste sobre interfaces, generics, enums e tipos personalizados.",
    NumQuestoes: 15,
    Nivel: "intermediario",
  },
  {
    Tech: "TypeScript",
    Titulo: "TypeScript Avançado",
    Descricao: "Teste sobre utility types, decorators e tipos condicionais.",
    NumQuestoes: 20,
    Nivel: "avancado",
  },

  // Python
  {
    Tech: "Python",
    Titulo: "Python para Iniciantes",
    Descricao: "Teste sobre variáveis, listas, condicionais e estruturas de repetição.",
    NumQuestoes: 10,
    Nivel: "iniciante",
  },
  {
    Tech: "Python",
    Titulo: "Python Intermediário",
    Descricao: "Teste sobre funções, módulos, orientação a objetos e tratamento de erros.",
    NumQuestoes: 15,
    Nivel: "intermediario",
  },
  {
    Tech: "Python",
    Titulo: "Python Avançado",
    Descricao: "Teste sobre decorators, generators, threads e programação assíncrona.",
    NumQuestoes: 20,
    Nivel: "avancado",
  },

  // Java
  {
    Tech: "Java",
    Titulo: "Java para Iniciantes",
    Descricao: "Teste sobre sintaxe, variáveis, métodos e estruturas de controle.",
    NumQuestoes: 10,
    Nivel: "iniciante",
  },
  {
    Tech: "Java",
    Titulo: "Java Intermediário",
    Descricao: "Teste sobre classes, herança, interfaces e coleções.",
    NumQuestoes: 15,
    Nivel: "intermediario",
  },
  {
    Tech: "Java",
    Titulo: "Java Avançado",
    Descricao: "Teste sobre streams, generics, concorrência e padrões de projeto.",
    NumQuestoes: 20,
    Nivel: "avancado",
  },

  // React
  {
    Tech: "React",
    Titulo: "React para Iniciantes",
    Descricao: "Teste sobre componentes, JSX, props e estado.",
    NumQuestoes: 10,
    Nivel: "iniciante",
  },
  {
    Tech: "React",
    Titulo: "React Intermediário",
    Descricao: "Teste sobre hooks, context API, formulários e consumo de APIs.",
    NumQuestoes: 15,
    Nivel: "intermediario",
  },
  {
    Tech: "React",
    Titulo: "React Avançado",
    Descricao: "Teste sobre performance, memoização, arquitetura e renderização.",
    NumQuestoes: 20,
    Nivel: "avancado",
  },

  // Node.js
  {
    Tech: "Node.js",
    Titulo: "Node.js para Iniciantes",
    Descricao: "Teste sobre módulos, npm, arquivos e criação de servidores.",
    NumQuestoes: 10,
    Nivel: "iniciante",
  },
  {
    Tech: "Node.js",
    Titulo: "Node.js Intermediário",
    Descricao: "Teste sobre Express, middlewares, rotas e APIs REST.",
    NumQuestoes: 15,
    Nivel: "intermediario",
  },
  {
    Tech: "Node.js",
    Titulo: "Node.js Avançado",
    Descricao: "Teste sobre autenticação JWT, streams, workers e escalabilidade.",
    NumQuestoes: 20,
    Nivel: "avancado",
  },

  // Git
  {
    Tech: "Git",
    Titulo: "Git para Iniciantes",
    Descricao: "Teste sobre repositórios, commits, branches e comandos básicos.",
    NumQuestoes: 10,
    Nivel: "iniciante",
  },
  {
    Tech: "Git",
    Titulo: "Git Intermediário",
    Descricao: "Teste sobre merge, rebase, stash, tags e resolução de conflitos.",
    NumQuestoes: 15,
    Nivel: "intermediario",
  },
  {
    Tech: "Git",
    Titulo: "Git Avançado",
    Descricao: "Teste sobre Git Flow, hooks, cherry-pick e estratégias avançadas.",
    NumQuestoes: 20,
    Nivel: "avancado",
  },

  // Banco de Dados
  {
    Tech: "SQL",
    Titulo: "SQL para Iniciantes",
    Descricao: "Teste sobre tabelas, SELECT, INSERT, UPDATE e DELETE.",
    NumQuestoes: 10,
    Nivel: "iniciante",
  },
  {
    Tech: "SQL",
    Titulo: "SQL Intermediário",
    Descricao: "Teste sobre relacionamentos, JOINs, filtros e funções de agregação.",
    NumQuestoes: 15,
    Nivel: "intermediario",
  },
  {
    Tech: "SQL",
    Titulo: "SQL Avançado",
    Descricao: "Teste sobre subconsultas, views, índices, procedures e otimização.",
    NumQuestoes: 20,
    Nivel: "avancado",
  },
];
