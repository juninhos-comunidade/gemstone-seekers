package com.gemstoneseekers.dtos.response;

import java.math.BigDecimal;
import java.util.UUID;

import com.gemstoneseekers.enums.JobStatus;

public record JobResponse(
    UUID id,
    String title,
    String description,
    String seniorityLevel,
    String department,
    BigDecimal salaryMin,
    BigDecimal salaryMax,
    JobStatus status,
    UUID recruiterId,
    UUID companyId) {
}
