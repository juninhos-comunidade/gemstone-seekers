package com.gemstoneseekers.repositories;

import com.gemstoneseekers.models.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    @Query(value = """
        SELECT q.*
        FROM questions q
        WHERE q.technology_id = :technologyId
          AND NOT EXISTS (
              SELECT 1
              FROM candidate_answers ca
              JOIN tests t ON ca.test_id = t.id
              WHERE ca.question_id = q.id
                AND t.candidate_id = :candidateId
          )
        ORDER BY RANDOM()
        LIMIT :limit
        """, nativeQuery = true)
    List<Question> findUnansweredRandomByTechnologyAndCandidate(
        @Param("technologyId") Integer technologyId,
        @Param("candidateId") UUID candidateId,
        @Param("limit") int limit
    );

}
