package com.gemstoneseekers.dtos.response;

public record TechnologyDemandResponse(Integer technologyId, String technologyName, String technologyCategory,
        Long jobCount, Long mandatoryCount) {
}
