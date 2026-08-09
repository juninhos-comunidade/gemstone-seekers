package com.gemstoneseekers.dtos.response;

import com.gemstoneseekers.enums.TestStatus;

import java.util.List;
import java.util.UUID;

public record TestResponse(
    UUID id,
    TechnologyResponse technologyResponse,
    TestStatus status,
    List<QuestionResponse> questions

) {
}
