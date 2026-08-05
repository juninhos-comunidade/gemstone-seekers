package com.gemstoneseekers.dtos.request;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record JobRequest(@NotBlank String title, @NotBlank String description, String seniorityLevel, String department,
        BigDecimal salaryMin, BigDecimal salaryMax, @NotNull UUID recruiterId, @NotNull UUID companyId) {
}
