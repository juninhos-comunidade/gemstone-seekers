-- =============================================================================
-- SEED: CATALOG DATA (countries, states, cities, technologies, languages)
-- =============================================================================

-- COUNTRIES
INSERT INTO countries (name, code_alpha2) VALUES ('Brazil', 'BR');
INSERT INTO countries (name, code_alpha2) VALUES ('United States', 'US');
INSERT INTO countries (name, code_alpha2) VALUES ('Portugal', 'PT');

-- STATES (country_id references countries)
INSERT INTO states (country_id, name) VALUES (1, 'São Paulo');
INSERT INTO states (country_id, name) VALUES (1, 'Rio de Janeiro');
INSERT INTO states (country_id, name) VALUES (1, 'Minas Gerais');
INSERT INTO states (country_id, name) VALUES (2, 'California');
INSERT INTO states (country_id, name) VALUES (2, 'New York');
INSERT INTO states (country_id, name) VALUES (3, 'Lisboa');
INSERT INTO states (country_id, name) VALUES (3, 'Porto');

-- CITIES (state_id references states)
INSERT INTO cities (state_id, name) VALUES (1, 'São Paulo');
INSERT INTO cities (state_id, name) VALUES (1, 'Campinas');
INSERT INTO cities (state_id, name) VALUES (1, 'Santos');
INSERT INTO cities (state_id, name) VALUES (2, 'Rio de Janeiro');
INSERT INTO cities (state_id, name) VALUES (2, 'Niterói');
INSERT INTO cities (state_id, name) VALUES (3, 'Belo Horizonte');
INSERT INTO cities (state_id, name) VALUES (3, 'Uberlândia');
INSERT INTO cities (state_id, name) VALUES (4, 'Los Angeles');
INSERT INTO cities (state_id, name) VALUES (4, 'San Francisco');
INSERT INTO cities (state_id, name) VALUES (5, 'New York City');
INSERT INTO cities (state_id, name) VALUES (6, 'Lisbon');
INSERT INTO cities (state_id, name) VALUES (7, 'Porto');

-- TECHNOLOGIES
INSERT INTO technologies (name, category) VALUES ('Java', 'Programming Language');
INSERT INTO technologies (name, category) VALUES ('Python', 'Programming Language');
INSERT INTO technologies (name, category) VALUES ('JavaScript', 'Programming Language');
INSERT INTO technologies (name, category) VALUES ('TypeScript', 'Programming Language');
INSERT INTO technologies (name, category) VALUES ('React', 'Frontend Framework');
INSERT INTO technologies (name, category) VALUES ('Spring Boot', 'Backend Framework');
INSERT INTO technologies (name, category) VALUES ('Node.js', 'Runtime');
INSERT INTO technologies (name, category) VALUES ('PostgreSQL', 'Database');
INSERT INTO technologies (name, category) VALUES ('Docker', 'DevOps');
INSERT INTO technologies (name, category) VALUES ('AWS', 'Cloud');

-- LANGUAGES
INSERT INTO languages (name) VALUES ('Portuguese');
INSERT INTO languages (name) VALUES ('English');
INSERT INTO languages (name) VALUES ('Spanish');
INSERT INTO languages (name) VALUES ('French');
INSERT INTO languages (name) VALUES ('German');
