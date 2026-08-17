package com.gemstoneseekers.repositories;

import com.gemstoneseekers.enums.QuestionDifficulty;
import com.gemstoneseekers.models.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Integer> {
    Optional<Badge> findByTechnologyIdAndDifficultyLevel(Integer technologyId, QuestionDifficulty difficultyLevel);}
