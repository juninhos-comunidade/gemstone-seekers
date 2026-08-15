package com.gemstoneseekers.projections;

import com.gemstoneseekers.enums.QuestionDifficulty;

public interface StockProjection {
    Integer getTechnologyId();

    QuestionDifficulty getDifficultyLevel();

    Long getStockCount();
}
