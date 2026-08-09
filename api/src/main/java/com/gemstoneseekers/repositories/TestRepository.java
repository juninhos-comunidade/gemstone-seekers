package com.gemstoneseekers.repositories;

import com.gemstoneseekers.enums.TestStatus;
import com.gemstoneseekers.models.Candidate;
import com.gemstoneseekers.models.Technology;
import com.gemstoneseekers.models.Test;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TestRepository extends JpaRepository<Test, UUID> {
    @EntityGraph(attributePaths = {"technology", "answers", "answers.question", "answers.question.options"})
    Optional<Test> findByCandidateAndTechnologyAndStatus(Candidate candidate, Technology technology, TestStatus testStatus);
}
