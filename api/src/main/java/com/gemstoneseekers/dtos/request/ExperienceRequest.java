package com.gemstoneseekers.dtos.request;

import java.time.LocalDate;

public record ExperienceRequest(String title, String companyName, LocalDate startDate, LocalDate endDate,
        Boolean isCurrent, String description) {

}
