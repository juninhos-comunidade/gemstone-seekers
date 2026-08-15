ALTER TYPE test_status RENAME TO assessment_status;

ALTER TABLE tests RENAME TO assessments;
ALTER TABLE assessments RENAME CONSTRAINT pk_tests TO pk_assessments;
ALTER TABLE assessments RENAME CONSTRAINT fk_tests_candidate TO fk_assessments_candidate;
ALTER TABLE assessments RENAME CONSTRAINT fk_tests_technology TO fk_assessments_technology;

ALTER INDEX idx_tests_candidate_id RENAME TO idx_assessments_candidate_id;
ALTER INDEX idx_tests_technology_id RENAME TO idx_assessments_technology_id;
ALTER INDEX idx_tests_status RENAME TO idx_assessments_status;

ALTER TABLE candidate_answers RENAME COLUMN test_id TO assessment_id;
ALTER TABLE candidate_answers RENAME CONSTRAINT uq_candidate_answers TO uq_candidate_answers_assessment;
ALTER TABLE candidate_answers RENAME CONSTRAINT fk_candidate_answers_test TO fk_candidate_answers_assessment;

ALTER TABLE candidate_badges RENAME COLUMN test_id TO assessment_id;
ALTER TABLE candidate_badges RENAME CONSTRAINT fk_candidate_badges_test TO fk_candidate_badges_assessment;
ALTER INDEX idx_candidate_badges_test_id RENAME TO idx_candidate_badges_assessment_id;
