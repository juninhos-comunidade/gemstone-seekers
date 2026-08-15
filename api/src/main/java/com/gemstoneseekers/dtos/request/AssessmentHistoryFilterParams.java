package com.gemstoneseekers.dtos.request;

import com.gemstoneseekers.enums.AssessmentStatus;

public record AssessmentHistoryFilterParams(String technology, AssessmentStatus status) {
}
