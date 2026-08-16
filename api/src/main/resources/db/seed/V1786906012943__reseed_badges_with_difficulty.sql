-- =============================================================================
-- SEED REVISION: BADGES WITH DIFFICULTY LEVEL
-- =============================================================================
-- NOTES:
--   - Technology IDs reference: 1=Java, 2=Python, 3=JavaScript, 4=TypeScript, 5=React,
--     6=Spring Boot, 7=Node.js, 8=PostgreSQL, 9=Docker, 10=AWS
--   - Difficulty Levels: BEGINNER, INTERMEDIATE, ADVANCED
-- =============================================================================

INSERT INTO badges (technology_id, difficulty_level, name, description, minimum_score)
VALUES
    -- Java
    (1, 'BEGINNER', 'Java Beginner', 'Insígnia concedida por demonstrar conhecimentos fundamentais em Java.', 6.00),
    (1, 'INTERMEDIATE', 'Java Intermediate', 'Insígnia concedida por domínio intermediário e boas práticas em Java.', 7.50),
    (1, 'ADVANCED', 'Java Advanced', 'Insígnia concedida por domínio avançado e arquitetura em Java.', 9.00),

    -- Python
    (2, 'BEGINNER', 'Python Beginner', 'Insígnia concedida por demonstrar conhecimentos fundamentais em Python.', 6.00),
    (2, 'INTERMEDIATE', 'Python Intermediate', 'Insígnia concedida por domínio intermediário e boas práticas em Python.', 7.50),
    (2, 'ADVANCED', 'Python Advanced', 'Insígnia concedida por domínio avançado e arquitetura em Python.', 9.00),

    -- JavaScript
    (3, 'BEGINNER', 'JavaScript Beginner', 'Insígnia concedida por demonstrar conhecimentos fundamentais em JavaScript.', 6.00),
    (3, 'INTERMEDIATE', 'JavaScript Intermediate', 'Insígnia concedida por domínio intermediário e boas práticas em JavaScript.', 7.50),
    (3, 'ADVANCED', 'JavaScript Advanced', 'Insígnia concedida por domínio avançado em JavaScript.', 9.00),

    -- TypeScript
    (4, 'BEGINNER', 'TypeScript Beginner', 'Insígnia concedida por demonstrar conhecimentos fundamentais em TypeScript.', 6.00),
    (4, 'INTERMEDIATE', 'TypeScript Intermediate', 'Insígnia concedida por domínio intermediário em TypeScript.', 7.50),
    (4, 'ADVANCED', 'TypeScript Advanced', 'Insígnia concedida por domínio avançado e tipagem avançada em TypeScript.', 9.00),

    -- React
    (5, 'BEGINNER', 'React Beginner', 'Insígnia concedida por conhecimentos fundamentais em componentes e hooks básicos do React.', 6.00),
    (5, 'INTERMEDIATE', 'React Intermediate', 'Insígnia concedida por domínio intermediário em arquitetura de componentes React.', 7.50),
    (5, 'ADVANCED', 'React Advanced', 'Insígnia concedida por domínio avançado, performance e ecossistema React.', 9.00),

    -- Spring Boot
    (6, 'BEGINNER', 'Spring Boot Beginner', 'Insígnia concedida por conhecimentos básicos em APIs REST com Spring Boot.', 6.00),
    (6, 'INTERMEDIATE', 'Spring Boot Intermediate', 'Insígnia concedida por domínio intermediário em Spring Boot e persistência de dados.', 7.50),
    (6, 'ADVANCED', 'Spring Boot Advanced', 'Insígnia concedida por domínio avançado, microsserviços e segurança em Spring Boot.', 9.00),

    -- Node.js
    (7, 'BEGINNER', 'Node.js Beginner', 'Insígnia concedida por conhecimentos fundamentais em assincronicidade e APIs com Node.js.', 6.00),
    (7, 'INTERMEDIATE', 'Node.js Intermediate', 'Insígnia concedida por domínio intermediário em arquitetura backend com Node.js.', 7.50),
    (7, 'ADVANCED', 'Node.js Advanced', 'Insígnia concedida por domínio avançado, otimização e ecossistema Node.js.', 9.00),

    -- PostgreSQL
    (8, 'BEGINNER', 'PostgreSQL Beginner', 'Insígnia concedida por conhecimentos fundamentais em consultas SQL e modelagem com PostgreSQL.', 6.00),
    (8, 'INTERMEDIATE', 'PostgreSQL Intermediate', 'Insígnia concedida por domínio intermediário em joins, índices e otimização no PostgreSQL.', 7.50),
    (8, 'ADVANCED', 'PostgreSQL Advanced', 'Insígnia concedida por domínio avançado, tuning, stored procedures e arquitetura PostgreSQL.', 9.00),

    -- Docker
    (9, 'BEGINNER', 'Docker Beginner', 'Insígnia concedida por conhecimentos básicos em criação de containers e imagens Docker.', 6.00),
    (9, 'INTERMEDIATE', 'Docker Intermediate', 'Insígnia concedida por domínio intermediário em Docker Compose e gestão de redes e volumes.', 7.50),
    (9, 'ADVANCED', 'Docker Advanced', 'Insígnia concedida por domínio avançado em conteinerização, otimização de Dockerfiles e segurança.', 9.00),

    -- AWS
    (10, 'BEGINNER', 'AWS Beginner', 'Insígnia concedida por conhecimentos fundamentais em serviços core da nuvem AWS.', 6.00),
    (10, 'INTERMEDIATE', 'AWS Intermediate', 'Insígnia concedida por domínio intermediário em arquitetura e serviços serverless/infra na AWS.', 7.50),
    (10, 'ADVANCED', 'AWS Advanced', 'Insígnia concedida por domínio avançado em soluções corporativas, alta disponibilidade e segurança na AWS.', 9.00);
