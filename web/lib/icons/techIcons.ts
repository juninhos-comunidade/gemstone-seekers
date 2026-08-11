import { httpClient } from "@/lib/api/client";

export type Technology = {
  id: number;
  name: string;
  category: string;
};

type TechnologiesError =
  | {
      code: string;
      message: string;
      validations: {
        field: string;
        message: string;
      }[];
    }
  | string;

type TechnologiesResponse = {
  success: boolean;
  message: string;
  result: Technology[];
  error: TechnologiesError | null;
};

export const getTechnologies = async (): Promise<Technology[]> => {
  const response = await httpClient.get<TechnologiesResponse>(
    "/api/v1/technologies",
  );
  if (!response.success) {
    throw new Error(response.error?.message ?? "Erro ao buscar tecnologias");
  }
  return response.result;
};

export const techIcons: Record<string, string> = {
  JavaScript: "devicon:javascript",
  TypeScript: "devicon:typescript",
  Python: "devicon:python",
  Java: "devicon:java",
  React: "devicon:react",
  "Node.js": "vscode-icons:file-type-node",
  Git: "devicon:git",
  SQL: "devicon:mysql",
};

export const defaultIcon = "mdi:code-tags";
