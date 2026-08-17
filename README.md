<div align="center">

# 💎 Gemstone Seekers

**Plataforma inteligente de recrutamento, validação técnica automatizada com IA e matching por competências tech.**

[![Java 25](https://img.shields.io/badge/Java-25-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1.0-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring AI](https://img.shields.io/badge/Spring_AI-Google_GenAI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://spring.io/projects/spring-ai)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18--Alpine-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## 📖 Sumário

- [Visão Geral](#-visão-geral)
- [Arquitetura do Ecossistema](#-arquitetura-do-ecossistema)
- [Desenvolvimento Acelerado com IA](#-desenvolvimento-acelerado-com-ia)
- [Estrutura do Repositório](#-estrutura-do-repositório)
- [Backend (API REST & Inteligência Artificial)](#-backend-api-rest--inteligência-artificial)
  - [Stack Tecnológica](#stack-tecnológica---backend)
  - [Principais Módulos e Recursos](#principais-módulos-e-recursos)
  - [Configuração e Execução do Backend](#configuração-e-execução-do-backend)
- [Frontend (Aplicação Web)](#-frontend-aplicação-web)
  - [Stack Tecnológica](#stack-tecnológica---frontend)
  - [Principais Funcionalidades](#principais-funcionalidades---frontend)
  - [Configuração e Execução do Frontend](#configuração-e-execução-do-frontend)
- [Execução Rápida Fullstack](#-execução-rápida-fullstack)
- [Testes e Garantia de Qualidade](#-testes-e-garantia-de-qualidade)
- [Padrões e Convenções](#-padrões-e-convenções)
- [Equipe e Contribuições](#-equipe-e-contribuições)

---

## 🎯 Visão Geral

O **Gemstone Seekers** é uma plataforma que conecta profissionais de tecnologia e empresas através de dados reais de competência. Em vez de triagens superficiais baseadas apenas em currículos, a plataforma combina:

1. **Validação Prática de Conhecimento com IA:** Avaliações técnicas com geração e curadoria dinâmica de questões via **Google GenAI (Gemini)** integrado ao **Spring AI**.
2. **Radar de Habilidades:** Matriz visual de competências técnicas que mapeia o nível real do candidato em diferentes stacks.
3. **Gamificação com Badges & Gemas:** Conquistas desbloqueadas progressivamente conforme testes práticos são concluídos com sucesso.
4. **Matching de Vagas Baseado em Proficiência:** Recrutadores encontram talentos com assertividade com base em evidências técnicas comprovadas.

---

## 🏗️ Arquitetura do Ecossistema

O diagrama abaixo ilustra o fluxo de dados e a comunicação entre o cliente Web, o Gateway de roteamento, o Backend em Spring Boot e a integração com IA:

```text
+-----------------------------------------------------------------------------------+
|                                  NAVEGADOR (CLIENT)                               |
|   - Candidato (Dashboard, Quizzes, Radar, Badges, Vagas)                          |
|   - Recrutador (Dashboard de Vagas com visualização e criaçÃo de vagas)           |
+------------------------------------------+----------------------------------------+
                                           | HTTP / HTTPS
                                           v
+-----------------------------------------------------------------------------------+
|                             FRONTEND (Next.js 16 / React 19)                      |
|  - Routing Proxy (proxy.ts) -> Guardião de rotas & Refresh silencioso de JWT      |
|  - TanStack React Query v5  -> Cache & Sincronização de Estado                    |
|  - Tailwind CSS v4          -> Interface responsiva com Dark/Light Theme          |
+------------------------------------------+----------------------------------------+
                                           | /api/* (Rewrites / Proxy)
                                           v
+-----------------------------------------------------------------------------------+
|                         BACKEND API (Spring Boot 4.1 / Java 25)                   |
|  - Auth & Security: JWT Bearer Tokens, RBAC (Candidate vs Recruiter)              |
|  - Assessment Engine: Gestão de testes técnicos, contagem de tempo e scores       |
|  - Badge & Radar Service: Atribuição de insígnias e cálculo de matriz de skills   |
|  - Spring Data JPA + Flyway Migrations: Persistência relacional robusta          |
+--------------------+-------------------------------------+------------------------+
                     |                                     |
                     v                                     v
+----------------------------------+     +------------------------------------------+
|       BANCO DE DADOS POSTGRESQL  |     |         IA ENGINE (Google GenAI)         |
|  - PostgreSQL 18 Alpine          |     |  - Spring AI Google GenAI Starter        |
|  - Flyway Migrations & Seeds     |     |  - Geração dinâmica de questões técnicas |
|  - Tabelas de Usuários, Vagas,   |     +------------------------------------------+
|    Testes, Badges e Radar        |
+----------------------------------+
```

---

## 🤖 Uso de ferramentas de IA

No decorrer do projeto, ferramentas de **Inteligência Artificial Generativa e Agentes de Codificação** foram integradas ativamente no fluxo de trabalho com os seguintes objetivos:

- **Aceleração da Engenharia de Software:** Auxílio na estruturação de boilerplate, e desenvolvimento de funcionalidades.
- **Produtividade em Testes:** Apoio na cobertura de testes unitários e de componentes para alcançar as metas de qualidade do projeto.
- **Quebra de Tarefas:** Criação de tarefas com base nos requisitos durante a construção da solução.

---

## 📂 Estrutura do Repositório

```text
gemstone-seekers/
├── api/                              # Backend em Java 25 + Spring Boot 4.1
│   ├── src/main/java/com/gemstoneseekers/
│   │   ├── controllers/              # Endpoints REST (Auth, Assessment, Jobs, Radar, etc.)
│   │   ├── services/                 # Regras de negócio (Spring AI, Avaliações, Badges)
│   │   ├── security/                 # Filtros JWT, RBAC e configuração do Spring Security
│   │   ├── models/ & dtos/           # Entidades JPA e DTOs de transferência
│   │   └── repositories/             # Repositórios Spring Data JPA
│   ├── src/main/resources/
│   │   ├── db/migration/             # Scripts versionados de migração do Flyway
│   │   ├── db/seed/                  # Seeds de tecnologias, cidades, países e badges
│   │   └── application.yml           # Configuração de perfis e datasource
│   ├── docker/                       # Definições do Docker Compose (base, dev, prod)
│   ├── Makefile                      # Automação de tarefas do backend (build, run, dev)
│   └── pom.xml                       # Dependências Maven, plugins de cobertura e qualidade
│
├── web/                              # Frontend em Next.js 16 + React 19 + TypeScript
│   ├── app/                          # App Router (Rotas públicas, Candidato e Recrutador)
│   ├── components/                   # Componentes React (UI, Providers, Radar, Testes)
│   ├── lib/                          # Clientes HTTP, hooks do TanStack Query, Schemas Zod
│   ├── docs/                         # Guia de convenções e padrões (CONVENTIONS.md)
│   ├── proxy.ts                      # Routing Proxy e guardião de rotas autenticadas
│   ├── vitest.config.ts              # Configuração de testes unitários (Vitest)
│   └── package.json                  # Scripts e dependências do frontend
│
├── gemstone-pitch-deck.html          # Apresentação e visualização dos modelos da plataforma
├── hooks/                            # Git Hooks para validação prévia de commits
└── README.md                         # Documentação principal do projeto
```

---

## ☕ Backend (API REST & Inteligência Artificial)

### Stack Tecnológica - Backend

- **Linguagem & Plataforma:** Java 25
- **Framework Principal:** Spring Boot 4.1.0
- **Inteligência Artificial:** Spring AI 2.0.0 com `spring-ai-starter-model-google-genai` (Gemini)
- **Persistência & Dados:** Spring Data JPA / Hibernate, Flyway Database Migrations
- **Banco de Dados:** PostgreSQL 18 (Alpine)
- **Segurança:** Spring Security com autenticação JWT stateless (`io.jsonwebtoken:jjwt 0.13.0`)
- **Documentação de API:** SpringDoc OpenAPI 3.0.3 (Swagger UI interativo)
- **Testes & Qualidade:** JUnit 5, Mockito, Testcontainers, RestAssured, JaCoCo (mínimo 80% coverage) e SpotBugs

### Principais Módulos e Recursos

- **`AiQuestionGeneratorService`:** Integração com Google GenAI via Spring AI para criação automatizada de questões técnicas categorizadas por tecnologia e senioridade.
- **`AssessmentApplicationService`:** Controle do ciclo de vida das avaliações técnicas (início, envio de respostas, encerramento por tempo e cálculo de aproveitamento).
- **`BadgeApplicationService` & `MarketRadarService`:** Mecânica de gamificação para premiar candidatos com insígnias técnicas e gerar métricas para o Radar de Habilidades.
- **`JobService` & `JobTechnologyService`:** CRUD completo de oportunidades de emprego com requisitos de tecnologias vinculados.
- **`UserProfileService`:** Gestão abrangente do perfil do candidato (experiências, formação, links, certificações e idiomas).
- **`AuthService` & `JwtService`:** Gestão de tokens de acesso e refresh tokens com renovação segura.

### Configuração e Execução do Backend

#### Pré-requisitos

- **Java 25** instalado.
- **Docker** e **Docker Compose** ativos.
- Chave de API do **Google Gemini** (caso utilize o gerador de questões via IA).

#### Variáveis de Ambiente do Backend (`api/.env`)

Copie o arquivo de exemplo e ajuste suas credenciais:

```bash
cd ../api
cp .env.example .env
```

#### Comandos Disponíveis via Makefile

| Comando           | Descrição                                                                  |
| ----------------- | -------------------------------------------------------------------------- |
| `make dev`        | Sobe apenas o PostgreSQL no Docker (permite rodar o app pela IDE)          |
| `make stack-up`   | Inicia o backend completo + PostgreSQL 100% containerizados via Docker     |
| `make stack-down` | Encerra os containers do backend e banco                                   |
| `make run`        | Executa o Spring Boot localmente via Maven (`./mvnw spring-boot:run`)      |
| `make test`       | Executa todos os testes unitários e de integração                          |
| `make verify`     | Executa o ciclo completo de verificação Maven (testes + JaCoCo + SpotBugs) |
| `make logs`       | Exibe os logs em tempo real de todos os containers                         |

#### Documentação Swagger / OpenAPI

Com o backend em execução, acesse a documentação interativa em:

```text
http://localhost:8080/swagger-ui.html
```

---

## 💻 Frontend (Aplicação Web)

### Stack Tecnológica - Frontend

- **Framework:** Next.js 16.2 (App Router)
- **Biblioteca de UI:** React 19.2
- **Linguagem:** TypeScript 5.9
- **Estilização:** Tailwind CSS v4.3 com variáveis semânticas para Dark/Light mode
- **Componentes:** Base UI + shadcn/ui primitives + Lucide Icons
- **Visualização de Dados:** Recharts (Radar de Competências)
- **Comunicação HTTP & Cache:** Axios + TanStack React Query v5
- **Formulários:** React Hook Form + Zod
- **Testes:** Vitest + React Testing Library + JSDOM

### Principais Funcionalidades - Frontend

- **Onboarding e Seleção de Papel (`/role`):** Fluxo direcionado para Candidatos ou Recrutadores.
- **Painel do Candidato (`/candidate/dashboard`):**
  - **Radar de Habilidades:** Visualização gráfica do mapeamento de competências por stack.
  - **Avaliações Técnicas:** Execução de quizzes com feedback imediato.
  - **Quadro de Gemas/Badges:** Insígnias conquistadas por testes.
  - **Vagas:** Busca e candidatura com filtros.
  - **Perfil:** Edição de dados pessoais, pretensões e histórico profissional.
- **Painel do Recrutador (`/recruiter/dashboard`):**
  - Publicação e gestão de vagas.
- **Next.js 16 Routing Proxy (`proxy.ts`):**
  - Bloqueio de rotas protegidas no servidor.
  - Renovação silenciosa de `auth_token` usando `refresh_token` armazenado em cookies.

### Configuração e Execução do Frontend

#### Pré-requisitos

- **Node.js** >= 20.x
- **pnpm** instalado globalmente (`npm i -g pnpm`)

#### 1. Instalação de Dependências

```bash
cd web
pnpm install
```

#### 2. Variáveis de Ambiente (`web/.env`)

Copie o arquivo de exemplo e ajuste suas credenciais:

```bash
cp .env.example .env
```

#### 3. Execução em Desenvolvimento

```bash
pnpm dev
```

Acesse a aplicação em [http://localhost:3000](http://localhost:3000).

#### 4. Scripts do Frontend

| Script          | Ação                                                         |
| --------------- | ------------------------------------------------------------ |
| `pnpm dev`      | Inicia o servidor de desenvolvimento                         |
| `pnpm build`    | Gera o build de produção e verifica tipos TypeScript         |
| `pnpm test`     | Executa a suite de testes via Vitest                         |
| `pnpm coverage` | Gera relatório de cobertura de testes (limiar mín. de 80%)   |
| `pnpm lint`     | Valida o código com ESLint 9                                 |
| `pnpm format`   | Formata o código com Prettier e organiza classes do Tailwind |

---

## ⚡ Execução Rápida Fullstack

Para rodar todo o ambiente de desenvolvimento localmente:

### Passo 1: Iniciar Banco de Dados e Backend

```bash
# Terminal 1 - Banco de dados
cd api
make dev

# Terminal 2 - Executar API Spring Boot
cd api
make run
```

### Passo 2: Iniciar Frontend Web

```bash
# Terminal 3 - Frontend Next.js
cd web
pnpm dev
```

Acesse:

- **Aplicação Web:** [http://localhost:3000](http://localhost:3000)
- **API REST / Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **PostgreSQL:** `localhost:5432` (banco: `gemstone_seekers_db`)

---

## 🧪 Testes e Garantia de Qualidade

Ambos os projetos possuem metas rígidas de cobertura e validação estática de código:

### Frontend

- **Framework:** Vitest + Testing Library
- **Meta de Cobertura:** 80% em Linhas, Funções, Branches e Declarações.
- **Comando:** `pnpm coverage`

### Backend

- **Framework:** JUnit 5 + Mockito + RestAssured + Testcontainers (PostgreSQL)
- **Meta de Cobertura:** 80% de instruções e 70% de branches (JaCoCo).
- **Análise Estática:** SpotBugs (0 violações permitidas).
- **Comando:** `make verify` ou `./mvnw verify`

---

## 👥 Equipe e Contribuições

Este projeto foi desenvolvido pelo time **Gemstone Seekers**. Abaixo estão descritas as principais atribuições e contribuições de cada integrante:

| Integrante                                                                                                            | Principais Contribuições                                                                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Danrley**<br>[GitHub](https://github.com/senegalha) • [LinkedIn](https://www.linkedin.com/in/senegalha/)            | • Liderança em DevOps e infraestrutura.<br>• Arquitetura e desenvolvimento Back-end.<br>• Gestão e definição de issues do projeto.                                                                                       |
| **Wevelle**<br>[GitHub](https://github.com/wellpaper23) • [LinkedIn](https://www.linkedin.com/in/wevelle-barbosa/)    | • Implementação dos serviços de Spring AI com Google GenAI para geração de questões.<br>• Modelagem de dados e desenvolvimendo endpoints REST no backend.<br>• Idealização inicial do projeto com análise de requisitos. |
| **Thiago**<br>[GitHub](https://github.com/thiagokilu) • [LinkedIn](linkedin.com/in/thiago-alexandre-cavalcante)       | • Arquitetura e desenvolvimento do Front-end.<br>• Desenvolvimento de features no Front-end.<br>• Idealização inicial do projeto com análise de requisitos.                                                              |
| **Matheus**<br>[GitHub](https://github.com/matheusdsilva) • [LinkedIn](https://www.linkedin.com/in/matheus-silva-ti/) | • Definição de padrões e estrutura no Front-end.<br>• Desenvolvimento de features no Front-end.<br>• Testes e report de bugs.                                                                                            |

---

<div align="center">
Desenvolvido com 💎 pela equipe <strong>Gemstone Seekers</strong>
</div>
