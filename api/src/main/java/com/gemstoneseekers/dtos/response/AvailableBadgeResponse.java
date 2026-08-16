package com.gemstoneseekers.dtos.response;

import java.math.BigDecimal;

public record AvailableBadgeResponse(Integer badgeId, String badgeName, String technologyName, String description,
        BigDecimal minimumScoreRequired) {
}
