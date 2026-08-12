package com.gemstoneseekers.dtos.response;

import java.util.List;
import java.util.UUID;

public record CandidateTestHistoryResponse(
    UUID candidateId,
    int totalExecutedTests,
    List<TechnologyHistoryGroupResponse> historyByTechnology
) {}
