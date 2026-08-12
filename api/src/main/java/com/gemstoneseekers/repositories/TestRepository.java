package com.gemstoneseekers.repositories;

import com.gemstoneseekers.enums.TestStatus;
import com.gemstoneseekers.models.Test;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TestRepository extends JpaRepository<Test, UUID> {
    @EntityGraph(attributePaths = {"technology", "answers", "answers.question", "answers.question.options"})

    Optional<Test> findByCandidateIdAndTechnologyNameAndStatus(UUID id, String technologyName, TestStatus testStatus);

    List<Test> findByCandidateIdOrderByCreatedAtDesc(UUID id);

    List<Test> findAll(Specification<Test> specification, Sort sort);
}
