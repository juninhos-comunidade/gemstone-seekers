package com.gemstoneseekers.dtos.request;

import com.gemstoneseekers.enums.TestStatus;

public record TestHistoryFilterRequest(
    String technology,
    TestStatus status
) {}
