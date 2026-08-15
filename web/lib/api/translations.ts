export const ENABLE_ERROR_TRANSLATION = true;

const ERROR_CODE_TRANSLATIONS: Record<string, string> = {
  INVALID_CREDENTIALS: "E-mail ou senha inválidos.",
  VALIDATION_ERROR: "Falha na validação dos dados. Verifique os campos.",
  NOT_FOUND: "Recurso não encontrado.",
  INVALID_ARGUMENT: "Parâmetro ou argumento fornecido é inválido.",
  CONFLICT: "Ocorreu um conflito com os dados informados.",
  ACCESS_DENIED: "Acesso negado. Você não tem permissão para esta ação.",
  INTERNAL_ERROR: "Ocorreu um erro interno no servidor. Tente novamente.",
  MALFORMED_JSON: "O formato da requisição enviada é inválido.",
  METHOD_NOT_ALLOWED: "Método HTTP não suportado para este recurso.",
  INVALID_PARAMETER: "Parâmetro fornecido é inválido.",
  DATA_INTEGRITY_VIOLATION:
    "Conflito de dados no sistema. Registro duplicado ou com dependências.",
  ECONNABORTED:
    "O servidor demorou muito para responder. Tente novamente em instantes.",
};

const EXACT_MESSAGE_TRANSLATIONS: Record<string, string> = {
  "invalid email or password": "E-mail ou senha inválidos.",
  "Login successful": "Login realizado com sucesso.",
  "validation failed": "Falha na validação dos dados.",
  "an unexpected error occurred": "Ocorreu um erro inesperado no servidor.",
  "database constraint violation occurred":
    "Ocorreu um conflito de dados no sistema.",
  "technology is already linked to this job":
    "Esta tecnologia já está vinculada a esta vaga.",
  "user is already linked as a recruiter":
    "Este usuário já está vinculado como recrutador.",
  "invalid request body": "Corpo da requisição inválido.",
  "method not allowed": "Método não permitido.",
  "data integrity error": "Erro de integridade nos dados.",
  "email não pode ser nulo ou vazio": "E-mail não pode ser nulo ou vazio.",
  "requisição do usuário não pode ser nula":
    "Requisição do usuário não pode ser nula.",
};

interface RegexTranslationPattern {
  pattern: RegExp;
  replace: string;
}

const REGEX_TRANSLATIONS: RegexTranslationPattern[] = [
  {
    pattern: /^User with id (.+) not found$/i,
    replace: "Usuário com ID '$1' não encontrado.",
  },
  {
    pattern: /^Candidate with id (.+) not found$/i,
    replace: "Candidato com ID '$1' não encontrado.",
  },
  {
    pattern: /^project with id (.+) not found$/i,
    replace: "Projeto com ID '$1' não encontrado.",
  },
  {
    pattern: /^Job with id (.+) not found$/i,
    replace: "Vaga com ID '$1' não encontrada.",
  },
  {
    pattern: /^Technology with id (.+) not found$/i,
    replace: "Tecnologia com ID '$1' não encontrada.",
  },
  {
    pattern: /^Company with id (.+) not found$/i,
    replace: "Empresa com ID '$1' não encontrada.",
  },
  {
    pattern: /^Parameter '(.+)' should be of type '(.+)'$/i,
    replace: "O parâmetro '$1' deve ser do tipo '$2'.",
  },
  {
    pattern: /^timeout of \d+ms exceeded$/i,
    replace:
      "O servidor demorou muito para responder. Tente novamente em instantes.",
  },
];

const VALIDATION_MESSAGE_TRANSLATIONS: Record<string, string> = {
  "must not be blank": "não pode estar em branco.",
  "must not be empty": "não pode estar vazio.",
  "must not be null": "não pode ser nulo.",
  "must be a well-formed email address":
    "deve ser um endereço de e-mail válido.",
};

const SUCCESS_MESSAGE_TRANSLATIONS: Record<string, string> = {
  "login successful": "Login realizado com sucesso!",
  "user registered successfully": "Conta criada com sucesso!",
  "registration completed successfully": "Cadastro concluído com sucesso!",
  "token refreshed successfully": "Sessão renovada com sucesso!",
  "job created successfully": "Vaga criada com sucesso!",
  "job updated successfully": "Vaga atualizada com sucesso!",
  "job deleted successfully": "Vaga removida com sucesso!",
  "company created successfully": "Empresa cadastrada com sucesso!",
  "company updated successfully": "Empresa atualizada com sucesso!",
  "company deleted successfully": "Empresa removida com sucesso!",
  "technology linked to job successfully":
    "Tecnologia vinculada à vaga com sucesso!",
  "technology unlinked from job successfully":
    "Tecnologia desvinculada da vaga com sucesso!",
  "recruiter linked to company successfully":
    "Recrutador vinculado à empresa com sucesso!",
  "candidate address updated successfully": "Endereço atualizado com sucesso!",
  "user info updated successfully":
    "Informações do usuário atualizadas com sucesso!",
  "link added successfully": "Link adicionado com sucesso!",
  "link deleted successfully": "Link removido com sucesso!",
  "experience added successfully": "Experiência adicionada com sucesso!",
  "experience deleted successfully": "Experiência removida com sucesso!",
  "education added successfully": "Formação acadêmica adicionada com sucesso!",
  "education deleted successfully": "Formação acadêmica removida com sucesso!",
  "certification added successfully": "Certificação adicionada com sucesso!",
  "certification deleted successfully": "Certificação removida com sucesso!",
  "language added successfully": "Idioma adicionado com sucesso!",
  "language deleted successfully": "Idioma removido com sucesso!",
  "project added successfully": "Projeto adicionado com sucesso!",
  "project deleted successfully": "Projeto removido com sucesso!",
};

export function translateSuccessMessage(originalMessage?: string): string {
  if (!ENABLE_ERROR_TRANSLATION || !originalMessage) {
    return originalMessage || "";
  }
  const normalized = originalMessage.trim().toLowerCase();
  return SUCCESS_MESSAGE_TRANSLATIONS[normalized] || originalMessage;
}

export function translateValidationMessage(message: string): string {
  if (!ENABLE_ERROR_TRANSLATION || !message) return message;
  const normalized = message.trim().toLowerCase();
  return VALIDATION_MESSAGE_TRANSLATIONS[normalized] || message;
}

export function translateErrorMessage(
  originalMessage?: string,
  errorCode?: string,
): string {
  if (!ENABLE_ERROR_TRANSLATION) {
    return originalMessage || "An error occurred during the request.";
  }

  const cleanMessage = originalMessage?.trim();

  if (cleanMessage) {
    const translatedByMessage = translateByMessageOrRegex(cleanMessage);
    if (translatedByMessage !== cleanMessage) {
      return translatedByMessage;
    }
  }

  if (errorCode && ERROR_CODE_TRANSLATIONS[errorCode]) {
    return ERROR_CODE_TRANSLATIONS[errorCode];
  }

  return (
    cleanMessage ||
    originalMessage ||
    "Ocorreu um erro ao processar a requisição."
  );
}

function translateByMessageOrRegex(message: string): string {
  const normalized = message.toLowerCase();

  if (EXACT_MESSAGE_TRANSLATIONS[normalized]) {
    return EXACT_MESSAGE_TRANSLATIONS[normalized];
  }

  for (const item of REGEX_TRANSLATIONS) {
    if (item.pattern.test(message)) {
      return message.replace(item.pattern, item.replace);
    }
  }

  return message;
}
