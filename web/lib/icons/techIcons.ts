import { httpClient } from "@/lib/api/client";

export type Technology = {
  id: number;
  name: string;
  category: string;
};

type TechnologiesResponse = {
  success: boolean;
  message: string;
  result: Technology[];
  error: {
    code: string;
    message: string;
    validations: {
      field: string;
      message: string;
    }[];
  } | null;
};

export const getTechnologies = async (): Promise<Technology[]> => {
  const response = await httpClient.get<TechnologiesResponse>(
    "/api/v1/technologies",
  );
  if (!response.data.success) {
    throw new Error(
      response.data.error?.message ?? "Erro ao buscar tecnologias",
    );
  }
  return response.data.result;
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
