type QuestionDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

type QuestionOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  technologyId: number;
  statement: string;
  difficulty: QuestionDifficulty;
  options: QuestionOption[];
};

type Test = {
  id: string;
  candidateId: string;
  technologyId: number;
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  questions: Question[];
};

export const quizMock: Test[] = [
  // JavaScript
  {
    id: "test-js-001",
    candidateId: "candidate-001",
    technologyId: 1,
    status: "IN_PROGRESS",
    questions: [
      {
        id: "js-q1",
        technologyId: 1,
        statement:
          "Qual operador é usado para comparação estrita em JavaScript?",
        difficulty: "BEGINNER",
        options: [
          { id: "js-q1-a", text: "==", isCorrect: false },
          { id: "js-q1-b", text: "===", isCorrect: true },
          { id: "js-q1-c", text: "=", isCorrect: false },
          { id: "js-q1-d", text: "!=", isCorrect: false },
        ],
      },
      {
        id: "js-q2",
        technologyId: 1,
        statement: "O que uma Promise representa em JavaScript?",
        difficulty: "INTERMEDIATE",
        options: [
          {
            id: "js-q2-a",
            text: "Um valor síncrono imediato",
            isCorrect: false,
          },
          {
            id: "js-q2-b",
            text: "Um objeto que representa a eventual conclusão (ou falha) de uma operação assíncrona",
            isCorrect: true,
          },
          {
            id: "js-q2-c",
            text: "Uma função que sempre retorna undefined",
            isCorrect: false,
          },
          { id: "js-q2-d", text: "Um tipo de loop", isCorrect: false },
        ],
      },
      {
        id: "js-q3",
        technologyId: 1,
        statement: "O que é uma closure em JavaScript?",
        difficulty: "ADVANCED",
        options: [
          {
            id: "js-q3-a",
            text: "Uma função que não aceita parâmetros",
            isCorrect: false,
          },
          {
            id: "js-q3-b",
            text: "Uma função que tem acesso ao escopo léxico onde foi criada, mesmo fora dele",
            isCorrect: true,
          },
          {
            id: "js-q3-c",
            text: "Um método exclusivo de arrays",
            isCorrect: false,
          },
          {
            id: "js-q3-d",
            text: "Uma forma de declarar variáveis globais",
            isCorrect: false,
          },
        ],
      },
    ],
  },

  // TypeScript
  {
    id: "test-ts-001",
    candidateId: "candidate-001",
    technologyId: 2,
    status: "IN_PROGRESS",
    questions: [
      {
        id: "ts-q1",
        technologyId: 2,
        statement:
          "Qual palavra-chave é usada para definir um tipo customizado em TypeScript?",
        difficulty: "BEGINNER",
        options: [
          { id: "ts-q1-a", text: "type", isCorrect: true },
          { id: "ts-q1-b", text: "class", isCorrect: false },
          { id: "ts-q1-c", text: "struct", isCorrect: false },
          { id: "ts-q1-d", text: "var", isCorrect: false },
        ],
      },
      {
        id: "ts-q2",
        technologyId: 2,
        statement: "Para que servem os generics em TypeScript?",
        difficulty: "INTERMEDIATE",
        options: [
          {
            id: "ts-q2-a",
            text: "Para criar componentes reutilizáveis que funcionam com múltiplos tipos",
            isCorrect: true,
          },
          {
            id: "ts-q2-b",
            text: "Para converter tipos automaticamente em tempo de execução",
            isCorrect: false,
          },
          {
            id: "ts-q2-c",
            text: "Para desabilitar a checagem de tipos",
            isCorrect: false,
          },
          {
            id: "ts-q2-d",
            text: "Para importar módulos externos",
            isCorrect: false,
          },
        ],
      },
      {
        id: "ts-q3",
        technologyId: 2,
        statement: "O que o utility type `Partial<T>` faz?",
        difficulty: "ADVANCED",
        options: [
          {
            id: "ts-q3-a",
            text: "Torna todas as propriedades de T obrigatórias",
            isCorrect: false,
          },
          { id: "ts-q3-b", text: "Remove propriedades de T", isCorrect: false },
          {
            id: "ts-q3-c",
            text: "Torna todas as propriedades de T opcionais",
            isCorrect: true,
          },
          { id: "ts-q3-d", text: "Transforma T em um array", isCorrect: false },
        ],
      },
    ],
  },

  // Python
  {
    id: "test-py-001",
    candidateId: "candidate-001",
    technologyId: 3,
    status: "IN_PROGRESS",
    questions: [
      {
        id: "py-q1",
        technologyId: 3,
        statement: "Qual estrutura de dados em Python é imutável?",
        difficulty: "BEGINNER",
        options: [
          { id: "py-q1-a", text: "list", isCorrect: false },
          { id: "py-q1-b", text: "dict", isCorrect: false },
          { id: "py-q1-c", text: "tuple", isCorrect: true },
          { id: "py-q1-d", text: "set", isCorrect: false },
        ],
      },
      {
        id: "py-q2",
        technologyId: 3,
        statement: "O que o decorator `@staticmethod` indica em uma classe?",
        difficulty: "INTERMEDIATE",
        options: [
          {
            id: "py-q2-a",
            text: "Que o método pertence à instância e recebe `self`",
            isCorrect: false,
          },
          {
            id: "py-q2-b",
            text: "Que o método não recebe `self` nem `cls` e pertence à classe",
            isCorrect: true,
          },
          {
            id: "py-q2-c",
            text: "Que o método será executado automaticamente na importação",
            isCorrect: false,
          },
          { id: "py-q2-d", text: "Que o método é privado", isCorrect: false },
        ],
      },
      {
        id: "py-q3",
        technologyId: 3,
        statement:
          "O que diferencia um generator de uma função comum em Python?",
        difficulty: "ADVANCED",
        options: [
          {
            id: "py-q3-a",
            text: "Generators usam `yield` e produzem valores sob demanda, mantendo estado entre chamadas",
            isCorrect: true,
          },
          {
            id: "py-q3-b",
            text: "Generators não podem receber argumentos",
            isCorrect: false,
          },
          {
            id: "py-q3-c",
            text: "Generators são sempre mais lentos e não devem ser usados",
            isCorrect: false,
          },
          {
            id: "py-q3-d",
            text: "Não há diferença real entre eles",
            isCorrect: false,
          },
        ],
      },
    ],
  },

  // Java
  {
    id: "test-java-001",
    candidateId: "candidate-001",
    technologyId: 4,
    status: "IN_PROGRESS",
    questions: [
      {
        id: "java-q1",
        technologyId: 4,
        statement:
          "Qual palavra-chave é usada para herança de classes em Java?",
        difficulty: "BEGINNER",
        options: [
          { id: "java-q1-a", text: "implements", isCorrect: false },
          { id: "java-q1-b", text: "extends", isCorrect: true },
          { id: "java-q1-c", text: "inherits", isCorrect: false },
          { id: "java-q1-d", text: "super", isCorrect: false },
        ],
      },
      {
        id: "java-q2",
        technologyId: 4,
        statement:
          "Qual a diferença principal entre uma interface e uma classe abstrata em Java?",
        difficulty: "INTERMEDIATE",
        options: [
          {
            id: "java-q2-a",
            text: "Não há diferença desde o Java 8",
            isCorrect: false,
          },
          {
            id: "java-q2-b",
            text: "Uma classe pode implementar múltiplas interfaces, mas estender apenas uma classe abstrata",
            isCorrect: true,
          },
          {
            id: "java-q2-c",
            text: "Interfaces podem ter construtores e classes abstratas não",
            isCorrect: false,
          },
          {
            id: "java-q2-d",
            text: "Classes abstratas não podem ter métodos",
            isCorrect: false,
          },
        ],
      },
      {
        id: "java-q3",
        technologyId: 4,
        statement: "O que a API de Streams do Java permite fazer?",
        difficulty: "ADVANCED",
        options: [
          {
            id: "java-q3-a",
            text: "Processar coleções de forma declarativa, com operações como map, filter e reduce",
            isCorrect: true,
          },
          {
            id: "java-q3-b",
            text: "Substituir totalmente o uso de threads",
            isCorrect: false,
          },
          {
            id: "java-q3-c",
            text: "Ler arquivos apenas em modo binário",
            isCorrect: false,
          },
          {
            id: "java-q3-d",
            text: "Compilar o código Java em tempo real",
            isCorrect: false,
          },
        ],
      },
    ],
  },
];
