-- =============================================================================
-- SEED: BADGES (Gamification Engine)
-- =============================================================================
-- NOTES:
--   - Technology IDs reference: 1=Java, 2=Python, 3=JavaScript, 4=TypeScript, 5=React,
--     6=Spring Boot, 7=Node.js, 8=PostgreSQL, 9=Docker, 10=AWS
-- =============================================================================

INSERT INTO badges (technology_id, name, description, minimum_score)
VALUES
    -- Java
    (1, 'Java Beginner', 'Insígnia concedida por demonstrar conhecimentos fundamentais em Java.', 6.00),
    (1, 'Java Intermediate', 'Insígnia concedida por domínio intermediário e boas práticas em Java.', 7.50),
    (1, 'Java Advanced', 'Insígnia concedida por domínio avançado e arquitetura em Java.', 9.00),

    -- Python
    (2, 'Python Beginner', 'Insígnia concedida por demonstrar conhecimentos fundamentais em Python.', 6.00),
    (2, 'Python Intermediate', 'Insígnia concedida por domínio intermediário e boas práticas em Python.', 7.50),
    (2, 'Python Advanced', 'Insígnia concedida por domínio avançado e arquitetura em Python.', 9.00),

    -- JavaScript
    (3, 'JavaScript Beginner', 'Insígnia concedida por demonstrar conhecimentos fundamentais em JavaScript.', 6.00),
    (3, 'JavaScript Intermediate', 'Insígnia concedida por domínio intermediário e boas práticas em JavaScript.', 7.50),
    (3, 'JavaScript Advanced', 'Insígnia concedida por domínio avançado em JavaScript.', 9.00),

    -- TypeScript
    (4, 'TypeScript Beginner', 'Insígnia concedida por demonstrar conhecimentos fundamentais em TypeScript.', 6.00),
    (4, 'TypeScript Intermediate', 'Insígnia concedida por domínio intermediário em TypeScript.', 7.50),
    (4, 'TypeScript Advanced', 'Insígnia concedida por domínio avançado e tipagem avançada em TypeScript.', 9.00),

    -- React
    (5, 'React Beginner', 'Insígnia concedida por conhecimentos fundamentais em componentes e hooks básicos do React.', 6.00),
    (5, 'React Intermediate', 'Insígnia concedida por domínio intermediário em arquitetura de componentes React.', 7.50),
    (5, 'React Advanced', 'Insígnia concedida por domínio avançado, performance e ecossistema React.', 9.00),

    -- Spring Boot
    (6, 'Spring Boot Beginner', 'Insígnia concedida por conhecimentos básicos em APIs REST com Spring Boot.', 6.00),
    (6, 'Spring Boot Intermediate', 'Insígnia concedida por domínio intermediário em Spring Boot e persistência de dados.', 7.50),
    (6, 'Spring Boot Advanced', 'Insígnia concedida por domínio avançado, microsserviços e segurança em Spring Boot.', 9.00),

    -- Node.js
    (7, 'Node.js Beginner', 'Insígnia concedida por conhecimentos fundamentais em assincronicidade e APIs com Node.js.', 6.00),
    (7, 'Node.js Intermediate', 'Insígnia concedida por domínio intermediário em arquitetura backend com Node.js.', 7.50),
    (7, 'Node.js Advanced', 'Insígnia concedida por domínio avançado, otimização e ecossistema Node.js.', 9.00),

    -- PostgreSQL
    (8, 'PostgreSQL Beginner', 'Insígnia concedida por conhecimentos fundamentais em consultas SQL e modelagem com PostgreSQL.', 6.00),
    (8, 'PostgreSQL Intermediate', 'Insígnia concedida por domínio intermediário em joins, índices e otimização no PostgreSQL.', 7.50),
    (8, 'PostgreSQL Advanced', 'Insígnia concedida por domínio avançado, tuning, stored procedures e arquitetura PostgreSQL.', 9.00),

    -- Docker
    (9, 'Docker Beginner', 'Insígnia concedida por conhecimentos básicos em criação de containers e imagens Docker.', 6.00),
    (9, 'Docker Intermediate', 'Insígnia concedida por domínio intermediário em Docker Compose e gestão de redes e volumes.', 7.50),
    (9, 'Docker Advanced', 'Insígnia concedida por domínio avançado em conteinerização, otimização de Dockerfiles e segurança.', 9.00),

    -- AWS
    (10, 'AWS Beginner', 'Insígnia concedida por conhecimentos fundamentais em serviços core da nuvem AWS.', 6.00),
    (10, 'AWS Intermediate', 'Insígnia concedida por domínio intermediário em arquitetura e serviços serverless/infra na AWS.', 7.50),
    (10, 'AWS Advanced', 'Insígnia concedida por domínio avançado em soluções corporativas, alta disponibilidade e segurança na AWS.', 9.00);
