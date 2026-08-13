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
          AND q.difficulty_level = CAST(:#{#difficulty.name()} AS question_difficulty)
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

    interface StockProjection {
        Integer getTechnologyId();

        QuestionDifficulty getDifficultyLevel();

        Long getStockCount();
    }

    @Query("""
        SELECT q.technology.id as technologyId,
               q.difficultyLevel as difficultyLevel,
               COUNT(q.id) as stockCount
        FROM Question q
        GROUP BY q.technology.id, q.difficultyLevel
    """)
    List<StockProjection> getQuestionStockReport();

    @Query("""
        SELECT COUNT(q) FROM Question q
        WHERE q.technology.id = :techId
        AND q.difficultyLevel = :difficulty
        AND q.id NOT IN (
            SELECT ca.question.id FROM CandidateAnswer ca
            WHERE ca.id = :candidateId
        )
    """)
    long countUnseenQuestions(@Param("candidateId") Long candidateId,
                              @Param("techId") Long techId,
                              @Param("difficulty") QuestionDifficulty difficulty);

    @Query(value = """
        SELECT q.* FROM questions q
        WHERE q.technology_id = :techId
          AND CAST(q.difficulty_level AS TEXT) = :difficulty
          AND q.id NOT IN (
              SELECT ca.question_id FROM candidate_answers ca
              INNER JOIN tests t ON ca.test_id = t.id
              WHERE t.candidate_id = :candidateId
          )
        ORDER BY RANDOM()
        LIMIT :limit
    """, nativeQuery = true)
    List<Question> findRandomUnseenQuestions(@Param("candidateId") UUID candidateId,
                                             @Param("techId") Integer techId,
                                             @Param("difficulty") String difficulty,
                                             @Param("limit") int limit);

    @Query(value = """
        SELECT q.* FROM questions q
        WHERE q.technology_id = :techId
          AND CAST(q.difficulty_level AS TEXT) = :difficulty
          AND q.id IN (
              SELECT ca.question_id FROM candidate_answers ca
              INNER JOIN tests t ON ca.test_id = t.id
              WHERE t.candidate_id = :candidateId
          )
        ORDER BY RANDOM()
        LIMIT :limit
    """, nativeQuery = true)
    List<Question> findRandomSeenQuestions(@Param("candidateId") UUID candidateId,
                                           @Param("techId") Integer techId,
                                           @Param("difficulty") String difficulty,
                                           @Param("limit") int limit);

}
