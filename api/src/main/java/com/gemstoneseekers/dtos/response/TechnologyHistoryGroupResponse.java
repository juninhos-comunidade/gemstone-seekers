package com.gemstoneseekers.dtos.response;

import java.util.List;

public record TechnologyHistoryGroupResponse(
    String technologyName,
    List<DifficultyHistoryGroupResponse> difficulties
) {}
