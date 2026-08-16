package com.gemstoneseekers.dtos.response;

import java.math.BigDecimal;
import java.time.Instant;

public record CandidateBadgeResponse(
    String badgeName,
    String technologyName,
    String description,
    BigDecimal scoreAchieved,
    Instant earnedAt
) {
}
