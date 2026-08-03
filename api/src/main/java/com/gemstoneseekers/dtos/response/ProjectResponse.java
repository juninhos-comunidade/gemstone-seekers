package com.gemstoneseekers.dtos.response;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

public record ProjectResponse(
    UUID id,
    String name,
    String description,
    String projectUrl,
    LocalDate startDate,
    LocalDate endDate,
    Set<TechnologyResponse> technologies
) {}
