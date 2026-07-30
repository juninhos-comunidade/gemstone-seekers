package com.gemstoneseekers.dtos.request;

import com.gemstoneseekers.models.UserRole;

import jakarta.validation.constraints.NotNull;

public record CompleteRegistrationRequest(
    @NotNull UserRole role,
    String documentType,
    String documentNumber) {
}
