package com.gemstoneseekers.dtos.request;

import java.time.LocalDate;

public record EducationRequest(
    String institution,
    String fieldOfStudy,
    String degree,
    LocalDate startDate,
    LocalDate completionDate
) {
}
