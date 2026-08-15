package com.gemstoneseekers.repositories;

import com.gemstoneseekers.enums.AssessmentStatus;
import com.gemstoneseekers.models.Assessment;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, UUID> {
    @EntityGraph(attributePaths = {"technology", "answers", "answers.question", "answers.question.options"})

    Optional<Assessment> findByCandidateIdAndTechnologyNameAndStatus(UUID id, String technologyName,
            AssessmentStatus testStatus);

    List<Assessment> findAll(Specification<Assessment> specification, Sort sort);
}
