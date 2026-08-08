package com.gemstoneseekers.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.Set;

public record ProjectRequest(
    String name,
    String description,
    String projectUrl,
    LocalDate startDate,
    LocalDate endDate

) {}
