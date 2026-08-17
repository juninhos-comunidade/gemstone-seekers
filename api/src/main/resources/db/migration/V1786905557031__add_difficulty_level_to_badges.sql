-- =============================================================================
-- MIGRATION: ADD DIFFICULTY LEVEL TO BADGES
-- =============================================================================

TRUNCATE TABLE badges CASCADE;

ALTER TABLE badges ADD COLUMN difficulty_level VARCHAR(50) NOT NULL;

ALTER TABLE badges ADD CONSTRAINT uk_badge_tech_difficulty UNIQUE (technology_id, difficulty_level);
