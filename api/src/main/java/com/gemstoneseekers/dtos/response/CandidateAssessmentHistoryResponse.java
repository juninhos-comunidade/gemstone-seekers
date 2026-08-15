package com.gemstoneseekers.dtos.response;

import java.util.List;
import java.util.UUID;

public record CandidateAssessmentHistoryResponse(UUID candidateId, int totalExecutedTests,
        List<TechnologyHistoryGroupResponse> historyByTechnology) {
}
