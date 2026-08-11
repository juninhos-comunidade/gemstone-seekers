package com.gemstoneseekers.repositories;

import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.models.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query(value = """
        SELECT q.* FROM questions q
        JOIN technologies t ON q.technology_id = t.id
        WHERE LOWER(t.name) = LOWER(:technologyName)
          AND q.difficulty = :#{#difficulty.name()}
          AND q.id NOT IN (
              SELECT ca.question_id
              FROM candidate_answers ca
              JOIN tests tst ON ca.test_id = tst.id
              WHERE tst.candidate_id = :candidateId
          )
        ORDER BY RANDOM()
        LIMIT :amount
        """, nativeQuery = true)
    List<Question> findUnansweredRandomByTechnologyAndDifficulty(
        @Param("technologyName") String technologyName,
        @Param("difficulty") QuestionDifficulty difficulty,
        @Param("candidateId") UUID candidateId,
        @Param("amount") int amount
    );
}
