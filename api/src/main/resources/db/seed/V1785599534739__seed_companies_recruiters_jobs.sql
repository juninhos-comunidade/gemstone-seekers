-- =============================================================================
-- SEED: DATA (users, companies, recruiters, jobs, job_technologies)
-- =============================================================================
-- NOTES:
--   - Password for all users is "password" (BCrypt hash, cost 10)
--   - Technology IDs reference V1785528213627__seed_catalog_data.sql:
--     1=Java, 2=Python, 3=JavaScript, 4=TypeScript, 5=React,
--     6=Spring Boot, 7=Node.js, 8=PostgreSQL, 9=Docker, 10=AWS
-- =============================================================================

-- USERS (recruiters)
INSERT INTO users (id, name, email, password, role, created_at, updated_at)
VALUES ('019fbc00-0001-7000-8000-000000000001', 'Alice Silva', 'alice.silva@techcorp.com',
        '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3gYkqDxV9V5SiSi', 'RECRUITER', NOW(), NOW()),
       ('019fbc00-0002-7000-8000-000000000002', 'Carlos Mendes', 'carlos.mendes@techcorp.com',
        '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3gYkqDxV9V5SiSi', 'RECRUITER', NOW(), NOW()),
       ('019fbc00-0003-7000-8000-000000000003', 'Diana Costa', 'diana.costa@innovadigital.com',
        '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3gYkqDxV9V5SiSi', 'RECRUITER', NOW(), NOW()),
       ('019fbc00-0004-7000-8000-000000000004', 'Eduardo Lima', 'eduardo.lima@datavision.com',
        '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3gYkqDxV9V5SiSi', 'RECRUITER', NOW(), NOW());

-- COMPANIES
INSERT INTO companies (id, name, cnpj, created_at, updated_at)
VALUES ('019fbc00-0010-7000-8000-000000000010', 'TechCorp Solutions', '12345678000190', NOW(), NOW()),
       ('019fbc00-0011-7000-8000-000000000011', 'Innova Digital', '98765432000110', NOW(), NOW()),
       ('019fbc00-0012-7000-8000-000000000012', 'DataVision Analytics', '45678912000130', NOW(), NOW());

-- RECRUITERS (link users to companies)
INSERT INTO recruiters (id, user_id, company_id, department, created_at, updated_at)
VALUES ('019fbc00-0020-7000-8000-000000000020', '019fbc00-0001-7000-8000-000000000001',
        '019fbc00-0010-7000-8000-000000000010', 'Engineering', NOW(), NOW()),
       ('019fbc00-0021-7000-8000-000000000021', '019fbc00-0002-7000-8000-000000000002',
        '019fbc00-0010-7000-8000-000000000010', 'Product', NOW(), NOW()),
       ('019fbc00-0022-7000-8000-000000000022', '019fbc00-0003-7000-8000-000000000003',
        '019fbc00-0011-7000-8000-000000000011', 'Engineering', NOW(), NOW()),
       ('019fbc00-0023-7000-8000-000000000023', '019fbc00-0004-7000-8000-000000000004',
        '019fbc00-0012-7000-8000-000000000012', 'Data Science', NOW(), NOW());

-- JOBS
INSERT INTO jobs (id, recruiter_id, company_id, title, description, seniority_level, department, salary_min, salary_max,
                  status, created_at, updated_at)
VALUES ('019fbc00-0030-7000-8000-000000000030', '019fbc00-0020-7000-8000-000000000020',
        '019fbc00-0010-7000-8000-000000000010',
        'Senior Java Developer',
        'We are looking for a Senior Java Developer with strong experience in Spring Boot, microservices architecture, and cloud-native applications. You will be responsible for designing and implementing scalable backend services.',
        'Senior', 'Engineering', 8000.00, 12000.00, 'OPEN', NOW(), NOW()),

       ('019fbc00-0031-7000-8000-000000000031', '019fbc00-0021-7000-8000-000000000021',
        '019fbc00-0010-7000-8000-000000000010',
        'Frontend React Developer',
        'Join our product team to build modern, responsive web applications using React and TypeScript. You will work closely with designers and backend engineers to deliver exceptional user experiences.',
        'Mid', 'Product', 5000.00, 8000.00, 'OPEN', NOW(), NOW()),

       ('019fbc00-0032-7000-8000-000000000032', '019fbc00-0022-7000-8000-000000000022',
        '019fbc00-0011-7000-8000-000000000011',
        'Full Stack Engineer',
        'We are seeking a Full Stack Engineer proficient in JavaScript, React, and Node.js. You will own features end-to-end, from database to UI, in a fast-paced agile environment.',
        'Senior', 'Engineering', 7000.00, 11000.00, 'OPEN', NOW(), NOW()),

       ('019fbc00-0033-7000-8000-000000000033', '019fbc00-0023-7000-8000-000000000023',
        '019fbc00-0012-7000-8000-000000000012',
        'Data Scientist',
        'Looking for a Data Scientist with expertise in Python, statistical modeling, and machine learning. Experience with cloud platforms (AWS) and big data technologies is a plus.',
        'Mid', 'Data Science', 6000.00, 10000.00, 'CLOSED', NOW(), NOW()),

       ('019fbc00-0034-7000-8000-000000000034', '019fbc00-0020-7000-8000-000000000020',
        '019fbc00-0010-7000-8000-000000000010',
        'DevOps Engineer',
        'Seeking a DevOps Engineer to manage our CI/CD pipelines, container orchestration with Docker, and cloud infrastructure on AWS. Strong scripting and automation skills required.',
        'Junior', 'Infrastructure', 4000.00, 7000.00, 'CANCELLED', NOW(), NOW());

-- JOB TECHNOLOGIES (references technologies from seed_catalog_data)
-- Tech IDs: 1=Java, 2=Python, 3=JavaScript, 4=TypeScript, 5=React,
--           6=Spring Boot, 7=Node.js, 8=PostgreSQL, 9=Docker, 10=AWS
INSERT INTO job_technologies (job_id, technology_id, is_mandatory)
VALUES
    -- Senior Java Developer
    ('019fbc00-0030-7000-8000-000000000030', 1, true),  -- Java (mandatory)
    ('019fbc00-0030-7000-8000-000000000030', 6, true),  -- Spring Boot (mandatory)
    ('019fbc00-0030-7000-8000-000000000030', 8, false), -- PostgreSQL (optional)
    ('019fbc00-0030-7000-8000-000000000030', 9, false), -- Docker (optional)
    -- Frontend React Developer
    ('019fbc00-0031-7000-8000-000000000031', 3, true),  -- JavaScript (mandatory)
    ('019fbc00-0031-7000-8000-000000000031', 5, true),  -- React (mandatory)
    ('019fbc00-0031-7000-8000-000000000031', 4, false), -- TypeScript (optional)
    -- Full Stack Engineer
    ('019fbc00-0032-7000-8000-000000000032', 3, true),  -- JavaScript (mandatory)
    ('019fbc00-0032-7000-8000-000000000032', 5, true),  -- React (mandatory)
    ('019fbc00-0032-7000-8000-000000000032', 7, true),  -- Node.js (mandatory)
    ('019fbc00-0032-7000-8000-000000000032', 4, false), -- TypeScript (optional)
    -- Data Scientist
    ('019fbc00-0033-7000-8000-000000000033', 2, true),  -- Python (mandatory)
    ('019fbc00-0033-7000-8000-000000000033', 8, true),  -- PostgreSQL (mandatory)
    ('019fbc00-0033-7000-8000-000000000033', 10, false); -- AWS (optional)
