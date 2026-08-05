package com.gemstoneseekers.dtos.request;

import jakarta.validation.constraints.NotNull;

public record JobTechnologyRequest(@NotNull Integer technologyId, Boolean isMandatory) {
}
