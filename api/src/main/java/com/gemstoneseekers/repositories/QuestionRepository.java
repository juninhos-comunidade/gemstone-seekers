package com.gemstoneseekers.repositories;

import com.gemstoneseekers.models.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    @Query(nativeQuery = true, value = """
        SELECT * FROM questions
        WHERE technology_id = :technologyId
          AND deleted_at IS NULL
        ORDER BY RANDOM()
        LIMIT :limit
    """)
    List<Question> findRandomByTechnologyId(
        @Param("technologyId") Integer technologyId,
        @Param("limit") int limit
    );
}
