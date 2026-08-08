package com.gemstoneseekers.dtos.request;

import java.time.LocalDate;

public record ProjectRequest(String name, String description, String projectUrl, LocalDate startDate, LocalDate endDate

) {
}
