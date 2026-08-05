package com.gemstoneseekers.dtos.request;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record RecruiterRequest(@NotNull UUID userId, String department) {
}
