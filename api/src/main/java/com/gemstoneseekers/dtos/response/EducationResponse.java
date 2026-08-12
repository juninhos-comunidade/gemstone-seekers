package com.gemstoneseekers.dtos.response;

import java.time.LocalDate;
import java.util.UUID;

public record EducationResponse(UUID id, String institution, String fieldOfStudy, String degree, LocalDate startDate,
        LocalDate completionDate) {
}
