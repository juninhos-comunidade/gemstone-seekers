package com.gemstoneseekers.dtos.request;

import com.gemstoneseekers.enums.TestStatus;

public record TestHistoryFilterParams(
    String technology,
    TestStatus status
) {}
