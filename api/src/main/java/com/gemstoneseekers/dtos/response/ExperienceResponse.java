package com.gemstoneseekers.dtos.response;

import java.time.LocalDate;
import java.util.UUID;

public record ExperienceResponse(UUID id, String title, String companyName, LocalDate startDate, LocalDate endDate,
        Boolean isCurrent, String description) {
}
